import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, ShoppingCart, User, Phone } from 'lucide-react'

const Header = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true'
      setIsLoggedIn(loggedIn)
    }
    checkLogin()
    window.addEventListener('storage', checkLogin)
    return () => window.removeEventListener('storage', checkLogin)
  }, [])

  const categories = [
    { name: '가구·소파·침대', slug: 'furniture' },
    { name: '조명·인테리어등', slug: 'lighting' },
    { name: '커튼·블라인드', slug: 'curtain' },
    { name: '벽지·바닥재', slug: 'wallpaper' },
    { name: '주방·욕실용품', slug: 'kitchen' },
    { name: '수납·정리용품', slug: 'storage' },
    { name: '홈데코·소품', slug: 'deco' },
  ]

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      navigate('/login')
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main Header */}
      <div className="max-w-[1200px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-black text-xl">G</span>
              </div>
              <div className="ml-2">
                <h1 className="text-2xl font-black tracking-tight">
                  <span className="text-blue-600">공간나라</span>
                </h1>
                <p className="text-[10px] text-gray-500 -mt-1">인테리어 & 쇼핑몰</p>
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
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

          {/* Contact Info */}
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-gray-500">상담전화</p>
            <p className="text-xl font-black text-blue-600 tracking-tight">02-875-8204</p>
            <p className="text-[10px] text-gray-400">평일 09:00 ~ 18:00</p>
          </div>

          {/* CTA Button */}
          <Link
            to="/estimate"
            className="flex-shrink-0 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <div className="text-center">
              <p className="font-bold">무료 견적상담</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-t border-gray-100">
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
              {[
                { name: '견적문의', path: '/estimate' },
                { name: '포트폴리오', path: '/portfolio' },
                { name: '고객후기', path: '/reviews' },
                { name: '회사소개', path: '/about' },
              ].map((item) => (
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
                  onClick={handleCartClick}
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
    </header>
  )
}

export default Header
