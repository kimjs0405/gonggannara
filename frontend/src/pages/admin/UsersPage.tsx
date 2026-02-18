import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  Mail,
  User,
  Crown,
  ShoppingBag,
  Calendar,
  X
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface UserProfile {
  id: string
  email: string
  name: string
  phone: string
  address: string
  created_at: string
  order_count?: number
  total_spent?: number
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    
    // profiles 테이블에서 회원 정보 가져오기
    const { data: profilesData, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
    } else {
      // 각 회원의 주문 정보 계산
      const usersWithStats = await Promise.all(
        (profilesData || []).map(async (user) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('user_id', user.id)

          const orderCount = orders?.length || 0
          const totalSpent = orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0

          return {
            ...user,
            order_count: orderCount,
            total_spent: totalSpent,
          }
        })
      )

      setUsers(usersWithStats)
      
      // 통계 계산
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const newUsersThisMonth = usersWithStats.filter(
        u => new Date(u.created_at) >= firstDayOfMonth
      ).length

      setStats({
        totalUsers: usersWithStats.length,
        newUsersThisMonth,
      })
    }

    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
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

  const openDetailModal = (user: UserProfile) => {
    setSelectedUser(user)
    setShowDetailModal(true)
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.includes(searchQuery)
  )

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
          <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">+{stats.newUsersThisMonth} 이번 달</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">구매 회원</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {users.filter(u => (u.order_count || 0) > 0).length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.totalUsers > 0 
              ? ((users.filter(u => (u.order_count || 0) > 0).length / stats.totalUsers) * 100).toFixed(1)
              : 0}%
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">총 매출</span>
            <Crown className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₩{users.reduce((sum, u) => sum + (u.total_spent || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">평균 구매액</span>
            <Calendar className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₩{users.filter(u => (u.order_count || 0) > 0).length > 0
              ? Math.round(
                  users.reduce((sum, u) => sum + (u.total_spent || 0), 0) /
                  users.filter(u => (u.order_count || 0) > 0).length
                ).toLocaleString()
              : 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 mb-5 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 이메일, 연락처 검색"
              className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            새로고침
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">등록된 회원이 없습니다.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">회원정보</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">주문수</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">총 구매액</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                <th className="w-20 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
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
                        <span className="text-sm font-medium text-gray-600">
                          {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.name || '-'}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.phone || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-medium text-gray-800">{user.order_count || 0}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-bold text-gray-800">
                      ₩{(user.total_spent || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-gray-600">{formatDate(user.created_at)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openDetailModal(user)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <a
                        href={`mailto:${user.email}`}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="이메일 발송"
                      >
                        <Mail className="w-4 h-4 text-gray-400" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">회원 상세</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-600">
                    {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">{selectedUser.name || '-'}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                <div>
                  <p className="text-gray-500">연락처</p>
                  <p className="font-medium">{selectedUser.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">가입일</p>
                  <p className="font-medium">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">주소</p>
                  <p className="font-medium">{selectedUser.address || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-blue-600">총 주문</p>
                  <p className="text-2xl font-bold text-blue-800">{selectedUser.order_count || 0}건</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-green-600">총 구매액</p>
                  <p className="text-2xl font-bold text-green-800">₩{(selectedUser.total_spent || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage
