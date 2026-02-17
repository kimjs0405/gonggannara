import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'

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
      {/* 쇼핑몰 라우트 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
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
