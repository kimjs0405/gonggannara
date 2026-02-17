import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }
      setIsLoggedIn(true)
      // 실제로는 Supabase에서 장바구니 데이터를 가져옴
      // 현재는 빈 배열
    }
    checkAuth()
  }, [navigate])

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const handleRemove = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
    setSelectedItems(selected => selected.filter(itemId => itemId !== id))
  }

  const toggleSelect = (id: number) => {
    setSelectedItems(selected =>
      selected.includes(id)
        ? selected.filter(itemId => itemId !== id)
        : [...selected, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map(item => item.id))
    }
  }

  const handleOrder = () => {
    if (selectedItems.length === 0) return
    // 선택한 상품 정보를 결제 페이지로 전달
    const orderItems = cartItems.filter(item => selectedItems.includes(item.id))
    navigate('/checkout', { state: { items: orderItems } })
  }

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id))
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 50000 ? 0 : 3000
  const total = subtotal + shipping

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">장바구니</h1>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-b bg-gray-50">
                <input
                  type="checkbox"
                  checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                  onChange={toggleSelectAll}
                  className="w-4 md:w-5 h-4 md:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={cartItems.length === 0}
                />
                <span className="text-sm md:text-base font-medium text-gray-700">
                  전체선택 ({selectedItems.length}/{cartItems.length})
                </span>
              </div>

              {/* Items */}
              {cartItems.length === 0 ? (
                <div className="py-12 md:py-20 text-center">
                  <p className="text-gray-500 mb-4 text-sm md:text-base">장바구니가 비어있습니다.</p>
                  <Link
                    to="/products"
                    className="inline-block px-5 md:px-6 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    쇼핑 계속하기
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start md:items-center gap-3 md:gap-4 px-4 md:px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 md:w-5 h-4 md:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 md:mt-0"
                      />
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl md:text-5xl">{item.image}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.id}`}
                          className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-600 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-base md:text-lg font-bold text-gray-900 mt-1">
                          {item.price.toLocaleString()}원
                        </p>
                        {/* Mobile: quantity & delete */}
                        <div className="flex items-center gap-3 mt-2 md:hidden">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="p-1.5 hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="p-1.5 hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Desktop: quantity, total, delete */}
                      <div className="hidden md:flex items-center border rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <p className="hidden md:block w-32 text-right font-bold text-gray-900">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="hidden md:block p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 md:sticky md:top-24">
              <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">주문 요약</h3>
              
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">상품금액</span>
                  <span className="text-gray-800">{subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">배송비</span>
                  <span className={shipping === 0 ? 'text-blue-600' : 'text-gray-800'}>
                    {shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}
                  </span>
                </div>
                {shipping > 0 && subtotal > 0 && (
                  <p className="text-xs text-gray-400">
                    {(50000 - subtotal).toLocaleString()}원 더 구매하면 무료배송!
                  </p>
                )}
              </div>

              <div className="border-t pt-3 md:pt-4 mb-4 md:mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm md:text-base">총 결제금액</span>
                  <span className="text-xl md:text-2xl font-black text-blue-600">{total.toLocaleString()}원</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={selectedItems.length === 0}
                className="w-full py-3 md:py-4 bg-blue-600 text-white rounded-lg md:rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                주문하기 ({selectedItems.length}개)
              </button>

              <Link
                to="/products"
                className="block text-center text-xs md:text-sm text-gray-500 hover:text-blue-600 mt-3 md:mt-4"
              >
                쇼핑 계속하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
