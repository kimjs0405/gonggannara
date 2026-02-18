import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('orders')
  const [user, setUser] = useState<{ email: string; name?: string; phone?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }
      
      setUser({
        email: session.user.email || '',
        name: session.user.user_metadata?.name || '회원',
        phone: session.user.user_metadata?.phone || '',
      })
      setIsLoading(false)
    }
    checkAuth()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('userLoggedIn')
    navigate('/')
  }

  // 샘플 주문 데이터 (실제로는 Supabase에서 가져옴)
  const orders: { id: string; date: string; status: string; total: number; items: { name: string; qty: number }[] }[] = []

  const menuItems = [
    { id: 'orders', icon: Package, label: '주문/배송 조회', count: orders.length },
    { id: 'wishlist', icon: Heart, label: '찜한 상품', count: 0 },
    { id: 'address', icon: MapPin, label: '배송지 관리' },
    { id: 'profile', icon: User, label: '회원정보 수정' },
    { id: 'settings', icon: Settings, label: '설정' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800">마이페이지</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            {/* User Info */}
            <div className="bg-white rounded-lg p-6 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user?.name}님</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/estimate"
                className="block w-full py-2 text-center bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                인테리어 상담 신청
              </Link>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-lg overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left border-b last:border-0 transition-colors ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count !== undefined && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{item.count}</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">로그아웃</span>
              </button>
            </div>

            {/* Customer Service */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <p className="text-sm font-medium text-gray-800 mb-2">고객센터</p>
              <div className="flex items-center gap-2 text-blue-600">
                <Phone className="w-4 h-4" />
                <span className="font-bold">02-875-8204</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">평일 09:00 ~ 18:00</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-bold text-gray-800">주문/배송 조회</h2>
                </div>
                
                {orders.length > 0 ? (
                  <div className="divide-y">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-sm text-gray-500">{order.date}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-sm font-medium">{order.id}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === '배송완료' ? 'bg-green-100 text-green-700' :
                            order.status === '배송중' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {order.items[0]?.name}
                              {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                            </p>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              {order.total.toLocaleString()}원
                            </p>
                          </div>
                          <Link
                            to={`/orders/${order.id}`}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                          >
                            주문 상세
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">주문 내역이 없습니다</p>
                    <Link
                      to="/products"
                      className="inline-block px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      쇼핑하러 가기
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-bold text-gray-800">찜한 상품</h2>
                </div>
                <div className="p-16 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">찜한 상품이 없습니다</p>
                  <Link
                    to="/products"
                    className="inline-block px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    상품 둘러보기
                  </Link>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="bg-white rounded-lg">
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">배송지 관리</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    + 새 배송지 추가
                  </button>
                </div>
                <div className="p-16 text-center">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">등록된 배송지가 없습니다</p>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-bold text-gray-800">회원정보 수정</h2>
                </div>
                <div className="p-6">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-t">
                        <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700 w-40">
                          이메일
                        </th>
                        <td className="py-4 px-4">
                          <span className="text-gray-800">{user?.email}</span>
                          <span className="ml-2 text-xs text-gray-400">(변경 불가)</span>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700">
                          이름
                        </th>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            defaultValue={user?.name}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          />
                        </td>
                      </tr>
                      <tr className="border-t">
                        <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700">
                          연락처
                        </th>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            defaultValue={user?.phone}
                            placeholder="010-0000-0000"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          />
                        </td>
                      </tr>
                      <tr className="border-t border-b">
                        <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700">
                          비밀번호
                        </th>
                        <td className="py-4 px-4">
                          <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                            비밀번호 변경
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-6 flex justify-center">
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                      정보 수정
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-bold text-gray-800">설정</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-800">마케팅 정보 수신</p>
                      <p className="text-sm text-gray-500">이벤트, 할인 정보 등을 이메일로 받습니다</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-800">SMS 알림</p>
                      <p className="text-sm text-gray-500">주문/배송 정보를 SMS로 받습니다</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="pt-6">
                    <button className="text-sm text-red-500 hover:underline">
                      회원 탈퇴
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage

