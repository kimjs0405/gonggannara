import { Star, ThumbsUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import SubVisual from '../components/SubVisual'

const ReviewsPage = () => {
  const reviews = [
    {
      id: 1,
      name: '김*수',
      rating: 5,
      date: '2024.01.15',
      service: '아파트 전체 리모델링',
      area: '32평',
      content: '처음부터 끝까지 친절하게 설명해주시고, 결과물도 너무 만족스러워요! 특히 주방 공간 활용도가 정말 좋아졌습니다. 시공 기간도 약속대로 지켜주셔서 신뢰가 갔어요.',
      likes: 24,
    },
    {
      id: 2,
      name: '이*희',
      rating: 5,
      date: '2024.01.10',
      service: '주방 인테리어',
      area: '15평',
      content: '예산에 맞춰서 최선의 방안을 제시해주셨어요. 다른 업체들은 무조건 비싼 자재만 권했는데, 공간나라는 합리적인 선택지를 주셔서 좋았습니다. 강력 추천합니다!',
      likes: 18,
    },
    {
      id: 3,
      name: '박*준',
      rating: 5,
      date: '2023.12.28',
      service: '신혼집 인테리어',
      area: '24평',
      content: '시공 기간도 정확하게 지켜주시고 마무리도 깔끔했습니다. 신혼집이라 걱정이 많았는데 결과가 너무 만족스러워서 친구들한테도 추천했어요.',
      likes: 32,
    },
    {
      id: 4,
      name: '최*영',
      rating: 5,
      date: '2023.12.20',
      service: '사무실 인테리어',
      area: '50평',
      content: '사무실 인테리어를 맡겼는데 직원들 모두 만족하고 있습니다. 업무 효율도 높아진 것 같고, 방문하시는 분들도 사무실이 예쁘다고 칭찬하세요.',
      likes: 15,
    },
    {
      id: 5,
      name: '정*민',
      rating: 4,
      date: '2023.12.15',
      service: '욕실 리모델링',
      area: '3평',
      content: '욕실만 리모델링했는데 집 전체가 새집이 된 느낌이에요. 방수 처리도 꼼꼼하게 해주시고, 사용하기 편한 구조로 바꿔주셨습니다.',
      likes: 21,
    },
    {
      id: 6,
      name: '한*서',
      rating: 5,
      date: '2023.12.08',
      service: '카페 인테리어',
      area: '40평',
      content: '카페 오픈 전 인테리어를 맡겼습니다. 제가 원하는 분위기를 정확히 이해하시고 그 이상으로 구현해주셨어요. 손님들 반응이 정말 좋습니다!',
      likes: 45,
    },
  ]

  const stats = {
    total: 328,
    average: 4.9,
    distribution: [95, 3, 1, 0.5, 0.5],
  }

  return (
    <div>
      <SubVisual
        title="고객 후기"
        subtitle="공간나라를 선택해주신 고객님들의 솔직한 후기입니다"
        breadcrumb={[{ name: '고객후기' }]}
        bgColor="from-amber-500 to-orange-600"
      />
      
      <div className="py-8 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4">

        {/* Stats */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-center gap-16">
            <div className="text-center">
              <p className="text-5xl font-black text-blue-600 mb-2">{stats.average}</p>
              <div className="flex items-center gap-1 justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-500">총 {stats.total}개의 후기</p>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star, idx) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-6">{star}점</span>
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${stats.distribution[idx]}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-10">{stats.distribution[idx]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900">{review.name}</span>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {review.service}
                    </span>
                    <span className="text-sm text-gray-500">{review.area}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                도움이 됐어요 {review.likes}
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-blue-600 rounded-2xl p-10 text-white">
          <h3 className="text-2xl font-bold mb-3">
            공간나라와 함께 새로운 공간을 만들어보세요
          </h3>
          <p className="text-blue-200 mb-6">
            무료 상담을 통해 견적을 받아보세요
          </p>
          <Link
            to="/estimate"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            무료 견적받기
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsPage

