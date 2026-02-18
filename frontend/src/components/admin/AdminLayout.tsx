import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3,
  Tag,
  Image,
  MessageSquare,
  Bell,
  LogOut,
  ChevronDown,
  Search,
  Menu
} from 'lucide-react'
import { useState, useEffect } from 'react'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // 로그인 체크
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn')
    if (!isLoggedIn) {
      navigate('/admin/login')
    }
  }, [navigate])

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }

  const menuItems = [
    { 
      title: '대시보드', 
      path: '/admin', 
      icon: LayoutDashboard,
      exact: true
    },
    { 
      title: '상품 관리', 
      path: '/admin/products', 
      icon: Package,
      submenu: [
        { title: '상품 목록', path: '/admin/products' },
        { title: '상품 등록', path: '/admin/products/new' },
        { title: '카테고리 관리', path: '/admin/categories' },
      ]
    },
    { 
      title: '주문 관리', 
      path: '/admin/orders', 
      icon: ShoppingCart,
      badge: 12
    },
    { 
      title: '회원 관리', 
      path: '/admin/users', 
      icon: Users 
    },
    { 
      title: '매출/통계', 
      path: '/admin/analytics', 
      icon: BarChart3 
    },
    { 
      title: '프로모션', 
      path: '/admin/promotions', 
      icon: Tag,
      submenu: [
        { title: '쿠폰 관리', path: '/admin/coupons' },
        { title: '이벤트 관리', path: '/admin/events' },
        { title: '프로모션 카드', path: '/admin/promotion-cards' },
      ]
    },
    { 
      title: '배너 관리', 
      path: '/admin/banners', 
      icon: Image 
    },
    { 
      title: '리뷰 관리', 
      path: '/admin/reviews', 
      icon: MessageSquare,
      badge: 5
    },
    { 
      title: '설정', 
      path: '/admin/settings', 
      icon: Settings 
    },
  ]

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-[#1E293B] text-white transition-all duration-300 z-50 ${
        isSidebarCollapsed ? 'w-[70px]' : 'w-[260px]'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[#334155]">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="font-bold text-[15px]">공간나라</h1>
                <p className="text-[10px] text-gray-400">Admin System</p>
              </div>
            )}
          </Link>
        </div>

        {/* Menu */}
        <nav className="py-4 px-3 overflow-y-auto" style={{ height: 'calc(100vh - 64px - 70px)' }}>
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.path, item.exact)
            
            return (
              <div key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                    active 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:bg-[#334155] hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="text-[13px] flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.submenu && (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </>
                  )}
                </Link>
              </div>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#334155]">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium">관</span>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">관리자</p>
                <p className="text-[11px] text-gray-400 truncate">gonggan8204</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-[70px]' : 'ml-[260px]'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                className="w-[300px] h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              쇼핑몰 보기
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
