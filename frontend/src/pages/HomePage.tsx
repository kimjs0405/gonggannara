import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sofa, Lamp, Blinds, PaintBucket, Bath, Package, Palette, Armchair, BedDouble, Clock, Frame, Flower2, Sparkles } from 'lucide-react'

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const categories = [
    { name: '가구·소파·침대', slug: 'furniture', icon: Sofa },
    { name: '조명·인테리어등', slug: 'lighting', icon: Lamp },
    { name: '커튼·블라인드', slug: 'curtain', icon: Blinds },
    { name: '벽지·바닥재', slug: 'wallpaper', icon: PaintBucket },
    { name: '주방·욕실용품', slug: 'kitchen', icon: Bath },
    { name: '수납·정리용품', slug: 'storage', icon: Package },
    { name: '홈데코·소품', slug: 'deco', icon: Palette },
  ]

  const banners = [
    {
      id: 1,
      category: '소파·거실가구',
      bg: '#F5EFE6',
      accent: '#8B7355',
    },
    {
      id: 2,
      category: '조명·무드등',
      bg: '#FFF8E7',
      accent: '#C4A574',
    },
    {
      id: 3,
      category: '침실·침구류',
      bg: '#E8F0F2',
      accent: '#5C7A8A',
    },
  ]

  const categoryIcons = [
    { name: '소파', icon: Sofa },
    { name: '침대', icon: BedDouble },
    { name: '조명', icon: Lamp },
    { name: '의자', icon: Armchair },
    { name: '책상', icon: Package },
    { name: '수납장', icon: Package },
    { name: '커튼', icon: Blinds },
    { name: '러그', icon: Palette },
    { name: '시계', icon: Clock },
    { name: '액자', icon: Frame },
    { name: '화분', icon: Flower2 },
    { name: '신상품', icon: Sparkles, isNew: true },
  ]

  const products = [
    { id: 1, name: '이탈리아 천연가죽 4인 소파', price: 1890000, originalPrice: 2400000, discount: 21, category: '소파', badge: 'BEST' },
    { id: 2, name: '루이스폴센 PH5 펜던트 조명', price: 890000, originalPrice: 1200000, discount: 26, category: '조명', badge: 'HOT' },
    { id: 3, name: '원목 월넛 6단 서랍장', price: 680000, originalPrice: 850000, discount: 20, category: '수납장', badge: 'NEW' },
    { id: 4, name: '호텔식 암막커튼 세트 (4장)', price: 128000, originalPrice: 180000, discount: 29, category: '커튼' },
    { id: 5, name: '허먼밀러 에어론 체어', price: 1650000, originalPrice: 1890000, discount: 13, category: '의자' },
    { id: 6, name: '페르시안 핸드메이드 러그', price: 450000, originalPrice: 620000, discount: 27, category: '러그' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {/* Main Banner Section */}
      <div className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          <div className="flex gap-5">
            {/* Left Sidebar Category */}
            <div className="w-[200px] flex-shrink-0">
              <div className="bg-[#2563EB] rounded-lg overflow-hidden">
                {categories.map((category, index) => {
                  const IconComponent = category.icon
                  return (
                    <Link
                      key={index}
                      to={`/products?category=${category.slug}`}
                      className={`flex items-center gap-3 px-4 py-[14px] text-white hover:bg-[#1D4ED8] transition-colors ${
                        index !== 0 ? 'border-t border-[#3B82F6]' : ''
                      }`}
                    >
                      <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-[13px]">{category.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Main Banner Slider */}
            <div className="flex-1 relative overflow-hidden rounded-lg" style={{ height: '380px' }}>
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="min-w-full h-full flex items-center justify-center relative"
                    style={{ backgroundColor: banner.bg }}
                  >
                    {/* 상품 이미지 영역 (placeholder) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[500px] h-[300px] bg-white/30 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto bg-white/50 rounded-xl mb-4 flex items-center justify-center">
                            <Sofa className="w-16 h-16" style={{ color: banner.accent }} strokeWidth={1} />
                          </div>
                          <p className="text-lg font-medium" style={{ color: banner.accent }}>{banner.category}</p>
                        </div>
                      </div>
                    </div>
                    {/* 배너 텍스트 */}
                    <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-4">
                      <p className="text-2xl font-bold text-gray-800">{banner.category}</p>
                      <p className="text-sm text-gray-500 mt-1">최대 40% 할인</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentSlide === idx ? 'bg-[#2563EB]' : 'bg-black/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side Banners */}
            <div className="w-[200px] flex-shrink-0 flex flex-col gap-4">
              <Link to="/events" className="flex-1 bg-[#FEF3E2] rounded-lg p-5 hover:shadow-md transition-shadow">
                <p className="text-xs text-[#B8860B] font-medium">EVENT</p>
                <p className="text-[15px] font-bold text-gray-800 mt-1">신규회원 혜택</p>
                <p className="text-xs text-gray-500 mt-1">최대 10만원 쿠폰팩</p>
                <div className="mt-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#B8860B]" />
                </div>
              </Link>
              <Link to="/products?shipping=free" className="flex-1 bg-[#E8F5E9] rounded-lg p-5 hover:shadow-md transition-shadow">
                <p className="text-xs text-[#2E7D32] font-medium">FREE SHIPPING</p>
                <p className="text-[15px] font-bold text-gray-800 mt-1">무료배송</p>
                <p className="text-xs text-gray-500 mt-1">5만원 이상 구매시</p>
                <div className="mt-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#2E7D32]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Icons */}
      <div className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          <div className="flex items-center">
            {/* Left Banner */}
            <div className="w-[120px] flex-shrink-0 bg-[#2563EB] rounded-lg p-4 text-white mr-4">
              <p className="text-[10px] opacity-80">공간나라</p>
              <p className="text-sm font-bold mt-0.5">이달의 혜택</p>
              <p className="text-[10px] opacity-70 mt-2 leading-tight">인테리어 용품<br/>특가 할인!</p>
            </div>

            {/* Category Grid */}
            <div className="flex-1 flex items-center justify-between">
              {categoryIcons.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <Link
                    key={index}
                    to="/products"
                    className="flex flex-col items-center gap-2 px-2 group"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all group-hover:shadow-md relative ${
                      category.isNew ? 'bg-red-50' : 'bg-gray-50'
                    }`}>
                      <IconComponent 
                        className={`w-6 h-6 ${category.isNew ? 'text-red-500' : 'text-gray-600'}`} 
                        strokeWidth={1.5} 
                      />
                      {category.isNew && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                          N
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">{category.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Banner */}
            <div className="w-[120px] flex-shrink-0 bg-[#059669] rounded-lg p-4 text-white ml-4">
              <p className="text-[10px] opacity-80">이용가이드</p>
              <p className="text-sm font-bold mt-0.5">주문방법</p>
              <p className="text-[10px] opacity-70 mt-2">자세히보기 →</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-[#F8F9FA] py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800">인기 인테리어 상품</h2>
              <span className="px-2.5 py-1 bg-[#2563EB] text-white text-[11px] rounded">VIP 전용</span>
            </div>
            <Link to="/products" className="text-sm text-gray-400 hover:text-[#2563EB] transition-colors">
              전체보기 &gt;
            </Link>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow group border border-gray-100"
              >
                {/* 상품 이미지 */}
                <div className="relative h-[160px] bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Sofa className="w-10 h-10 text-gray-400" strokeWidth={1} />
                  </div>
                  {product.badge && (
                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white rounded ${
                      product.badge === 'BEST' ? 'bg-red-500' :
                      product.badge === 'HOT' ? 'bg-orange-500' : 'bg-[#2563EB]'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                {/* 상품 정보 */}
                <div className="p-3">
                  <p className="text-[11px] text-gray-400 mb-1">{product.category}</p>
                  <h3 className="text-[13px] text-gray-700 leading-tight line-clamp-2 h-[36px] mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-red-500 text-sm font-bold">{product.discount}%</span>
                    <span className="text-[15px] font-bold text-gray-900">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-[13px] text-gray-900">원</span>
                  </div>
                  <p className="text-[11px] text-gray-300 line-through">
                    {product.originalPrice.toLocaleString()}원
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Special Section */}
      <div className="bg-white py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 gap-5">
            {/* 컨설팅 배너 */}
            <div className="bg-[#F8F6F4] rounded-xl p-8 relative overflow-hidden">
              <p className="text-[#2563EB] text-sm font-medium mb-1">맞춤 인테리어</p>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">공간 디자인 컨설팅</h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                전문 디자이너가 직접 방문하여<br />
                고객님의 공간을 새롭게 꾸며드립니다
              </p>
              <Link
                to="/consulting"
                className="inline-block px-5 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors"
              >
                상담 신청하기
              </Link>
              <div className="absolute right-8 bottom-6">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Sofa className="w-12 h-12 text-gray-300" strokeWidth={1} />
                </div>
              </div>
            </div>

            {/* 브랜드 파트너 */}
            <div className="bg-[#F8F9FA] rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded">PARTNER</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">프리미엄 브랜드</h3>
              <div className="grid grid-cols-3 gap-2">
                {['한샘', '이케아', '까사미아', 'LG전자', '삼성', '다이슨'].map((brand) => (
                  <div
                    key={brand}
                    className="bg-white border border-gray-100 rounded-lg py-3 px-4 text-center text-sm text-gray-600 hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer transition-colors"
                  >
                    {brand}
                  </div>
                ))}
              </div>
              <Link to="/brands" className="inline-block mt-4 text-sm text-gray-400 hover:text-[#2563EB] transition-colors">
                브랜드 전체보기 &gt;
              </Link>
            </div>
          </div>

          {/* 서비스 혜택 */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { icon: Package, title: '무료배송', desc: '5만원 이상 구매시' },
              { icon: Armchair, title: '무료설치', desc: '대형가구 전문 설치' },
              { icon: Sparkles, title: '최저가 보장', desc: '차액 200% 보상' },
              { icon: Clock, title: '30일 반품', desc: '무료 반품 서비스' },
            ].map((item, idx) => {
              const IconComponent = item.icon
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-[#F8F9FA] border border-gray-100 rounded-lg p-4"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-[#2563EB]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
