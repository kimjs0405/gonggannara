import { useState } from 'react'
import { Link } from 'react-router-dom'

const PortfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const categories = ['전체', '아파트', '주택', '오피스텔', '사무실', '상업공간']

  const portfolios = [
    { id: 1, title: '모던 아파트 전체 리모델링', location: '서울 강남구', area: '32평', style: '모던', category: '아파트' },
    { id: 2, title: '미니멀 원룸 인테리어', location: '서울 마포구', area: '10평', style: '미니멀', category: '오피스텔' },
    { id: 3, title: '북유럽 스타일 거실', location: '경기 성남시', area: '25평', style: '북유럽', category: '아파트' },
    { id: 4, title: '카페 인테리어 시공', location: '서울 홍대', area: '45평', style: '인더스트리얼', category: '상업공간' },
    { id: 5, title: '모던 클래식 주방', location: '서울 송파구', area: '28평', style: '클래식', category: '아파트' },
    { id: 6, title: 'IT 스타트업 사무실', location: '서울 강남구', area: '80평', style: '모던', category: '사무실' },
    { id: 7, title: '럭셔리 빌라 인테리어', location: '경기 용인시', area: '55평', style: '럭셔리', category: '주택' },
    { id: 8, title: '레스토랑 인테리어', location: '서울 이태원', area: '60평', style: '모던', category: '상업공간' },
    { id: 9, title: '신혼부부 아파트', location: '서울 노원구', area: '24평', style: '심플', category: '아파트' },
    { id: 10, title: '전원주택 리모델링', location: '경기 파주시', area: '42평', style: '내추럴', category: '주택' },
    { id: 11, title: '학원 인테리어', location: '서울 목동', area: '70평', style: '모던', category: '상업공간' },
    { id: 12, title: '1인 가구 오피스텔', location: '서울 역삼', area: '8평', style: '미니멀', category: '오피스텔' },
  ]

  const filteredPortfolios = selectedCategory === '전체' 
    ? portfolios 
    : portfolios.filter(p => p.category === selectedCategory)

  return (
    <div className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">포트폴리오</h1>
          <p className="text-gray-500 text-lg">
            공간나라가 만들어온 다양한 공간들을 확인해보세요
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-6">
          {filteredPortfolios.map((item) => (
            <Link
              key={item.id}
              to={`/portfolio/${item.id}`}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="h-52 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-2 py-1 bg-white/90 rounded text-xs font-medium text-gray-700 mb-2">
                    {item.style}
                  </span>
                  <h3 className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{item.location}</span>
                  <span>•</span>
                  <span>{item.area}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            나만의 공간을 만들고 싶으신가요?
          </h3>
          <p className="text-gray-500 mb-6">
            무료 상담을 통해 견적을 받아보세요
          </p>
          <Link
            to="/estimate"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            무료 견적받기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage

