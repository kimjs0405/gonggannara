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
  const [adSlide1, setAdSlide1] = useState(0)
  const [adSlide2, setAdSlide2] = useState(0)
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


  // 방문자 수 추적 및 표시
  useEffect(() => {
    const trackVisitor = async () => {
      const today = new Date().toDateString()
      const lastVisitDate = localStorage.getItem('lastVisitDate')
      
      // 오늘 첫 방문인 경우에만 카운트 증가
      if (lastVisitDate !== today) {
        try {
          const todayDate = new Date().toISOString().split('T')[0]
          
          // 오늘 날짜의 레코드 확인
          const { data: existing, error: selectError } = await supabase
            .from('visitor_stats')
            .select('id, visitor_count')
            .eq('visit_date', todayDate)
            .maybeSingle()

          if (selectError) {
            console.error('Error fetching visitor stats:', selectError)
          }

          if (existing) {
            // 레코드가 있으면 카운트 증가
            const { data: updated, error: updateError } = await supabase
              .from('visitor_stats')
              .update({ 
                visitor_count: existing.visitor_count + 1,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id)
              .select('visitor_count')
              .single()
            
            if (updateError) {
              console.error('Error updating visitor count:', updateError)
            } else if (updated) {
              localStorage.setItem('lastVisitDate', today)
            }
          } else {
            // 레코드가 없으면 새로 생성
            const { data: inserted, error: insertError } = await supabase
              .from('visitor_stats')
              .insert([{
                visit_date: todayDate,
                visitor_count: 1
              }])
              .select('visitor_count')
              .single()
            
            if (insertError) {
              console.error('Error inserting visitor stats:', insertError)
            } else if (inserted) {
              localStorage.setItem('lastVisitDate', today)
            }
          }
        } catch (error) {
          console.error('Error tracking visitor:', error)
        }
      }
    }

    trackVisitor()
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

  // 광고 슬라이드 데이터
  const adSlides1 = [
    { id: 1, title: '광고 1-1', image: '🎯', link: '/products' },
    { id: 2, title: '광고 1-2', image: '📢', link: '/products' },
    { id: 3, title: '광고 1-3', image: '✨', link: '/products' },
  ]

  const adSlides2 = [
    { id: 1, title: '광고 2-1', image: '🔥', link: '/products' },
    { id: 2, title: '광고 2-2', image: '💎', link: '/products' },
    { id: 3, title: '광고 2-3', image: '🌟', link: '/products' },
  ]

  // 프로모션 슬라이드 1 - 특가 할인
  const promoItems1 = [
    { id: 1, name: '모던 패브릭 소파', price: 890000, discount: 35, image: '🛋️' },
    { id: 2, name: 'LED 스탠드 조명', price: 128000, discount: 40, image: '💡' },
    { id: 3, name: '원목 책상 세트', price: 450000, discount: 25, image: '🪑' },
    { id: 4, name: '북유럽 러그', price: 189000, discount: 30, image: '🧶' },
  ]

  // 프로모션 슬라이드 2 - 신상품
  const promoItems2 = [
    { id: 5, name: '미니멀 수납장', price: 320000, discount: 20, image: '📦' },
    { id: 6, name: '프리미엄 커튼', price: 98000, discount: 15, image: '🪟' },
    { id: 7, name: '디자인 벽시계', price: 67000, discount: 25, image: '🕐' },
    { id: 8, name: '아트 액자 세트', price: 145000, discount: 30, image: '🖼️' },
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
  }, [banners.length])

  // 광고 슬라이드 자동 전환
  useEffect(() => {
    const timer1 = setInterval(() => {
      setAdSlide1((prev) => (prev + 1) % adSlides1.length)
    }, 4000)
    const timer2 = setInterval(() => {
      setAdSlide2((prev) => (prev + 1) % adSlides2.length)
    }, 4500)
    return () => {
      clearInterval(timer1)
      clearInterval(timer2)
    }
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
                      className="flex flex-col items-center gap-1.5 py-2 hover:text-blue-600 transition-colors group"
                    >
                      <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center border-2 transition-all ${
                        cat.isNew 
                          ? 'border-red-400 bg-red-50 group-hover:border-red-500 group-hover:bg-red-100' 
                          : 'border-gray-200 bg-gray-50 group-hover:border-blue-400 group-hover:bg-blue-50'
                      }`}>
                        <IconComponent className={`w-6 h-6 md:w-7 md:h-7 ${
                          cat.isNew ? 'text-red-500' : 'text-gray-600 group-hover:text-blue-600'
                        }`} />
                        {cat.isNew && (
                          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 bg-red-500 text-white text-[7px] font-bold rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] md:text-xs font-medium text-center leading-tight ${
                        cat.isNew ? 'text-red-500' : 'text-gray-700 group-hover:text-blue-600'
                      }`}>
                        {cat.name}
                      </span>
                    </Link>
                  )
                })}
              </div>

              {/* 광고 슬라이드 2개 - 카테고리 밑 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4">
                {/* 광고 슬라이드 1 */}
                <div className="relative h-[120px] md:h-[150px] overflow-hidden border-2 border-gray-300">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${adSlide1 * 100}%)` }}
                  >
                    {adSlides1.map((ad) => (
                      <Link
                        key={ad.id}
                        to={ad.link}
                        className="min-w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                      >
                        <div className="text-center">
                          <div className="text-5xl md:text-6xl mb-2">{ad.image}</div>
                          <p className="text-sm md:text-base font-bold text-gray-800">{ad.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* 네비게이션 버튼 */}
                  <button
                    onClick={() => setAdSlide1((prev) => (prev - 1 + adSlides1.length) % adSlides1.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center border border-gray-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setAdSlide1((prev) => (prev + 1) % adSlides1.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center border border-gray-300 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                  {/* 인디케이터 */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {adSlides1.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAdSlide1(idx)}
                        className={`w-2 h-2 transition-colors ${adSlide1 === idx ? 'bg-gray-800' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* 광고 슬라이드 2 */}
                <div className="relative h-[120px] md:h-[150px] overflow-hidden border-2 border-gray-300">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${adSlide2 * 100}%)` }}
                  >
                    {adSlides2.map((ad) => (
                      <Link
                        key={ad.id}
                        to={ad.link}
                        className="min-w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-colors"
                      >
                        <div className="text-center">
                          <div className="text-5xl md:text-6xl mb-2">{ad.image}</div>
                          <p className="text-sm md:text-base font-bold text-gray-800">{ad.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* 네비게이션 버튼 */}
                  <button
                    onClick={() => setAdSlide2((prev) => (prev - 1 + adSlides2.length) % adSlides2.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center border border-gray-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setAdSlide2((prev) => (prev + 1) % adSlides2.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center border border-gray-300 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                  {/* 인디케이터 */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {adSlides2.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAdSlide2(idx)}
                        className={`w-2 h-2 transition-colors ${adSlide2 === idx ? 'bg-gray-800' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Login Box */}
            <div className="flex flex-col gap-4 w-full md:w-[280px]">
              {/* Login Box - Desktop only */}
              <div className="hidden md:block bg-white border border-gray-200 p-5">
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
      </div>

      {/* 특가 상품 - 오늘의 할인 */}
      <div className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="relative">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm md:text-base font-bold rounded-lg shadow-lg shadow-red-500/30">
                특가
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">오늘의 할인</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">매일 업데이트되는 특별 할인 상품</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              더보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {promoItems1.map((item) => (
              <Link 
                key={item.id} 
                to={`/products/${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-6xl md:text-7xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 group-hover:from-white/20 group-hover:to-white/40 transition-all duration-300"></div>
                  {item.image}
                  <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs md:text-sm font-black rounded-lg shadow-md">
                    {item.discount}%
                  </span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-sm md:text-base font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs md:text-sm text-gray-400 line-through font-medium">
                      {item.price.toLocaleString()}원
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg md:text-xl font-black text-gray-900">
                        {Math.floor(item.price * (1 - item.discount / 100)).toLocaleString()}원
                      </span>
                      <span className="text-xs text-red-600 font-bold">특가</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 신상품 */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="relative">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm md:text-base font-bold rounded-lg shadow-lg shadow-blue-500/30">
                NEW
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">신상품</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">최신 트렌드를 반영한 신제품</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              더보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {promoItems2.map((item) => (
              <Link 
                key={item.id} 
                to={`/products/${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-6xl md:text-7xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 group-hover:from-white/20 group-hover:to-white/40 transition-all duration-300"></div>
                  {item.image}
                  <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs md:text-sm font-black rounded-lg shadow-md">
                    {item.discount}%
                  </span>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                    <span className="text-[10px] font-black text-blue-600">NEW</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-sm md:text-base font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs md:text-sm text-gray-400 line-through font-medium">
                      {item.price.toLocaleString()}원
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg md:text-xl font-black text-gray-900">
                        {Math.floor(item.price * (1 - item.discount / 100)).toLocaleString()}원
                      </span>
                      <span className="text-xs text-blue-600 font-bold">신상</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 인기 상품 */}
      <div className="py-12 md:py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">인기 상품</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">공간나라에서 가장 많이 찾는 상품</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 px-4 py-2 text-sm md:text-base text-gray-700 font-semibold hover:text-blue-600 hover:gap-3 transition-all bg-white rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black rounded-lg shadow-md z-10">
                        {product.discount}%
                      </span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                    </button>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                  </div>
                  <div className="p-4 md:p-5">
                    <p className="text-xs text-gray-400 mb-1.5 font-medium">{product.category}</p>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      {product.discount > 0 && (
                        <span className="text-xs md:text-sm text-gray-400 line-through font-medium">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="text-base md:text-xl font-black text-blue-600">
                        {formatPrice(getDiscountedPrice(product.price, product.discount))}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2 text-base md:text-lg font-semibold">등록된 상품이 없습니다</p>
              <p className="text-sm md:text-base text-gray-400">곧 새로운 상품이 등록될 예정입니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 인테리어 시공 서비스 */}
      <div className="py-12 md:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-10 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">인테리어 시공 서비스</h2>
              <p className="text-sm md:text-base text-gray-300 font-medium">전문가가 직접 시공해드립니다</p>
            </div>
            <Link
              to="/estimate"
              className="self-start md:self-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-sm md:text-base font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transform hover:scale-105"
            >
              무료 견적받기
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, idx) => (
              <Link
                key={idx}
                to="/portfolio"
                className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 hover:bg-gray-700/90 transition-all duration-300 border border-gray-700/50 hover:border-gray-600 hover:shadow-xl hover:shadow-black/20 transform hover:-translate-y-1"
              >
                <h3 className="font-black text-base md:text-xl mb-2 group-hover:text-blue-400 transition-colors">{service.name}</h3>
                <p className="text-xs md:text-sm text-gray-400 font-medium">{service.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-6 md:py-8 border-t border-gray-700/50">
            <a href="tel:02-875-8204" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
              <span className="text-xl md:text-2xl font-black">02-875-8204</span>
            </a>
            <span className="hidden md:inline text-gray-600">|</span>
            <span className="text-sm md:text-base text-gray-400 font-medium">평일 09:00 ~ 18:00 상담 가능</span>
          </div>
        </div>
      </div>

      {/* 고객 후기 */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">고객 후기</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">공간나라 고객님들의 솔직한 후기</p>
            </div>
            <Link
              to="/reviews"
              className="flex items-center gap-2 px-4 py-2 text-sm md:text-base text-gray-700 font-semibold hover:text-blue-600 hover:gap-3 transition-all bg-white rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                    {review.type}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed font-medium">"{review.content}"</p>
                <p className="text-xs md:text-sm text-gray-500 font-semibold">{review.name} 고객님</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-12 md:py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4">
            인테리어 고민, 공간나라에서 해결하세요
          </h2>
          <p className="text-sm md:text-lg text-blue-100 mb-8 md:mb-10 font-medium">상품 구매부터 시공까지 원스톱 서비스</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              to="/products"
              className="w-full md:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl text-base md:text-lg font-black hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              쇼핑하러 가기
            </Link>
            <a
              href="tel:02-875-8204"
              className="w-full md:w-auto px-8 py-4 border-2 border-white text-white rounded-xl text-base md:text-lg font-black hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
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
