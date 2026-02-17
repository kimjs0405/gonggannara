import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, Phone } from 'lucide-react'

const Header = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { name: '거실 인테리어', slug: 'living' },
    { name: '주방 인테리어', slug: 'kitchen' },
    { name: '침실 인테리어', slug: 'bedroom' },
    { name: '욕실 인테리어', slug: 'bathroom' },
    { name: '사무실 인테리어', slug: 'office' },
    { name: '상업공간 인테리어', slug: 'commercial' },
    { name: '리모델링', slug: 'remodeling' },
  ]

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
                  <span className="text-gray-700 text-lg font-bold">인테리어</span>
                </h1>
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
                placeholder="어떤 공간을 꾸미고 싶으세요?"
                className="w-full h-11 pl-4 pr-14 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-sm"
              />
              <button className="absolute right-2 w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-gray-500">무료 상담전화</p>
            <p className="text-2xl font-black text-blue-600 tracking-tight">1577-2288</p>
            <p className="text-[11px] text-gray-400">평일 09:00 ~ 18:00</p>
          </div>

          {/* CTA Button */}
          <Link
            to="/estimate"
            className="flex-shrink-0 bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <div className="text-center flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="font-bold">무료 견적상담</span>
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
                <span>전체 서비스</span>
              </button>

              {isCategoryOpen && (
                <div
                  className="absolute left-0 top-full w-56 bg-blue-600 shadow-lg z-50"
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/services/${category.slug}`}
                      className="flex items-center gap-3 px-5 py-3 text-white hover:bg-blue-700 transition-colors border-t border-blue-500"
                    >
                      <span className="text-sm">{category.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main Menu */}
            <nav className="flex items-center ml-6 gap-2">
              {[
                { name: '견적문의', path: '/estimate' },
                { name: '포트폴리오', path: '/portfolio' },
                { name: '고객후기', path: '/reviews' },
                { name: '회사소개', path: '/about' },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-5 py-3 font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right - Contact */}
            <div className="flex items-center ml-auto gap-4">
              <a 
                href="tel:1577-2288" 
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="font-medium">1577-2288</span>
              </a>
              <Link 
                to="/estimate" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                빠른 상담신청
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
