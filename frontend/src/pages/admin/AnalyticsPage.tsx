import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface DailyStat {
  date: string
  revenue: number
  orders: number
}

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('month')
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
  })
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number; revenue: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)

    // 주문 데이터 가져오기
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .neq('status', 'cancelled')

    // 회원 수
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // 상품 수
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (orders) {
      const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0)
      const totalOrders = orders.length

      // 일별 통계 계산
      const last30Days = [...Array(30)].map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split('T')[0]
      }).reverse()

      const dailyData = last30Days.map(date => {
        const dayOrders = orders.filter(o => o.created_at.split('T')[0] === date)
        return {
          date,
          revenue: dayOrders.reduce((sum, o) => sum + o.total_amount, 0),
          orders: dayOrders.length,
        }
      })

      setDailyStats(dailyData)
      setStats({
        totalRevenue,
        totalOrders,
        totalUsers: userCount || 0,
        totalProducts: productCount || 0,
        revenueChange: 12.5, // 임시 값
        ordersChange: 8.3, // 임시 값
      })
    }

    // 인기 상품 (주문 상세에서)
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_name, product_price, quantity')

    if (orderItems) {
      const productMap = new Map<string, { sales: number; revenue: number }>()
      orderItems.forEach(item => {
        const existing = productMap.get(item.product_name) || { sales: 0, revenue: 0 }
        productMap.set(item.product_name, {
          sales: existing.sales + item.quantity,
          revenue: existing.revenue + (item.product_price * item.quantity),
        })
      })

      const sorted = Array.from(productMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setTopProducts(sorted)
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

  const maxRevenue = Math.max(...dailyStats.map(d => d.revenue), 1)

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">매출/통계</h1>
          <p className="text-sm text-gray-500 mt-1">쇼핑몰 매출과 주요 지표를 확인하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="week">최근 7일</option>
            <option value="month">최근 30일</option>
            <option value="quarter">최근 3개월</option>
            <option value="year">최근 1년</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">로딩 중...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.revenueChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stats.revenueChange)}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">총 매출</p>
              <p className="text-2xl font-bold text-gray-800">₩{formatCurrency(stats.totalRevenue)}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.ordersChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stats.ordersChange)}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">총 주문</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}건</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">총 회원</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}명</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">총 상품</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}개</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">일별 매출 추이</h3>
            <div className="h-64 flex items-end gap-1">
              {dailyStats.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{ height: `${(day.revenue / maxRevenue) * 200}px`, minHeight: day.revenue > 0 ? '4px' : '0' }}
                    title={`${day.date}: ₩${day.revenue.toLocaleString()}`}
                  />
                  {idx % 5 === 0 && (
                    <span className="text-[10px] text-gray-400 mt-1">{day.date.slice(5)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Products & Order Status */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">인기 상품 TOP 5</h3>
              {topProducts.length === 0 ? (
                <p className="text-center text-gray-400 py-8">데이터가 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-gray-200 text-gray-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.sales}개 판매</p>
                      </div>
                      <span className="text-sm font-bold text-gray-800">₩{formatCurrency(product.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">주요 지표</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">평균 주문 금액</span>
                  <span className="font-bold text-gray-800">
                    ₩{stats.totalOrders > 0 ? formatCurrency(Math.round(stats.totalRevenue / stats.totalOrders)) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">회원당 평균 구매</span>
                  <span className="font-bold text-gray-800">
                    ₩{stats.totalUsers > 0 ? formatCurrency(Math.round(stats.totalRevenue / stats.totalUsers)) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">상품당 평균 매출</span>
                  <span className="font-bold text-gray-800">
                    ₩{stats.totalProducts > 0 ? formatCurrency(Math.round(stats.totalRevenue / stats.totalProducts)) : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AnalyticsPage

