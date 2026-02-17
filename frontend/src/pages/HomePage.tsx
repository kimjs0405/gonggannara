import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Phone, Star, ArrowRight, ShoppingCart } from 'lucide-react'

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const banners = [
    {
      id: 1,
      title: '인테리어 용품\n특가 세일',
      subtitle: '최대 50% 할인 진행중',
      bg: 'bg-gradient-to-r from-blue-900 to-blue-700',
    },
    {
      id: 2,
      title: '무료 인테리어\n상담 진행중',
      subtitle: '견적부터 시공까지 원스톱 서비스',
      bg: 'bg-gradient-to-r from-slate-900 to-slate-700',
    },
    {
      id: 3,
      title: '신상품 입고\n가구·조명·소품',
      subtitle: '트렌디한 인테리어 아이템',
      bg: 'bg-gradient-to-r from-amber-900 to-amber-700',
    },
  ]

  const categories = [
    { name: '가구', icon: '🛋️', slug: 'furniture' },
    { name: '조명', icon: '💡', slug: 'lighting' },
    { name: '커튼', icon: '🪟', slug: 'curtain' },
    { name: '벽지', icon: '🧱', slug: 'wallpaper' },
    { name: '주방용품', icon: '🍳', slug: 'kitchen' },
    { name: '수납', icon: '📦', slug: 'storage' },
    { name: '홈데코', icon: '🎨', slug: 'deco' },
    { name: '욕실', icon: '🚿', slug: 'bathroom' },
  ]

  const products = [
    { id: 1, name: '모던 패브릭 소파 3인용', price: 890000, discount: 15, category: '가구' },
    { id: 2, name: '북유럽 스타일 펜던트 조명', price: 89000, discount: 20, category: '조명' },
    { id: 3, name: '암막 커튼 세트 (4장)', price: 79000, discount: 10, category: '커튼' },
    { id: 4, name: '원목 식탁 세트 4인용', price: 650000, discount: 25, category: '가구' },
    { id: 5, name: 'LED 간접조명 바 세트', price: 45000, discount: 0, category: '조명' },
    { id: 6, name: '실크 벽지 롤 (10m)', price: 35000, discount: 5, category: '벽지' },
    { id: 7, name: '스테인리스 주방 선반', price: 129000, discount: 30, category: '주방용품' },
    { id: 8, name: '라탄 수납 바구니 세트', price: 49000, discount: 15, category: '수납' },
  ]

  const services = [
    { name: '거실 인테리어', desc: '품격있는 거실 공간' },
    { name: '주방 인테리어', desc: '실용적인 주방 설계' },
    { name: '침실 인테리어', desc: '편안한 휴식 공간' },
    { name: '전체 리모델링', desc: '새집처럼 변신' },
  ]

  const reviews = [
    { name: '김*수', rating: 5, content: '소파 품질이 정말 좋아요! 배송도 빨랐습니다.', type: '상품후기' },
    { name: '이*희', rating: 5, content: '인테리어 시공 너무 만족스러워요. 추천합니다!', type: '시공후기' },
    { name: '박*준', rating: 5, content: '조명 분위기가 완전 달라졌어요. 감사합니다.', type: '상품후기' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const formatPrice = (price: number) => {
    return price.toLocaleString() + '원'
  }

  const getDiscountedPrice = (price: number, discount: number) => {
    return Math.floor(price * (1 - discount / 100))
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full h-full ${banner.bg} flex items-center`}
            >
              <div className="max-w-[1200px] mx-auto px-4 w-full">
                <div className="max-w-xl">
                  <h1 className="text-4xl font-black text-white leading-tight whitespace-pre-line mb-3">
                    {banner.title}
                  </h1>
                  <p className="text-lg text-white/80 mb-6">{banner.subtitle}</p>
                  <div className="flex gap-3">
                    <Link
                      to="/products"
                      className="px-6 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                    >
                      쇼핑하기
                    </Link>
                    <Link
                      to="/estimate"
                      className="px-6 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors"
                    >
                      인테리어 상담
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                currentSlide === idx ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-8 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">인기 상품</h2>
              <p className="text-gray-500">공간나라에서 가장 많이 찾는 상품</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-blue-600 font-medium hover:gap-2 transition-all"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-48 bg-gray-100 relative">
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      {product.discount}%
                    </span>
                  )}
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                  <h3 className="font-medium text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(getDiscountedPrice(product.price, product.discount))}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Interior Services */}
      <div className="py-12 bg-gray-900 text-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black mb-1">인테리어 시공 서비스</h2>
              <p className="text-gray-400">전문가가 직접 시공해드립니다</p>
            </div>
            <Link
              to="/estimate"
              className="px-6 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              무료 견적받기
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {services.map((service, idx) => (
              <Link
                key={idx}
                to="/portfolio"
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                <p className="text-sm text-gray-400">{service.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 py-6 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-400" />
              <span className="text-xl font-bold">02-875-8204</span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">평일 09:00 ~ 18:00 상담 가능</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">고객 후기</h2>
              <p className="text-gray-500">공간나라 고객님들의 솔직한 후기</p>
            </div>
            <Link
              to="/reviews"
              className="flex items-center gap-1 text-blue-600 font-medium hover:gap-2 transition-all"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {review.type}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">"{review.content}"</p>
                <p className="text-sm text-gray-500">{review.name} 고객님</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-10 bg-blue-600">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-2">
            인테리어 고민, 공간나라에서 해결하세요
          </h2>
          <p className="text-blue-200 mb-6">상품 구매부터 시공까지 원스톱 서비스</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/products"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              쇼핑하러 가기
            </Link>
            <a
              href="tel:02-875-8204"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              02-875-8204
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
