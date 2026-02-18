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
  MoreHorizontal,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Target,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

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

interface ChartData {
  date: string
  revenue: number
  orders: number
  visitors: number
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month')
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newUsers: 0,
    totalProducts: 0,
    todayVisitors: 0,
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
    productsChange: 0,
    visitorsChange: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [orderStatusData, setOrderStatusData] = useState<{ name: string; value: number; color: string }[]>([])
  const [quickStats, setQuickStats] = useState({
    avgOrderAmount: 0,
    cartConversionRate: 0,
    repeatPurchaseRate: 0,
    todayVisitors: 0,
    pendingOrders: 0,
    completedOrders: 0,
    avgProcessingTime: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [dateRange])

  const fetchDashboardData = async () => {
    setLoading(true)
    
    try {
      const now = new Date()
      let periodStart: Date
      
      switch (dateRange) {
        case 'week':
          periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'quarter':
          periodStart = new Date(now.getFullYear(), now.getMonth() - 3, 1)
          break
        case 'year':
          periodStart = new Date(now.getFullYear(), 0, 1)
          break
        default:
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      }

      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      // 주문 데이터
      const { data: ordersThisMonth } = await supabase
        .from('orders')
        .select('*, order_items(*), profiles(name, email)')
        .neq('status', 'cancelled')
        .gte('created_at', thisMonthStart.toISOString())

      const { data: ordersLastMonth } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'cancelled')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())

      const { data: allOrders } = await supabase
        .from('orders')
        .select('*, order_items(*), profiles(name, email)')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
        .limit(10)

      const { data: periodOrders } = await supabase
        .from('orders')
        .select('*, order_items(*), profiles(name, email)')
        .neq('status', 'cancelled')
        .gte('created_at', periodStart.toISOString())

      // 회원 수
      const { count: usersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart.toISOString())

      const { count: usersLastMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())

      // 상품 수
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // 방문자 통계
      const { data: visitorStats } = await supabase
        .from('visitor_stats')
        .select('*')
        .gte('visit_date', periodStart.toISOString().split('T')[0])
        .order('visit_date', { ascending: true })

      // 계산
      const revenueThisMonth = ordersThisMonth?.reduce((sum, o) => sum + o.total_amount, 0) || 0
      const ordersCountThisMonth = ordersThisMonth?.length || 0
      const revenueLastMonth = ordersLastMonth?.reduce((sum, o) => sum + o.total_amount, 0) || 0
      const ordersCountLastMonth = ordersLastMonth?.length || 0

      const revenueChange = revenueLastMonth > 0 
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
        : (revenueThisMonth > 0 ? 100 : 0)
      const ordersChange = ordersCountLastMonth > 0
        ? ((ordersCountThisMonth - ordersCountLastMonth) / ordersCountLastMonth) * 100
        : (ordersCountThisMonth > 0 ? 100 : 0)
      const usersChange = (usersLastMonth || 0) > 0
        ? (((usersThisMonth || 0) - (usersLastMonth || 0)) / (usersLastMonth || 0)) * 100
        : ((usersThisMonth || 0) > 0 ? 100 : 0)

      const totalRevenue = periodOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0
      const totalOrdersCount = periodOrders?.length || 0

      // 차트 데이터 생성
      const daysDiff = Math.ceil((now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))
      const chartDataArray: ChartData[] = []
      
      for (let i = daysDiff; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dateStr = date.toISOString().split('T')[0]
        const dayOrders = periodOrders?.filter(o => 
          o.created_at.startsWith(dateStr)
        ) || []
        
        const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total_amount, 0)
        const dayVisitors = visitorStats?.find(v => v.visit_date === dateStr)?.visitor_count || 0
        
        chartDataArray.push({
          date: dateStr.slice(5),
          revenue: dayRevenue,
          orders: dayOrders.length,
          visitors: dayVisitors
        })
      }
      setChartData(chartDataArray)

      // 주문 상태별 통계
      const statusCounts = new Map<string, number>()
      periodOrders?.forEach(order => {
        const count = statusCounts.get(order.status) || 0
        statusCounts.set(order.status, count + 1)
      })

