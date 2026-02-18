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
  ChevronRight,
  Search,
  Menu,
  X,
  Home,
  Activity,
  HelpCircle,
  UserCircle,
  Shield
} from 'lucide-react'
import { useState, useEffect } from 'react'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // 로그인 체크
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn')
    if (!isLoggedIn) {
      navigate('/admin/login')
    }
  }, [navigate])

  // 현재 경로에 따라 서브메뉴 자동 확장
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(sub => location.pathname === sub.path)
        if (hasActiveSubmenu && !expandedMenus.includes(item.path)) {
          setExpandedMenus([...expandedMenus, item.path])
        }
      }
    })
  }, [location.pathname])

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }

  const toggleSubmenu = (path: string) => {
    if (expandedMenus.includes(path)) {
      setExpandedMenus(expandedMenus.filter(p => p !== path))
    } else {
      setExpandedMenus([...expandedMenus, path])
    }
  }

  const menuItems = [
    { 
      title: '대시보드', 
      path: '/admin', 
      icon: LayoutDashboard,
      exact: true,
      badge: null
    },
    { 
      title: '상품 관리', 
      path: '/admin/products', 
      icon: Package,
      submenu: [
        { title: '상품 목록', path: '/admin/products', icon: Package },
        { title: '상품 등록', path: '/admin/products/new', icon: Package },
        { title: '카테고리 관리', path: '/admin/categories', icon: Tag },
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
      icon: Users,
      badge: null
    },
    { 
      title: '매출/통계', 
      path: '/admin/analytics', 
      icon: BarChart3,
      badge: null
    },
    { 
      title: '프로모션', 
      path: '/admin/promotions', 
      icon: Tag,
      submenu: [
        { title: '쿠폰 관리', path: '/admin/coupons', icon: Tag },
        { title: '이벤트 관리', path: '/admin/events', icon: Activity },
        { title: '프로모션 카드', path: '/admin/promotion-cards', icon: Image },
      ]
    },
    { 
      title: '배너 관리', 
      path: '/admin/banners', 
      icon: Image,
      badge: null
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
      icon: Settings,
      badge: null
    },
  ]

  const notifications = [
    { id: 1, title: '새로운 주문이 있습니다', time: '5분 전', type: 'order' },
    { id: 2, title: '재고 부족 상품 알림', time: '1시간 전', type: 'warning' },
    { id: 3, title: '시스템 업데이트 완료', time: '2시간 전', type: 'info' },
    { id: 4, title: '새로운 리뷰가 등록되었습니다', time: '3시간 전', type: 'review' },
  ]

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-[#1E293B] text-white transition-all duration-300 z-50 ${
        isSidebarCollapsed ? 'w-[70px]' : 'w-[240px]'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[#334155]">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-lg">G</span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="font-semibold text-base text-white">공간나라</h1>
                <p className="text-[10px] text-gray-400">관리자 시스템</p>
              </div>
            )}
          </Link>
        </div>

        {/* Menu */}
        <nav className="py-4 px-4 overflow-y-auto custom-scrollbar" style={{ height: 'calc(100vh - 80px - 90px)' }}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const active = isActive(item.path, item.exact)
              const isExpanded = expandedMenus.includes(item.path)
              
              return (
                <div key={item.path} className="mb-1">
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => !isSidebarCollapsed && toggleSubmenu(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                          active || isExpanded
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-300 hover:bg-[#334155] hover:text-white'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                        {!isSidebarCollapsed && (
                          <>
                            <span className="text-sm font-medium flex-1 text-left">{item.title}</span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 transition-transform" />
                            ) : (
                              <ChevronRight className="w-4 h-4 transition-transform" />
                            )}
                          </>
                        )}
                      </button>
                      {!isSidebarCollapsed && isExpanded && (
                        <div className="mt-1 ml-4 space-y-1 border-l-2 border-[#334155]/50 pl-4">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon
                            const subActive = location.pathname === subItem.path
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                                  subActive
                                    ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500'
                                    : 'text-gray-400 hover:bg-[#334155] hover:text-gray-200'
                                }`}
                              >
                                <SubIcon className="w-4 h-4" strokeWidth={2} />
                                <span className="text-xs font-medium">{subItem.title}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                        active 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-[#334155] hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                      {!isSidebarCollapsed && (
                        <>
                          <span className="text-sm font-medium flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-medium">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#334155]">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">관리자</p>
                <p className="text-[11px] text-gray-400 truncate">gonggan8204</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-[70px]' : 'ml-[240px]'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="주문, 상품, 회원 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white border border-gray-300 text-sm focus:outline-none focus:border-blue-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-lg border border-gray-300 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-300 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">알림</h3>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">모두 읽음</button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors">
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center">
                      모든 알림 보기
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-gray-200" />

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <UserCircle className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">관리자</p>
                  <p className="text-xs text-gray-500">관리자 권한</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg border border-gray-300 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">gonggan8204</p>
                    <p className="text-xs text-gray-500">관리자 계정</p>
                  </div>
                  <div className="py-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Home className="w-4 h-4" />
                      쇼핑몰 보기
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full">
                      <Shield className="w-4 h-4" />
                      권한 관리
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full">
                      <HelpCircle className="w-4 h-4" />
                      도움말
                    </button>
                  </div>
                  <div className="border-t border-gray-200 p-2">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Click outside to close menus */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </div>
  )
}

export default AdminLayout
