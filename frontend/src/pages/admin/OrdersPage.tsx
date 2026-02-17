import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  Eye,
  Truck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

const AdminOrdersPage = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: '전체', count: 156 },
    { id: 'pending', label: '결제대기', count: 12 },
    { id: 'paid', label: '결제완료', count: 8 },
    { id: 'shipping', label: '배송중', count: 23 },
    { id: 'delivered', label: '배송완료', count: 108 },
    { id: 'cancelled', label: '취소/반품', count: 5 },
  ]

  const orders = [
    { 
      id: 'ORD-2024001', 
      customer: '김민수', 
      phone: '010-1234-5678',
      products: [
        { name: '이탈리아 천연가죽 4인 소파', qty: 1, price: 1890000 }
      ],
      totalAmount: 1890000, 
      status: 'pending',
      paymentMethod: '카드결제',
      date: '2024-01-15 14:32',
      address: '서울시 강남구 테헤란로 123'
    },
    { 
      id: 'ORD-2024002', 
      customer: '이영희', 
      phone: '010-2345-6789',
      products: [
        { name: '루이스폴센 PH5 펜던트 조명', qty: 1, price: 890000 },
        { name: '스마트 LED 스탠드', qty: 2, price: 178000 }
      ],
      totalAmount: 1068000, 
      status: 'paid',
      paymentMethod: '무통장입금',
      date: '2024-01-15 11:20',
      address: '경기도 성남시 분당구 판교로 456'
    },
    { 
      id: 'ORD-2024003', 
      customer: '박철수', 
      phone: '010-3456-7890',
      products: [
        { name: '프리미엄 암막커튼 세트', qty: 2, price: 256000 }
      ],
      totalAmount: 256000, 
      status: 'shipping',
      paymentMethod: '카드결제',
      date: '2024-01-14 16:45',
      address: '부산시 해운대구 마린시티 789',
      trackingNo: '123456789012'
    },
    { 
      id: 'ORD-2024004', 
      customer: '최지은', 
      phone: '010-4567-8901',
      products: [
        { name: '원목 월넛 6단 서랍장', qty: 1, price: 680000 }
      ],
      totalAmount: 680000, 
      status: 'delivered',
      paymentMethod: '카카오페이',
      date: '2024-01-13 09:15',
      address: '대전시 유성구 대학로 321'
    },
    { 
      id: 'ORD-2024005', 
      customer: '정현우', 
      phone: '010-5678-9012',
      products: [
        { name: '허먼밀러 에어론 체어', qty: 1, price: 1650000 }
      ],
      totalAmount: 1650000, 
      status: 'cancelled',
      paymentMethod: '카드결제',
      date: '2024-01-12 18:30',
      address: '인천시 연수구 송도대로 654'
    },
  ]

  const getStatusInfo = (status: string) => {
    const config = {
      pending: { label: '결제대기', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      paid: { label: '결제완료', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
      shipping: { label: '배송중', color: 'bg-purple-100 text-purple-700', icon: Truck },
      delivered: { label: '배송완료', color: 'bg-green-100 text-green-700', icon: Package },
      cancelled: { label: '취소', color: 'bg-red-100 text-red-700', icon: XCircle },
    }
    return config[status as keyof typeof config]
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
                {tab.count}
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
              placeholder="주문번호, 고객명, 연락처 검색"
              className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 px-3 h-10 border border-gray-200 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="시작일" 
              className="w-24 text-sm focus:outline-none"
            />
            <span className="text-gray-300">~</span>
            <input 
              type="text" 
              placeholder="종료일" 
              className="w-24 text-sm focus:outline-none"
            />
          </div>

          <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            상세 필터
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
            <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors">
              배송중 처리
            </button>
            <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors">
              배송완료 처리
            </button>
            <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
              주문 취소
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
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
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon
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
                    <p className="text-sm font-medium text-blue-600">{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                    <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-800">{order.customer}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.phone}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-700">
                      {order.products[0].name}
                      {order.products.length > 1 && (
                        <span className="text-gray-400"> 외 {order.products.length - 1}건</span>
                      )}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-bold text-gray-800">₩{order.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </span>
                    {order.trackingNo && (
                      <p className="text-[10px] text-gray-400 mt-1">송장: {order.trackingNo}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="상세보기">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="더보기">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            1-5 / 총 156개
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
              32
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

export default AdminOrdersPage

