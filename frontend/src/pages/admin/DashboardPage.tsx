import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Users, 
  Package,
  DollarSign,
  ArrowUpRight,
  MoreHorizontal,
  Eye
} from 'lucide-react'

const DashboardPage = () => {
  // 통계 데이터 (실제로는 Supabase에서 가져옴)
  const stats = [
    { 
      title: '총 매출', 
      value: '₩12,450,000', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    { 
      title: '주문 건수', 
      value: '156', 
      change: '+8.2%', 
      trend: 'up',
      icon: ShoppingCart,
      color: 'green'
    },
    { 
      title: '신규 회원', 
      value: '48', 
      change: '-2.4%', 
      trend: 'down',
      icon: Users,
      color: 'purple'
    },
    { 
      title: '상품 조회수', 
      value: '8,240', 
      change: '+18.7%', 
      trend: 'up',
      icon: Eye,
      color: 'orange'
    },
  ]

  const recentOrders = [
    { id: 'ORD-2024001', customer: '김민수', product: '이탈리아 천연가죽 소파', amount: 1890000, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-2024002', customer: '이영희', product: '북유럽 펜던트 조명 외 2건', amount: 245000, status: 'shipping', date: '2024-01-15' },
    { id: 'ORD-2024003', customer: '박철수', product: '프리미엄 암막커튼 세트', amount: 128000, status: 'delivered', date: '2024-01-14' },
    { id: 'ORD-2024004', customer: '최지은', product: '원목 월넛 서랍장', amount: 680000, status: 'pending', date: '2024-01-14' },
    { id: 'ORD-2024005', customer: '정현우', product: '허먼밀러 에어론 체어', amount: 1650000, status: 'paid', date: '2024-01-14' },
  ]

  const topProducts = [
    { rank: 1, name: '이탈리아 천연가죽 4인 소파', sales: 45, revenue: 85050000 },
    { rank: 2, name: '루이스폴센 PH5 펜던트 조명', sales: 38, revenue: 33820000 },
    { rank: 3, name: '허먼밀러 에어론 체어', sales: 32, revenue: 52800000 },
    { rank: 4, name: '원목 월넛 6단 서랍장', sales: 28, revenue: 19040000 },
    { rank: 5, name: '프리미엄 퀸 매트리스', sales: 24, revenue: 21360000 },
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-blue-100 text-blue-700',
      shipping: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    const labels = {
      pending: '결제대기',
      paid: '결제완료',
      shipping: '배송중',
      delivered: '배송완료',
      cancelled: '취소',
    }
    return (
      <span className={`px-2 py-1 rounded text-[11px] font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">공간나라 관리자 시스템에 오신 것을 환영합니다.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon
          return (
            <div key={idx} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 ${getColorClass(stat.color)} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">최근 주문</h2>
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              전체보기 <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">주문번호</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">고객</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상품</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-blue-600">{order.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">{order.customer}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600 truncate block max-w-[200px]">{order.product}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-medium text-gray-800">₩{order.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-5 py-4">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">인기 상품 TOP 5</h2>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.rank} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    product.rank <= 3 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.sales}개 판매</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">₩{(product.revenue / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-5 mt-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">오늘 방문자</span>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-800">1,284</p>
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">장바구니 전환율</span>
            <ShoppingCart className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-800">3.2%</p>
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '32%' }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">평균 주문금액</span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-800">₩458,000</p>
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">재구매율</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-800">28.5%</p>
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '28.5%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

