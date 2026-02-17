import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  User,
  Crown,
  ShoppingBag,
  Calendar
} from 'lucide-react'

const AdminUsersPage = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: '전체 회원', count: 2458 },
    { id: 'vip', label: 'VIP', count: 156 },
    { id: 'active', label: '활성', count: 2102 },
    { id: 'dormant', label: '휴면', count: 200 },
  ]

  const users = [
    { 
      id: 'USR001', 
      name: '김민수', 
      email: 'minsu.kim@email.com',
      phone: '010-1234-5678',
      grade: 'vip',
      orderCount: 28,
      totalSpent: 15680000,
      lastOrder: '2024-01-15',
      joinDate: '2022-03-10',
      status: 'active'
    },
    { 
      id: 'USR002', 
      name: '이영희', 
      email: 'younghee.lee@email.com',
      phone: '010-2345-6789',
      grade: 'gold',
      orderCount: 15,
      totalSpent: 4520000,
      lastOrder: '2024-01-12',
      joinDate: '2023-01-25',
      status: 'active'
    },
    { 
      id: 'USR003', 
      name: '박철수', 
      email: 'chulsoo.park@email.com',
      phone: '010-3456-7890',
      grade: 'silver',
      orderCount: 8,
      totalSpent: 1280000,
      lastOrder: '2024-01-10',
      joinDate: '2023-06-15',
      status: 'active'
    },
    { 
      id: 'USR004', 
      name: '최지은', 
      email: 'jieun.choi@email.com',
      phone: '010-4567-8901',
      grade: 'normal',
      orderCount: 3,
      totalSpent: 450000,
      lastOrder: '2023-12-20',
      joinDate: '2023-11-01',
      status: 'active'
    },
    { 
      id: 'USR005', 
      name: '정현우', 
      email: 'hyunwoo.jung@email.com',
      phone: '010-5678-9012',
      grade: 'normal',
      orderCount: 1,
      totalSpent: 89000,
      lastOrder: '2023-06-15',
      joinDate: '2023-05-20',
      status: 'dormant'
    },
  ]

  const getGradeBadge = (grade: string) => {
    const config = {
      vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700', icon: Crown },
      gold: { label: 'GOLD', color: 'bg-yellow-100 text-yellow-700', icon: Crown },
      silver: { label: 'SILVER', color: 'bg-gray-200 text-gray-600', icon: Crown },
      normal: { label: '일반', color: 'bg-gray-100 text-gray-500', icon: User },
    }
    const info = config[grade as keyof typeof config]
    const Icon = info.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${info.color}`}>
        <Icon className="w-3 h-3" />
        {info.label}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: '활성', color: 'bg-green-100 text-green-700' },
      dormant: { label: '휴면', color: 'bg-gray-100 text-gray-500' },
      blocked: { label: '정지', color: 'bg-red-100 text-red-700' },
    }
    const info = config[status as keyof typeof config]
    return (
      <span className={`px-2 py-1 rounded text-[11px] font-medium ${info.color}`}>
        {info.label}
      </span>
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(u => u.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">회원 관리</h1>
          <p className="text-sm text-gray-500 mt-1">등록된 회원을 관리하고 분석하세요.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">총 회원수</span>
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">2,458</p>
          <p className="text-xs text-green-600 mt-1">+48 이번 달</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">VIP 회원</span>
            <Crown className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">156</p>
          <p className="text-xs text-gray-400 mt-1">전체의 6.3%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">평균 구매액</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">₩458K</p>
          <p className="text-xs text-green-600 mt-1">+12.5% 전월 대비</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">재구매율</span>
            <Calendar className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">28.5%</p>
          <p className="text-xs text-green-600 mt-1">+3.2% 전월 대비</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-xl border border-gray-100 mb-5">
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count.toLocaleString()}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 이메일, 연락처 검색"
              className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <select className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-blue-500">
            <option value="">회원등급 전체</option>
            <option value="vip">VIP</option>
            <option value="gold">GOLD</option>
            <option value="silver">SILVER</option>
            <option value="normal">일반</option>
          </select>

          <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            상세 필터
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">회원정보</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">등급</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">주문수</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">총 구매액</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">최근주문</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="w-20 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  {getGradeBadge(user.grade)}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm font-medium text-gray-800">{user.orderCount}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-bold text-gray-800">₩{user.totalSpent.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm text-gray-600">{user.lastOrder}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="상세보기">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="이메일 발송">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="더보기">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            1-5 / 총 2,458명
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {[1, 2, 3, 4, 5].map(page => (
              <button
                key={page}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  page === 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-gray-400">...</span>
            <button className="w-8 h-8 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              492
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPage

