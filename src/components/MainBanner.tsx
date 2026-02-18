import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MainBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const categories = [
    { name: '가구·소파·침대', icon: '🛋️' },
    { name: '조명·인테리어등', icon: '💡' },
    { name: '커튼·블라인드', icon: '🪟' },
    { name: '벽지·바닥재', icon: '🧱' },
    { name: '주방·욕실용품', icon: '🚿' },
    { name: '수납·정리용품', icon: '📦' },
    { name: '홈데코·소품', icon: '🎨' },
  ]

  const banners = [
    {
      id: 1,
      title: '모던 소파 컬렉션',
      subtitle: '거실의 품격을 높이는',
      bg: 'from-amber-100 to-orange-100',
      image: '🛋️',
      items: ['패브릭 소파', '가죽 소파', '리클라이너', '코너 소파']
    },
    {
      id: 2,
      title: '스마트 조명 시리즈',
      subtitle: '분위기를 바꾸는',
      bg: 'from-yellow-100 to-amber-100',
      image: '💡',
      items: ['펜던트 조명', 'LED 조명', '스탠드', '무드등']
    },
    {
      id: 3,
      title: '프리미엄 침구류',
      subtitle: '편안한 수면을 위한',
      bg: 'from-blue-100 to-indigo-100',
      image: '🛏️',
      items: ['침대 프레임', '매트리스', '침구 세트', '베개']
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Left Sidebar - Category */}
          <div className="w-52 flex-shrink-0">
            <div className="bg-blue-600 rounded-t-lg">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href="#"
                  className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-700 transition-colors ${
                    index !== 0 ? 'border-t border-blue-500' : ''
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Main Banner Slider */}
          <div className="flex-1 relative overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className={`min-w-full h-[380px] bg-gradient-to-br ${banner.bg} rounded-lg p-8 flex items-center justify-between`}
                >
                  <div className="flex-1">
                    <p className="text-gray-600 text-lg mb-2">{banner.subtitle}</p>
                    <h2 className="text-4xl font-black text-gray-800 mb-6">{banner.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      {banner.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-white/70 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors cursor-pointer"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[150px] opacity-80">{banner.image}</div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === idx ? 'bg-blue-600' : 'bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side Banners */}
          <div className="w-52 flex-shrink-0 flex flex-col gap-4">
            <div className="flex-1 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-5xl mb-2">🎁</span>
              <p className="text-sm font-bold text-gray-700">신규회원</p>
              <p className="text-xs text-gray-500">10% 할인쿠폰</p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-5xl mb-2">🚚</span>
              <p className="text-sm font-bold text-gray-700">무료배송</p>
              <p className="text-xs text-gray-500">5만원 이상 구매시</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainBanner

