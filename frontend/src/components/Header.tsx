import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, ShoppingCart, User, Phone, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Header = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  useEffect(() => {
    // 초기 세션 확인
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkSession()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const categories = [
    { name: '가구·소파·침대', slug: 'furniture' },
    { name: '조명·인테리어등', slug: 'lighting' },
    { name: '커튼·블라인드', slug: 'curtain' },
    { name: '벽지·바닥재', slug: 'wallpaper' },
    { name: '주방·욕실용품', slug: 'kitchen' },
    { name: '수납·정리용품', slug: 'storage' },
    { name: '홈데코·소품', slug: 'deco' },
  ]

  const menuItems = [
    { name: '견적문의', path: '/estimate' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '고객후기', path: '/reviews' },
    { name: '회사소개', path: '/about' },
  ]

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 md:gap-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/logo.svg" alt="공간나라" className="h-7 md:h-9" />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="인테리어 용품을 검색하세요"
                  className="w-full h-11 pl-4 pr-14 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-sm"
                />
                <button className="absolute right-2 w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Contact Info - Desktop */}
            <div className="hidden lg:block flex-shrink-0 text-right">
              <p className="text-xs text-gray-500">상담전화</p>
              <p className="text-xl font-black text-blue-600 tracking-tight">02-875-8204</p>
              <p className="text-[10px] text-gray-400">평일 09:00 ~ 18:00</p>
            </div>

            {/* CTA Button - Desktop */}
            <Link
              to="/estimate"
              className="hidden md:block flex-shrink-0 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <div className="text-center">
                <p className="font-bold">무료 견적상담</p>
              </div>
            </Link>

            {/* Mobile Icons */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 text-gray-600"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link 
                to={isLoggedIn ? "/cart" : "/login"} 
                className="p-2 text-gray-600 relative"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="md:hidden mt-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-full h-10 pl-4 pr-12 border-2 border-blue-500 rounded-full focus:outline-none text-sm"
                  autoFocus
                />
                <button className="absolute right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Bar - Desktop */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center h-12">
            {/* Category Button */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                onMouseEnter={() => setIsCategoryOpen(true)}
                className="flex items-center gap-2 px-5 h-12 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span>전체카테고리</span>
              </button>

              {isCategoryOpen && (
                <div
                  className="absolute left-0 top-full w-56 bg-blue-600 shadow-lg z-50"
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/products?category=${category.slug}`}
                      className="flex items-center gap-3 px-5 py-3 text-white hover:bg-blue-700 transition-colors border-t border-blue-500"
                    >
                      <span className="text-sm">{category.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main Menu */}
            <nav className="flex items-center ml-2 gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-4 py-3 font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Menu */}
            <div className="flex items-center ml-auto gap-4">
              <a 
                href="tel:02-875-8204" 
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
              >
                <Phone className="w-4 h-4" />
                <span>02-875-8204</span>
              </a>
              <div className="flex items-center gap-3 pl-4 border-l">
                {isLoggedIn ? (
                  <Link to="/mypage" className="text-gray-600 hover:text-blue-600">
                    <User className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link to="/login" className="text-gray-600 hover:text-blue-600">
                    <User className="w-5 h-5" />
                  </Link>
                )}
                <Link 
                  to={isLoggedIn ? "/cart" : "/login"} 
                  className="text-gray-600 hover:text-blue-600 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isLoggedIn && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      0
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <img src="/logo.svg" alt="공간나라" className="h-7" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Section */}
            <div className="p-4 bg-gray-50 border-b">
              {isLoggedIn ? (
                <Link 
                  to="/mypage" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">마이페이지</p>
                    <p className="text-xs text-gray-500">주문내역, 회원정보</p>
                  </div>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center bg-blue-600 text-white rounded-lg text-sm font-medium"
                  >
                    로그인
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center border border-gray-300 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="p-4 border-b">
              <p className="text-xs font-medium text-gray-400 mb-2">카테고리</p>
              <div className="space-y-1">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/products?category=${category.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 border-b">
              <p className="text-xs font-medium text-gray-400 mb-2">메뉴</p>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="p-4">
              <p className="text-xs font-medium text-gray-400 mb-3">고객센터</p>
              <a 
                href="tel:02-875-8204"
                className="flex items-center gap-2 text-blue-600 font-bold text-lg"
              >
                <Phone className="w-5 h-5" />
                02-875-8204
              </a>
              <p className="text-xs text-gray-500 mt-1">평일 09:00 ~ 18:00</p>
              
              <Link
                to="/estimate"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block mt-4 py-3 text-center bg-blue-600 text-white rounded-lg font-medium"
              >
                무료 견적상담
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
