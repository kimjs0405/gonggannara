import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
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

function App() {
  return (
    <Routes>
      {/* 메인 사이트 라우트 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
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
      </Route>
    </Routes>
  )
}

export default App
