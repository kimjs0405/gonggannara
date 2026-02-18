import { useState } from 'react'
import { Link } from 'react-router-dom'

const PortfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const categories = ['전체', '아파트', '주택', '오피스텔', '사무실', '상업공간']

  const portfolios: { id: number; title: string; location: string; area: string; style: string; category: string }[] = []

  const filteredPortfolios = selectedCategory === '전체' 
    ? portfolios 
    : portfolios.filter(p => p.category === selectedCategory)

  return (
    <div className="py-8 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">포트폴리오</h1>
          <p className="text-gray-500 text-sm md:text-lg">
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
        {filteredPortfolios.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filteredPortfolios.map((item) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.id}`}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="h-40 md:h-52 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2 py-1 bg-white/90 rounded text-xs font-medium text-gray-700 mb-2">
                      {item.style}
                    </span>
                    <h3 className="font-bold text-white text-sm md:text-lg group-hover:text-blue-200 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                    <span>{item.location}</span>
                    <span>•</span>
                    <span>{item.area}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-400 text-lg mb-2">등록된 포트폴리오가 없습니다</p>
            <p className="text-gray-400 text-sm">곧 새로운 시공 사례가 등록될 예정입니다</p>
          </div>
        )}

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

