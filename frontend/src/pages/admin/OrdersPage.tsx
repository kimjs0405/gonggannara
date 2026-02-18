import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  X
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface OrderItem {
  id: string
  product_name: string
  product_price: number
  quantity: number
}

interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  shipping_address: string
  shipping_name: string
  shipping_phone: string
  shipping_memo: string
  payment_method: string
  created_at: string
  order_items?: OrderItem[]
  profiles?: { email: string; name: string }
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    paid: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  })

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'pending', label: '결제대기' },
    { id: 'paid', label: '결제완료' },
    { id: 'shipping', label: '배송중' },
    { id: 'delivered', label: '배송완료' },
    { id: 'cancelled', label: '취소/반품' },
  ]

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    setLoading(true)
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        profiles:user_id (email, name)
      `)
      .order('created_at', { ascending: false })

    if (activeTab !== 'all') {
      query = query.eq('status', activeTab)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
    } else {
      setOrders(data || [])
    }

    // 상태별 카운트 가져오기
    const { data: countData } = await supabase.from('orders').select('status')
    if (countData) {
      const counts = {
        all: countData.length,
        pending: countData.filter(o => o.status === 'pending').length,
        paid: countData.filter(o => o.status === 'paid').length,
        shipping: countData.filter(o => o.status === 'shipping').length,
        delivered: countData.filter(o => o.status === 'delivered').length,
        cancelled: countData.filter(o => o.status === 'cancelled').length,
      }
      setStatusCounts(counts)
    }

    setLoading(false)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      alert('상태 변경 실패: ' + error.message)
    } else {
      fetchOrders()
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (!confirm(`선택한 ${selectedOrders.length}개 주문을 "${getStatusInfo(newStatus).label}" 상태로 변경하시겠습니까?`)) return

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .in('id', selectedOrders)

    if (error) {
      alert('상태 변경 실패: ' + error.message)
    } else {
      setSelectedOrders([])
      fetchOrders()
    }
  }

  const getStatusInfo = (status: string) => {
    const config: { [key: string]: { label: string; color: string; icon: typeof Clock } } = {
      pending: { label: '결제대기', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      paid: { label: '결제완료', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
      shipping: { label: '배송중', color: 'bg-purple-100 text-purple-700', icon: Truck },
      delivered: { label: '배송완료', color: 'bg-green-100 text-green-700', icon: Package },
      cancelled: { label: '취소', color: 'bg-red-100 text-red-700', icon: XCircle },
    }
    return config[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: Clock }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    )
  }

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shipping_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shipping_phone?.includes(searchQuery)
  )

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">주문 관리</h1>
          <p className="text-sm text-gray-500 mt-1">고객 주문을 관리하고 배송 상태를 업데이트하세요.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* Status Tabs */}
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
                {statusCounts[tab.id as keyof typeof statusCounts]}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="주문번호, 고객명, 연락처 검색"
              className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            새로고침
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedOrders.length}개 주문 선택됨
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusUpdate('shipping')}
              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors"
            >
              배송중 처리
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('delivered')}
              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors"
            >
              배송완료 처리
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('cancelled')}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              주문 취소
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">주문이 없습니다.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">주문정보</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">고객정보</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상품</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">결제금액</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="w-20 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-blue-600">{order.id.slice(0, 8)}...</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                      <p className="text-xs text-gray-400">{order.payment_method || '-'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-800">{order.shipping_name || '-'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.shipping_phone || '-'}</p>
                    </td>
                    <td className="px-4 py-4">
                      {order.order_items && order.order_items.length > 0 ? (
                        <p className="text-sm text-gray-700">
                          {order.order_items[0].product_name}
                          {order.order_items.length > 1 && (
                            <span className="text-gray-400"> 외 {order.order_items.length - 1}건</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-bold text-gray-800">₩{order.total_amount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusInfo.color}`}
                      >
                        <option value="pending">결제대기</option>
                        <option value="paid">결제완료</option>
                        <option value="shipping">배송중</option>
                        <option value="delivered">배송완료</option>
                        <option value="cancelled">취소</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => openDetailModal(order)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">주문 상세</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">주문번호</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">주문일시</p>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">배송 정보</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">받는분</p>
                    <p>{selectedOrder.shipping_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">연락처</p>
                    <p>{selectedOrder.shipping_phone || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">주소</p>
                    <p>{selectedOrder.shipping_address || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">배송메모</p>
                    <p>{selectedOrder.shipping_memo || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">주문 상품</h3>
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product_name} x {item.quantity}</span>
                        <span className="font-medium">₩{(item.product_price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">상품 정보 없음</p>
                )}
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="font-medium">총 결제금액</span>
                <span className="text-xl font-bold text-blue-600">₩{selectedOrder.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage
