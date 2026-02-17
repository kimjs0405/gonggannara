import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Phone, Star, ArrowRight, ShoppingCart } from 'lucide-react'
import { supabase } from '../lib/supabase'

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

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
      <div className="bg-white py-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="relative h-[350px] overflow-hidden border border-gray-200">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className={`min-w-full h-full ${banner.bg} flex items-center`}
                >
                  <div className="max-w-[1200px] mx-auto px-8 w-full">
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
        </div>
      </div>

      {/* Categories + Login Box */}
      <div className="py-6 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex gap-5">
            {/* Categories */}
            <div className="flex-1 bg-white border border-gray-200 p-5">
              <h3 className="font-bold text-gray-800 mb-4">카테고리</h3>
              <div className="grid grid-cols-6 gap-3">
                {categories.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/products?category=${cat.slug}`}
                    className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Login Box */}
            <div className="w-[280px] bg-white border border-gray-200 p-5">
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

          {products.length > 0 ? (
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
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-400 mb-4">등록된 상품이 없습니다</p>
              <p className="text-sm text-gray-400">곧 새로운 상품이 등록될 예정입니다</p>
            </div>
          )}
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
