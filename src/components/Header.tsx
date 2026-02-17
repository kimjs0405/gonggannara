import { useState } from 'react'
import { Search, ChevronDown, Menu, ShoppingCart, User } from 'lucide-react'

const Header = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { name: '가구·소파·침대', icon: '🛋️' },
    { name: '조명·인테리어등', icon: '💡' },
    { name: '커튼·블라인드', icon: '🪟' },
    { name: '벽지·바닥재', icon: '🧱' },
    { name: '주방·욕실용품', icon: '🚿' },
    { name: '수납·정리용품', icon: '📦' },
    { name: '홈데코·소품', icon: '🎨' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main Header */}
      <div className="max-w-[1200px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
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
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="인테리어 용품을 검색하세요 !"
                className="w-full h-11 pl-4 pr-28 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-sm"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500 border-r pr-2">
                  <span className="text-blue-600 font-bold">3</span>
                  <span>장바구니</span>
                </div>
                <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-gray-500">대표번호</p>
            <p className="text-2xl font-black text-blue-600 tracking-tight">1577-2288</p>
            <div className="text-[11px] text-gray-500 mt-0.5 space-y-0">
              <p>강남본부 02-538-3000</p>
              <p>가산디지털 02-920-9000</p>
              <p>도봉본사 02-956-6700</p>
            </div>
          </div>

          {/* Info Button */}
          <a
            href="#"
            className="flex-shrink-0 bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <div className="text-center">
              <p className="font-bold">공간나라</p>
              <p className="text-xs opacity-90">본부 안내 &gt;</p>
            </div>
          </a>
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
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-[10px] rounded">click</span>
              </button>

              {/* Category Dropdown */}
              {isCategoryOpen && (
                <div
                  className="absolute left-0 top-full w-64 bg-blue-600 shadow-lg z-50"
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  {categories.map((category, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center gap-3 px-5 py-3 text-white hover:bg-blue-700 transition-colors border-t border-blue-500"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Main Menu */}
            <nav className="flex items-center ml-2 gap-1">
              {['베스트100', '기획전', '증정이벤트', '당일발송', '전문관'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-4 py-3 font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Right Menu */}
            <div className="flex items-center ml-auto gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                <Search className="w-3 h-3" />
                맞춤검색
              </button>
              {['용도별', '스타일별', '가격별'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-2 py-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <User className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    3
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