      const statusColors: Record<string, string> = {
        pending: '#F59E0B',
        paid: '#3B82F6',
        shipping: '#8B5CF6',
        delivered: '#10B981',
        cancelled: '#EF4444'
      }

      const statusLabels: Record<string, string> = {
        pending: '결제대기',
        paid: '결제완료',
        shipping: '배송중',
        delivered: '배송완료',
        cancelled: '취소'
      }

      setOrderStatusData(
        Array.from(statusCounts.entries()).map(([status, value]) => ({
          name: statusLabels[status] || status,
          value,
          color: statusColors[status] || '#6B7280'
        }))
      )

      // 인기 상품
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
          .slice(0, 10)

        setTopProducts(sorted)
      }

      // Quick Stats
      const avgOrderAmount = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0
      const userIds = new Set(periodOrders?.map(o => o.user_id) || [])
      const userOrderCounts = new Map<string, number>()
      periodOrders?.forEach(o => {
        const count = userOrderCounts.get(o.user_id) || 0
        userOrderCounts.set(o.user_id, count + 1)
      })
      const repeatUsers = Array.from(userOrderCounts.values()).filter(count => count >= 2).length
      const repeatPurchaseRate = userIds.size > 0 ? (repeatUsers / userIds.size) * 100 : 0

      const todayDate = now.toISOString().split('T')[0]
      const { data: todayVisitorStats } = await supabase
        .from('visitor_stats')
        .select('visitor_count')
        .eq('visit_date', todayDate)
        .single()

      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayDate = yesterday.toISOString().split('T')[0]
      const { data: yesterdayVisitorStats } = await supabase
        .from('visitor_stats')
        .select('visitor_count')
        .eq('visit_date', yesterdayDate)
        .single()

      const todayVisitors = todayVisitorStats?.visitor_count || 0
      const yesterdayVisitors = yesterdayVisitorStats?.visitor_count || 0
      const visitorsChange = yesterdayVisitors > 0
        ? ((todayVisitors - yesterdayVisitors) / yesterdayVisitors) * 100
        : (todayVisitors > 0 ? 100 : 0)

      const pendingOrders = periodOrders?.filter(o => o.status === 'pending').length || 0
      const completedOrders = periodOrders?.filter(o => o.status === 'delivered').length || 0

      setStats({
        totalRevenue,
        totalOrders: totalOrdersCount,
        newUsers: usersThisMonth || 0,
        totalProducts: totalProducts || 0,
        todayVisitors,
        revenueChange,
        ordersChange,
        usersChange,
        productsChange: 0,
        visitorsChange,
      })

      setQuickStats({
        avgOrderAmount,
        cartConversionRate: 0,
        repeatPurchaseRate,
        todayVisitors,
        pendingOrders,
        completedOrders,
        avgProcessingTime: 0,
      })

      setRecentOrders(allOrders || [])
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
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: '주문 건수', 
      value: stats.totalOrders.toLocaleString(), 
      change: formatChange(stats.ordersChange), 
      trend: stats.ordersChange >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'green',
      bgGradient: 'from-green-500 to-green-600'
    },
    { 
      title: '신규 회원', 
      value: stats.newUsers.toLocaleString(), 
      change: formatChange(stats.usersChange), 
      trend: stats.usersChange >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600'
    },
    { 
      title: '오늘 방문자', 
      value: stats.todayVisitors.toLocaleString(), 
      change: formatChange(stats.visitorsChange), 
      trend: stats.visitorsChange >= 0 ? 'up' : 'down',
      icon: Eye,
      color: 'pink',
      bgGradient: 'from-pink-500 to-pink-600'
    },
    { 
      title: '총 상품', 
      value: stats.totalProducts.toLocaleString(), 
      change: '0%', 
      trend: 'up' as const,
      icon: Package,
      color: 'orange',
      bgGradient: 'from-orange-500 to-orange-600'
    },
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      paid: 'bg-blue-100 text-blue-700 border-blue-200',
      shipping: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    }
    const labels = {
      pending: '결제대기',
      paid: '결제완료',
      shipping: '배송중',
      delivered: '배송완료',
      cancelled: '취소',
    }
    const icons = {
      pending: AlertCircle,
      paid: Clock,
      shipping: Activity,
      delivered: CheckCircle2,
      cancelled: XCircle,
    }
    const Icon = icons[status as keyof typeof icons] || AlertCircle
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">실시간 비즈니스 인사이트 및 성과 분석</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  dateRange === range
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range === 'week' ? '주간' : range === 'month' ? '월간' : range === 'quarter' ? '분기' : '연간'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            필터
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            내보내기
          </button>
          <button 
            onClick={() => fetchDashboardData()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statsData.map((stat, idx) => {
              const IconComponent = stat.icon
              return (
                <div 
                  key={idx} 
                  className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} opacity-10 rounded-full -mr-16 -mt-16`} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                        stat.trend === 'up' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.bgGradient} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(Math.abs(stat.trend === 'up' ? stats.revenueChange : stats.revenueChange) * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue & Orders Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">매출 및 주문 추이</h3>
                  <p className="text-sm text-gray-500 mt-1">기간별 매출과 주문 건수 분석</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-xs font-medium text-blue-700">매출</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-xs font-medium text-green-700">주문</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                    name="매출 (원)"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#10B981" 
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    strokeWidth={2}
                    name="주문 건수"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Pie Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">주문 상태</h3>
                <p className="text-sm text-gray-500 mt-1">현재 주문 상태 분포</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {orderStatusData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.value}건</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Stats & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Visitors Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">방문자 추이</h3>
                  <p className="text-sm text-gray-500 mt-1">일별 방문자 수 변화</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#EC4899" 
                    strokeWidth={3}
                    dot={{ fill: '#EC4899', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats Cards */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 opacity-80" />
                  <span className="text-xs font-medium opacity-80">평균 주문금액</span>
                </div>
                <p className="text-2xl font-bold">₩{formatCurrency(Math.round(quickStats.avgOrderAmount))}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 opacity-80" />
                  <span className="text-xs font-medium opacity-80">재구매율</span>
                </div>
                <p className="text-2xl font-bold">{quickStats.repeatPurchaseRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-5 h-5 opacity-80" />
                  <span className="text-xs font-medium opacity-80">대기 주문</span>
                </div>
                <p className="text-2xl font-bold">{quickStats.pendingOrders}건</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-5 h-5 opacity-80" />
                  <span className="text-xs font-medium opacity-80">완료 주문</span>
                </div>
                <p className="text-2xl font-bold">{quickStats.completedOrders}건</p>
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">최근 주문</h2>
                  <p className="text-sm text-gray-500 mt-0.5">최근 10건의 주문 내역</p>
                </div>
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">주문번호</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">고객</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">상품</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">금액</th>
                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">상태</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map((order) => {
                        const productNames = order.order_items?.map(item => item.product_name).join(', ') || '상품 없음'
                        const customerName = order.profiles?.name || order.shipping_name || '고객 정보 없음'
                        return (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-blue-600 font-mono">{order.id.slice(0, 8)}...</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">{customerName}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600 truncate block max-w-[200px]" title={productNames}>
                                {productNames}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-semibold text-gray-900">₩{order.total_amount.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4">
                              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
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
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">인기 상품 TOP 10</h2>
                  <p className="text-sm text-gray-500 mt-0.5">매출 기준 상위 상품</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="p-6">
                {topProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">데이터가 없습니다.</div>
                ) : (
                  <div className="space-y-4">
                    {topProducts.map((product, idx) => (
                      <div key={product.rank} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm ${
                          idx < 3 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">{product.sales}개 판매</p>
                            <span className="text-xs text-gray-300">•</span>
                            <p className="text-xs font-medium text-gray-700">₩{formatCurrency(product.revenue)}</p>
                          </div>
                        </div>
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            style={{ width: `${(product.revenue / (topProducts[0]?.revenue || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage
