import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailPage from './pages/PaymentFailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import EstimatePage from './pages/EstimatePage'
import PortfolioPage from './pages/PortfolioPage'
import ReviewsPage from './pages/ReviewsPage'
import AboutPage from './pages/AboutPage'

// Admin
import AdminLayout from './components/admin/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import AdminProductsPage from './pages/admin/ProductsPage'
import AdminOrdersPage from './pages/admin/OrdersPage'
import AdminUsersPage from './pages/admin/UsersPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'
import PromotionsPage from './pages/admin/PromotionsPage'
import BannersPage from './pages/admin/BannersPage'
import AdminReviewsPage from './pages/admin/ReviewsPage'
import SettingsPage from './pages/admin/SettingsPage'

function App() {
  return (
    <Routes>
      {/* 메인 사이트 라우트 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* 쇼핑몰 */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/fail" element={<PaymentFailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="mypage" element={<MyPage />} />
        {/* 인테리어 */}
        <Route path="estimate" element={<EstimatePage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="portfolio/:id" element={<PortfolioPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services/:category" element={<PortfolioPage />} />
        <Route path="faq" element={<AboutPage />} />
        <Route path="location" element={<AboutPage />} />
      </Route>

      {/* 관리자 로그인 (레이아웃 없음) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 관리자 라우트 */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
