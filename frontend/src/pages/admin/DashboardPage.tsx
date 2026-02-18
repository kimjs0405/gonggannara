import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Users, 
  Package,
  DollarSign,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  shipping_name: string
  order_items?: Array<{
    product_name: string
    quantity: number
  }>
  profiles?: {
    name: string
    email: string
  }
}

interface TopProduct {
  rank: number
  name: string
  sales: number
  revenue: number
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newUsers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
    productsChange: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [quickStats, setQuickStats] = useState({
    avgOrderAmount: 0,
    cartConversionRate: 0,
    repeatPurchaseRate: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    
    try {
      // 현재 기간 데이터 (이번 달)
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      // 주문 데이터 (이번 달)
      const { data: ordersThisMonth } = await supabase
        .from('orders')
        .select('*, order_items(*), profiles(name, email)')
        .neq('status', 'cancelled')
        .gte('created_at', thisMonthStart.toISOString())

      // 주문 데이터 (지난 달)
      const { data: ordersLastMonth } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'cancelled')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())

      // 전체 주문 데이터 (통계용)
      const { data: allOrders } = await supabase
        .from('orders')
        .select('*, order_items(*), profiles(name, email)')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
        .limit(5)

      // 회원 수 (이번 달)
      const { count: usersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart.toISOString())

      // 회원 수 (지난 달)
      const { count: usersLastMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())

      // 상품 수
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // 이번 달 매출
      const revenueThisMonth = ordersThisMonth?.reduce((sum, o) => sum + o.total_amount, 0) || 0
      const ordersCountThisMonth = ordersThisMonth?.length || 0

      // 지난 달 매출
      const revenueLastMonth = ordersLastMonth?.reduce((sum, o) => sum + o.total_amount, 0) || 0
      const ordersCountLastMonth = ordersLastMonth?.length || 0

      // 변화율 계산
      const revenueChange = revenueLastMonth > 0 
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
        : (revenueThisMonth > 0 ? 100 : 0)
      const ordersChange = ordersCountLastMonth > 0
        ? ((ordersCountThisMonth - ordersCountLastMonth) / ordersCountLastMonth) * 100
        : (ordersCountThisMonth > 0 ? 100 : 0)
      const usersChange = (usersLastMonth || 0) > 0
        ? (((usersThisMonth || 0) - (usersLastMonth || 0)) / (usersLastMonth || 0)) * 100
        : ((usersThisMonth || 0) > 0 ? 100 : 0)

      // 전체 매출
      const totalRevenue = allOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0

      // 최근 주문
      setRecentOrders(allOrders || [])

      // 인기 상품 계산
      const { data: allOrderItems } = await supabase
        .from('order_items')
        .select('product_name, product_price, quantity')

      if (allOrderItems) {
        const productMap = new Map<string, { sales: number; revenue: number }>()
        allOrderItems.forEach(item => {
          const existing = productMap.get(item.product_name) || { sales: 0, revenue: 0 }
          productMap.set(item.product_name, {
            sales: existing.sales + item.quantity,
            revenue: existing.revenue + (item.product_price * item.quantity),
          })
        })

        const sorted = Array.from(productMap.entries())
          .map(([name, data], idx) => ({ rank: idx + 1, name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        setTopProducts(sorted)
      }

      // Quick Stats 계산
      const totalOrdersCount = allOrders?.length || 0
      const avgOrderAmount = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0

      // 재구매율 계산 (2개 이상 주문한 회원 비율)
      const userIds = new Set(allOrders?.map(o => o.user_id) || [])
      const userOrderCounts = new Map<string, number>()
      allOrders?.forEach(o => {
        const count = userOrderCounts.get(o.user_id) || 0
        userOrderCounts.set(o.user_id, count + 1)
      })
      const repeatUsers = Array.from(userOrderCounts.values()).filter(count => count >= 2).length
      const repeatPurchaseRate = userIds.size > 0 ? (repeatUsers / userIds.size) * 100 : 0

      setStats({
        totalRevenue,
        totalOrders: totalOrdersCount,
        newUsers: usersThisMonth || 0,
        totalProducts: totalProducts || 0,
        revenueChange,
        ordersChange,
        usersChange,
        productsChange: 0, // 상품 변화율은 추적하지 않음
      })

      setQuickStats({
        avgOrderAmount,
        cartConversionRate: 0, // 장바구니 전환율은 별도 추적 필요
        repeatPurchaseRate,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }

    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) {
      return (amount / 100000000).toFixed(1) + '억'
    }
    if (amount >= 10000) {
      return (amount / 10000).toFixed(0) + '만'
    }
    return amount.toLocaleString()
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const statsData = [
    { 
      title: '총 매출', 
      value: `₩${formatCurrency(stats.totalRevenue)}`, 
      change: formatChange(stats.revenueChange), 
      trend: stats.revenueChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'blue'
    },
    { 
      title: '주문 건수', 
      value: stats.totalOrders.toLocaleString(), 
      change: formatChange(stats.ordersChange), 
      trend: stats.ordersChange >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'green'
    },
    { 
      title: '신규 회원', 
      value: stats.newUsers.toLocaleString(), 
      change: formatChange(stats.usersChange), 
      trend: stats.usersChange >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'purple'
    },
    { 
      title: '총 상품', 
      value: stats.totalProducts.toLocaleString(), 
      change: '0%', 
      trend: 'up' as const,
      icon: Package,
      color: 'orange'
    },
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

      {loading ? (
        <div className="text-center py-20 text-gray-500">로딩 중...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-5 mb-6">
            {statsData.map((stat, idx) => {
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
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  전체보기 <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">주문 내역이 없습니다.</div>
                ) : (
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
                      {recentOrders.map((order) => {
                        const productNames = order.order_items?.map(item => item.product_name).join(', ') || '상품 없음'
                        const customerName = order.profiles?.name || order.shipping_name || '고객 정보 없음'
                        return (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <span className="text-sm font-medium text-blue-600">{order.id.slice(0, 8)}...</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-gray-700">{customerName}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-gray-600 truncate block max-w-[200px]" title={productNames}>
                                {productNames}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="text-sm font-medium text-gray-800">₩{order.total_amount.toLocaleString()}</span>
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
                        )
                      })}
                    </tbody>
                  </table>
                )}
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
                {topProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">데이터가 없습니다.</div>
                ) : (
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
                          <p className="text-sm font-medium text-gray-800">₩{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-5 mt-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">평균 주문금액</span>
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-800">₩{formatCurrency(Math.round(quickStats.avgOrderAmount))}</p>
              <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${Math.min((quickStats.avgOrderAmount / 1000000) * 10, 100)}%` }} 
                />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">재구매율</span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-800">{quickStats.repeatPurchaseRate.toFixed(1)}%</p>
              <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full" 
                  style={{ width: `${Math.min(quickStats.repeatPurchaseRate, 100)}%` }} 
                />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">총 상품 수</span>
                <Package className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-800">{stats.totalProducts.toLocaleString()}개</p>
              <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min((stats.totalProducts / 100) * 10, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage

