import { useState, useEffect } from 'react'
import { 
  Search, 
  Star, 
  Trash2, 
  MessageSquare,
  User,
  Package,
  Eye
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  content: string
  created_at: string
  profiles?: { name: string; email: string }
  products?: { name: string; thumbnail_url: string }
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles(name, email),
        products(name, thumbnail_url)
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setReviews(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) return
    
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchReviews()
      setSelectedReview(null)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.products?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = filterRating === null || review.rating === filterRating

    return matchesSearch && matchesRating
  })

  const ratingStats = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percent: reviews.length > 0 
      ? Math.round((reviews.filter(r => r.rating === rating).length / reviews.length) * 100)
      : 0
  }))

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">리뷰 관리</h1>
          <p className="text-sm text-gray-500 mt-1">고객 리뷰를 확인하고 관리합니다.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 평점</p>
              <p className="text-2xl font-bold text-gray-800">{averageRating}</p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {renderStars(Math.round(parseFloat(averageRating)))}
          </div>
        </div>
        
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-3">평점 분포</p>
          <div className="space-y-2">
            {ratingStats.map(({ rating, count, percent }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{rating}점</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-16 text-right">{count}개 ({percent}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="리뷰 내용, 작성자, 상품명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">평점:</span>
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                filterRating === null 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                  filterRating === rating 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {rating}<Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">로딩 중...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>등록된 리뷰가 없습니다.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">상품</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">평점</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">리뷰 내용</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">작성자</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">작성일</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {review.products?.thumbnail_url ? (
                          <img src={review.products.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400 m-2.5" />
                        )}
                      </div>
                      <span className="text-sm text-gray-800 font-medium truncate max-w-[150px]">
                        {review.products?.name || '삭제된 상품'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-0.5">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-600 truncate max-w-[250px]">{review.content}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{review.profiles?.name || '탈퇴회원'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">리뷰 상세</h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {selectedReview.products?.thumbnail_url ? (
                    <img src={selectedReview.products.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400 m-3" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{selectedReview.products?.name || '삭제된 상품'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">평점</p>
                <div className="flex gap-1">
                  {renderStars(selectedReview.rating)}
                  <span className="ml-2 text-gray-700">{selectedReview.rating}점</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">리뷰 내용</p>
                <p className="text-gray-800 whitespace-pre-wrap p-3 bg-gray-50 rounded-lg">
                  {selectedReview.content}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">작성자</p>
                  <p className="text-gray-800">{selectedReview.profiles?.name || '탈퇴회원'}</p>
                  <p className="text-sm text-gray-400">{selectedReview.profiles?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">작성일</p>
                  <p className="text-gray-800">
                    {new Date(selectedReview.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedReview.id)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewsPage

