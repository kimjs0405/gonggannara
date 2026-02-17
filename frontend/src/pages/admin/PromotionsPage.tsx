import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag,
  Calendar,
  Percent,
  Gift
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Coupon {
  id: string
  code: string
  name: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_discount: number | null
  start_date: string
  end_date: string
  usage_limit: number | null
  used_count: number
  is_active: boolean
}

const PromotionsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: 0,
    min_order_amount: 0,
    max_discount: null as number | null,
    start_date: '',
    end_date: '',
    usage_limit: null as number | null,
    is_active: true,
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCoupons(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCoupon) {
      const { error } = await supabase
        .from('coupons')
        .update(formData)
        .eq('id', editingCoupon.id)

      if (!error) {
        fetchCoupons()
        setShowModal(false)
        resetForm()
      }
    } else {
      const { error } = await supabase
        .from('coupons')
        .insert([{ ...formData, used_count: 0 }])

      if (!error) {
        fetchCoupons()
        setShowModal(false)
        resetForm()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 쿠폰을 삭제하시겠습니까?')) return
    
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchCoupons()
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      name: coupon.name,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_discount: coupon.max_discount,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      usage_limit: coupon.usage_limit,
      is_active: coupon.is_active,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingCoupon(null)
    setFormData({
      code: '',
      name: '',
      discount_type: 'percent',
      discount_value: 0,
      min_order_amount: 0,
      max_discount: null,
      start_date: '',
      end_date: '',
      usage_limit: null,
      is_active: true,
    })
  }

  const toggleActive = async (coupon: Coupon) => {
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: !coupon.is_active })
      .eq('id', coupon.id)

    if (!error) {
      fetchCoupons()
    }
  }

  const filteredCoupons = coupons.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatus = (coupon: Coupon) => {
    const now = new Date()
    const start = new Date(coupon.start_date)
    const end = new Date(coupon.end_date)

    if (!coupon.is_active) return { label: '비활성', color: 'bg-gray-100 text-gray-600' }
    if (now < start) return { label: '대기중', color: 'bg-yellow-100 text-yellow-700' }
    if (now > end) return { label: '만료됨', color: 'bg-red-100 text-red-600' }
    return { label: '진행중', color: 'bg-green-100 text-green-700' }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">프로모션 관리</h1>
          <p className="text-sm text-gray-500 mt-1">쿠폰 및 할인 이벤트를 관리합니다.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          쿠폰 등록
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="쿠폰명 또는 코드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">전체 쿠폰</p>
              <p className="text-xl font-bold text-gray-800">{coupons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">진행중</p>
              <p className="text-xl font-bold text-gray-800">
                {coupons.filter(c => getStatus(c).label === '진행중').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">대기중</p>
              <p className="text-xl font-bold text-gray-800">
                {coupons.filter(c => getStatus(c).label === '대기중').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 사용</p>
              <p className="text-xl font-bold text-gray-800">
                {coupons.reduce((sum, c) => sum + c.used_count, 0)}회
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">로딩 중...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-20 text-gray-500">등록된 쿠폰이 없습니다.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">쿠폰정보</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">할인</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">기간</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">사용</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">상태</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => {
                const status = getStatus(coupon)
                return (
                  <tr key={coupon.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{coupon.name}</p>
                      <p className="text-sm text-gray-500 font-mono">{coupon.code}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-blue-600">
                        {coupon.discount_type === 'percent' 
                          ? `${coupon.discount_value}%` 
                          : `${coupon.discount_value.toLocaleString()}원`}
                      </p>
                      {coupon.min_order_amount > 0 && (
                        <p className="text-xs text-gray-400">
                          {coupon.min_order_amount.toLocaleString()}원 이상
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      <p>{coupon.start_date}</p>
                      <p className="text-gray-400">~ {coupon.end_date}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {coupon.used_count}{coupon.usage_limit ? `/${coupon.usage_limit}` : ''}회
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleActive(coupon)}
                          className={`px-2 py-1 text-xs rounded ${
                            coupon.is_active 
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        >
                          {coupon.is_active ? '비활성화' : '활성화'}
                        </button>
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingCoupon ? '쿠폰 수정' : '쿠폰 등록'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰 코드</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">할인 유형</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percent' | 'fixed' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="percent">정률 (%)</option>
                    <option value="fixed">정액 (원)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">할인 값</label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">최소 주문 금액</label>
                <input
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사용 횟수 제한 (미입력시 무제한)</label>
                <input
                  type="number"
                  value={formData.usage_limit || ''}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">활성화</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCoupon ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromotionsPage

