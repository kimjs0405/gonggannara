import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Phone, CheckCircle, Star, ArrowRight } from 'lucide-react'

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const banners = [
    {
      id: 1,
      title: '당신의 공간을\n새롭게 디자인합니다',
      subtitle: '20년 경력의 인테리어 전문가가 함께합니다',
      bg: 'bg-gradient-to-r from-slate-900 to-slate-700',
    },
    {
      id: 2,
      title: '무료 방문상담\n진행중',
      subtitle: '견적부터 시공까지 원스톱 서비스',
      bg: 'bg-gradient-to-r from-blue-900 to-blue-700',
    },
    {
      id: 3,
      title: '이달의 특별 혜택\n최대 20% 할인',
      subtitle: '주방·욕실 리모델링 패키지',
      bg: 'bg-gradient-to-r from-amber-900 to-amber-700',
    },
  ]

  const services = [
    { name: '거실 인테리어', desc: '품격있는 거실 공간', image: '🛋️' },
    { name: '주방 인테리어', desc: '실용적인 주방 설계', image: '🍳' },
    { name: '침실 인테리어', desc: '편안한 휴식 공간', image: '🛏️' },
    { name: '욕실 인테리어', desc: '깔끔한 욕실 리모델링', image: '🚿' },
    { name: '사무실 인테리어', desc: '효율적인 업무 환경', image: '🏢' },
    { name: '상업공간', desc: '매장·카페·식당', image: '🏪' },
  ]

  const portfolios = [
    { id: 1, title: '모던 아파트 전체 리모델링', location: '서울 강남구', area: '32평', style: '모던' },
    { id: 2, title: '미니멀 원룸 인테리어', location: '서울 마포구', area: '10평', style: '미니멀' },
    { id: 3, title: '북유럽 스타일 거실', location: '경기 성남시', area: '25평', style: '북유럽' },
    { id: 4, title: '카페 인테리어 시공', location: '서울 홍대', area: '45평', style: '인더스트리얼' },
  ]

  const reviews = [
    { name: '김*수', rating: 5, content: '처음부터 끝까지 친절하게 설명해주시고, 결과물도 너무 만족스러워요!', date: '2024.01' },
    { name: '이*희', rating: 5, content: '예산에 맞춰서 최선의 방안을 제시해주셨어요. 강력 추천합니다.', date: '2024.01' },
    { name: '박*준', rating: 5, content: '시공 기간도 정확하게 지켜주시고 마무리도 깔끔했습니다.', date: '2023.12' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-[500px] overflow-hidden">
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
                  <h1 className="text-5xl font-black text-white leading-tight whitespace-pre-line mb-4">
                    {banner.title}
                  </h1>
                  <p className="text-xl text-white/80 mb-8">{banner.subtitle}</p>
                  <div className="flex gap-4">
                    <Link
                      to="/estimate"
                      className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                    >
                      무료 견적받기
                    </Link>
                    <Link
                      to="/portfolio"
                      className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors"
                    >
                      시공사례 보기
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
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === idx ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Contact Bar */}
      <div className="bg-blue-600 py-4">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {['무료 방문상담', '정확한 견적', '책임 시공', 'A/S 보장'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
            <a
              href="tel:02-875-8204"
              className="flex items-center gap-3 px-6 py-3 bg-white rounded-lg text-blue-600 font-bold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>02-875-8204</span>
            </a>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">인테리어 서비스</h2>
            <p className="text-gray-500">공간나라가 제공하는 전문 인테리어 서비스를 만나보세요</p>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {services.map((service, idx) => (
              <Link
                key={idx}
                to={`/services/${service.name}`}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="text-5xl mb-4">{service.image}</div>
                <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">포트폴리오</h2>
              <p className="text-gray-500">공간나라의 시공 사례를 확인해보세요</p>
            </div>
            <Link
              to="/portfolio"
              className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {portfolios.map((item) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.id}`}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-white/90 rounded text-xs font-medium text-gray-700">
                      {item.style}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{item.location}</span>
                    <span>•</span>
                    <span>{item.area}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">고객 후기</h2>
              <p className="text-gray-500">공간나라를 선택하신 고객님들의 솔직한 후기</p>
            </div>
            <Link
              to="/reviews"
              className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{review.content}"</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{review.name} 고객님</span>
                  <span className="text-gray-400">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            지금 바로 무료 상담 받아보세요
          </h2>
          <p className="text-white/80 mb-8">
            전문 상담원이 친절하게 안내해 드립니다
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/estimate"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              온라인 견적문의
            </Link>
            <a
              href="tel:02-875-8204"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              02-875-8204
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
