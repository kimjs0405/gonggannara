import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Phone, Star, ArrowRight, ShoppingCart, Sofa, Lamp, Blinds, Wallpaper, Package, UtensilsCrossed, Bath, Flower2, PaintBucket, Wrench, SprayCan, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_url: string | null
}

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])

  // 기본 배너 (DB에 배너가 없을 때)
  const defaultBanners = [
    {
      id: 'default-1',
      title: '인테리어 용품\n특가 세일',
      subtitle: '최대 50% 할인 진행중',
      image_url: '',
      link_url: '/products',
    },
    {
      id: 'default-2',
      title: '무료 인테리어\n상담 진행중',
      subtitle: '견적부터 시공까지 원스톱 서비스',
      image_url: '',
      link_url: '/estimate',
    },
    {
      id: 'default-3',
      title: '신상품 입고\n가구·조명·소품',
      subtitle: '트렌디한 인테리어 아이템',
      image_url: '',
      link_url: '/products',
    },
  ]

  // 배너 데이터 가져오기
  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

      if (!error && data && data.length > 0) {
        setBanners(data)
      } else {
        setBanners(defaultBanners)
      }
    }
    fetchBanners()
  }, [])

  // 아이콘 바로가기 카테고리
  const quickCategories = [
    { name: '가구', icon: Sofa, slug: 'furniture' },
    { name: '조명', icon: Lamp, slug: 'lighting' },
    { name: '커튼/블라인드', icon: Blinds, slug: 'curtain' },
    { name: '벽지/시트지', icon: Wallpaper, slug: 'wallpaper' },
    { name: '수납/정리', icon: Package, slug: 'storage' },
    { name: '주방용품', icon: UtensilsCrossed, slug: 'kitchen' },
    { name: '욕실용품', icon: Bath, slug: 'bathroom' },
    { name: '인테리어소품', icon: Flower2, slug: 'decor' },
    { name: '페인트', icon: PaintBucket, slug: 'paint' },
    { name: 'DIY용품', icon: Wrench, slug: 'diy' },
    { name: '청소용품', icon: SprayCan, slug: 'cleaning' },
    { name: '신상품', icon: Sparkles, slug: 'new', isNew: true },
  ]


  const products: { id: number; name: string; price: number; discount: number; category: string }[] = []

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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsLoggedIn(true)
        setUserEmail(session.user.email || '')
      }
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      setUserEmail(session?.user.email || '')
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else {
        setLoginError(error.message)
      }
    }
    setIsLoggingIn(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUserEmail('')
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString() + '원'
  }

  const getDiscountedPrice = (price: number, discount: number) => {
    return Math.floor(price * (1 - discount / 100))
  }

  return (
    <div>
      {/* Hero Banner - 창 형태 */}
      <div className="bg-white py-3 md:py-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="relative h-[200px] md:h-[350px] overflow-hidden border border-gray-200">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className="min-w-full h-full flex items-center relative"
                  style={{
                    background: banner.image_url 
                      ? `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${banner.image_url}) center/cover no-repeat`
                      : idx % 3 === 0 
                        ? 'linear-gradient(to right, #1e3a5f, #1d4ed8)' 
                        : idx % 3 === 1 
                          ? 'linear-gradient(to right, #1e293b, #475569)' 
                          : 'linear-gradient(to right, #78350f, #b45309)'
                  }}
                >
                  <div className="max-w-[1200px] mx-auto px-4 md:pl-20 md:pr-8 w-full">
                    <div className="max-w-xl">
                      <h1 className="text-xl md:text-4xl font-black text-white leading-tight whitespace-pre-line mb-2 md:mb-3">
                        {banner.title}
                      </h1>
                      <p className="text-sm md:text-lg text-white/80 mb-3 md:mb-6">{banner.subtitle}</p>
                      <div className="flex gap-2 md:gap-3">
                        <Link
                          to={banner.link_url || '/products'}
                          className="px-3 md:px-6 py-2 md:py-3 bg-white text-gray-900 rounded-lg text-sm md:text-base font-bold hover:bg-gray-100 transition-colors"
                        >
                          자세히 보기
                        </Link>
                        <Link
                          to="/estimate"
                          className="hidden md:block px-6 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors"
                        >
                          인테리어 상담
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation - Desktop only */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors ${
                    currentSlide === idx ? 'bg-white' : 'bg-white/40'
                  }`}
                />
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories + Login Box */}
      <div className="py-4 md:py-6 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            {/* Quick Category Icons */}
            <div className="flex-1">
              {/* 모바일: 5개씩 그리드 / PC: 12개 한줄 */}
              <div className="grid grid-cols-5 md:grid-cols-12 gap-2 md:gap-1">
                {quickCategories.map((cat, idx) => {
                  const IconComponent = cat.icon
                  return (
                    <Link
                      key={idx}
                      to={`/products?category=${cat.slug}`}
                      className="flex flex-col items-center gap-1 py-2 hover:text-blue-600 transition-colors group"
                    >
                      <div className={`relative w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                        cat.isNew 
                          ? 'border-red-400 bg-red-50 group-hover:border-red-500 group-hover:bg-red-100' 
                          : 'border-gray-200 bg-gray-50 group-hover:border-blue-400 group-hover:bg-blue-50'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          cat.isNew ? 'text-red-500' : 'text-gray-600 group-hover:text-blue-600'
                        }`} />
                        {cat.isNew && (
                          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 bg-red-500 text-white text-[7px] font-bold rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className={`text-[9px] md:text-[11px] font-medium text-center leading-tight ${
                        cat.isNew ? 'text-red-500' : 'text-gray-700 group-hover:text-blue-600'
                      }`}>
                        {cat.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Login Box - Desktop only */}
            <div className="hidden md:block w-[280px] bg-white border border-gray-200 p-5">
              {isLoggedIn ? (
                /* 로그인된 상태 */
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">마이페이지</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium text-blue-600">{userEmail}</span>님<br />
                    환영합니다!
                  </p>
                  <div className="space-y-2">
                    <Link
                      to="/mypage"
                      className="block w-full py-2 text-center bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      마이페이지
                    </Link>
                    <Link
                      to="/cart"
                      className="block w-full py-2 text-center bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                    >
                      장바구니
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 text-center border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                /* 로그인 폼 */
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">회원 로그인</h3>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-2 mb-3">
                      <input
                        type="email"
                        placeholder="이메일"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                      <input
                        type="password"
                        placeholder="비밀번호"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    {loginError && (
                      <p className="text-xs text-red-500 mb-2">{loginError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {isLoggingIn ? '로그인 중...' : '로그인'}
                    </button>
                  </form>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>로그인 유지</span>
                    </label>
                    <Link to="/forgot-password" className="hover:text-blue-600">ID/PW 찾기</Link>
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <p className="text-xs text-gray-500 mb-2 text-center">간편 로그인</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-1 py-2 border border-gray-200 rounded text-xs hover:bg-gray-50">
                        <span className="w-4 h-4 bg-[#03C75A] rounded-sm flex items-center justify-center text-white text-[10px] font-bold">N</span>
                        네이버
                      </button>
                      <button className="flex items-center justify-center gap-1 py-2 border border-gray-200 rounded text-xs hover:bg-gray-50">
                        <span className="w-4 h-4 bg-[#FEE500] rounded-sm flex items-center justify-center text-[10px]">💬</span>
                        카카오
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Link to="/signup" className="text-xs text-blue-600 hover:underline">
                      아직 회원이 아니세요? <span className="font-medium">회원가입</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="py-8 md:py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-lg md:text-2xl font-black text-gray-900 mb-0.5 md:mb-1">인기 상품</h2>
              <p className="text-xs md:text-base text-gray-500">공간나라에서 가장 많이 찾는 상품</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm md:text-base text-blue-600 font-medium hover:gap-2 transition-all"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-32 md:h-48 bg-gray-100 relative">
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 px-1.5 md:px-2 py-0.5 md:py-1 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded">
                        {product.discount}%
                      </span>
                    )}
                    <button className="absolute top-2 right-2 w-7 md:w-8 h-7 md:h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
                      <ShoppingCart className="w-3.5 md:w-4 h-3.5 md:h-4 text-blue-600" />
                    </button>
                  </div>
                  <div className="p-3 md:p-4">
                    <p className="text-[10px] md:text-xs text-gray-400 mb-0.5 md:mb-1">{product.category}</p>
                    <h3 className="text-sm md:text-base font-medium text-gray-800 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 md:gap-2">
                      {product.discount > 0 && (
                        <span className="text-xs md:text-sm text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="text-sm md:text-lg font-bold text-blue-600">
                        {formatPrice(getDiscountedPrice(product.price, product.discount))}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 md:py-16 bg-gray-50 rounded-xl md:rounded-2xl">
              <p className="text-gray-400 mb-2 md:mb-4 text-sm md:text-base">등록된 상품이 없습니다</p>
              <p className="text-xs md:text-sm text-gray-400">곧 새로운 상품이 등록될 예정입니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Interior Services */}
      <div className="py-8 md:py-12 bg-gray-900 text-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-5 md:mb-8">
            <div>
              <h2 className="text-lg md:text-2xl font-black mb-0.5 md:mb-1">인테리어 시공 서비스</h2>
              <p className="text-xs md:text-base text-gray-400">전문가가 직접 시공해드립니다</p>
            </div>
            <Link
              to="/estimate"
              className="self-start md:self-auto px-4 md:px-6 py-2 md:py-3 bg-blue-600 rounded-lg text-sm md:text-base font-bold hover:bg-blue-700 transition-colors"
            >
              무료 견적받기
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {services.map((service, idx) => (
              <Link
                key={idx}
                to="/portfolio"
                className="bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-bold text-sm md:text-lg mb-0.5 md:mb-1">{service.name}</h3>
                <p className="text-xs md:text-sm text-gray-400">{service.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-5 md:mt-8 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 py-4 md:py-6 border-t border-gray-800">
            <a href="tel:02-875-8204" className="flex items-center gap-2">
              <Phone className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
              <span className="text-lg md:text-xl font-bold">02-875-8204</span>
            </a>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="text-xs md:text-base text-gray-400">평일 09:00 ~ 18:00 상담 가능</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="py-8 md:py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-lg md:text-2xl font-black text-gray-900 mb-0.5 md:mb-1">고객 후기</h2>
              <p className="text-xs md:text-base text-gray-500">공간나라 고객님들의 솔직한 후기</p>
            </div>
            <Link
              to="/reviews"
              className="flex items-center gap-1 text-sm md:text-base text-blue-600 font-medium hover:gap-2 transition-all"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <span className="px-2 py-0.5 md:py-1 bg-blue-100 text-blue-700 text-[10px] md:text-xs font-medium rounded">
                    {review.type}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 md:w-4 h-3 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-3">"{review.content}"</p>
                <p className="text-xs md:text-sm text-gray-500">{review.name} 고객님</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-8 md:py-10 bg-blue-600">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-lg md:text-2xl font-black text-white mb-1 md:mb-2">
            인테리어 고민, 공간나라에서 해결하세요
          </h2>
          <p className="text-xs md:text-base text-blue-200 mb-4 md:mb-6">상품 구매부터 시공까지 원스톱 서비스</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <Link
              to="/products"
              className="w-full md:w-auto px-6 py-2.5 md:py-3 bg-white text-blue-600 rounded-lg text-sm md:text-base font-bold hover:bg-gray-100 transition-colors"
            >
              쇼핑하러 가기
            </Link>
            <a
              href="tel:02-875-8204"
              className="w-full md:w-auto px-6 py-2.5 md:py-3 border-2 border-white text-white rounded-lg text-sm md:text-base font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
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
