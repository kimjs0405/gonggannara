import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: '모던 패브릭 3인 소파', price: 450000, quantity: 1, image: '🛋️' },
    { id: 2, name: '북유럽 스타일 펜던트 조명', price: 89000, quantity: 2, image: '💡' },
    { id: 3, name: '프리미엄 암막 커튼 세트', price: 78000, quantity: 1, image: '🪟' },
  ])

  const [selectedItems, setSelectedItems] = useState<number[]>(cartItems.map(item => item.id))

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

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id))
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 50000 ? 0 : 3000
  const total = subtotal + shipping

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">장바구니</h1>

        <div className="flex gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">
                  전체선택 ({selectedItems.length}/{cartItems.length})
                </span>
              </div>

              {/* Items */}
              {cartItems.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
                  <Link
                    to="/products"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    쇼핑 계속하기
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-5xl">{item.image}</span>
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/products/${item.id}`}
                          className="font-medium text-gray-800 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {item.price.toLocaleString()}원
                        </p>
                      </div>
                      <div className="flex items-center border rounded-lg">
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
                      <p className="w-32 text-right font-bold text-gray-900">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">주문 요약</h3>
              
              <div className="space-y-3 mb-6">
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
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    {(50000 - subtotal).toLocaleString()}원 더 구매하면 무료배송!
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">총 결제금액</span>
                  <span className="text-2xl font-black text-blue-600">{total.toLocaleString()}원</span>
                </div>
              </div>

              <button
                disabled={selectedItems.length === 0}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                주문하기 ({selectedItems.length}개)
              </button>

              <Link
                to="/products"
                className="block text-center text-sm text-gray-500 hover:text-blue-600 mt-4"
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

