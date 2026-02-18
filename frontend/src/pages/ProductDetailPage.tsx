import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, Share2, Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('detail')

  // 임시 상품 데이터 (실제로는 Supabase에서 가져옴)
  const product = {
    id: Number(id),
    name: '모던 패브릭 3인 소파',
    price: 450000,
    originalPrice: 580000,
    discount: 22,
    image: '🛋️',
    badge: 'BEST',
    description: '편안한 착석감과 고급스러운 디자인이 특징인 3인용 패브릭 소파입니다. 거실 인테리어의 중심이 될 수 있는 제품입니다.',
    features: ['고밀도 우레탄 폼 사용', '내구성 높은 패브릭 원단', '조립 서비스 제공', '30일 무료 반품'],
    shipping: '무료배송',
    deliveryDays: '3-5일 이내 배송',
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">홈</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-blue-600">전체 상품</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex gap-10">
            {/* Product Image */}
            <div className="w-[500px] flex-shrink-0">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-[500px] flex items-center justify-center relative">
                <span className="text-[200px]">{product.image}</span>
                {product.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-bold text-white rounded-lg ${
                    product.badge === 'BEST' ? 'bg-red-500' :
                    product.badge === 'HOT' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Price */}
              <div className="border-t border-b py-6 mb-6">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-red-500 text-2xl font-bold">{product.discount}%</span>
                  <span className="text-3xl font-black text-gray-900">{product.price.toLocaleString()}원</span>
                </div>
                <p className="text-gray-400 line-through text-lg">{product.originalPrice.toLocaleString()}원</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">상품 특징</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium text-blue-600">{product.shipping}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-600">{product.deliveryDays}</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium text-gray-700">수량</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <span className="text-gray-500 text-sm">
                  총 금액: <span className="text-xl font-black text-blue-600">{(product.price * quantity).toLocaleString()}원</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  장바구니
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                  <CreditCard className="w-5 h-5" />
                  바로구매
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex border-b">
            {[
              { id: 'detail', name: '상품상세' },
              { id: 'review', name: '리뷰 (128)' },
              { id: 'qna', name: 'Q&A (23)' },
              { id: 'shipping', name: '배송/교환/반품' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-b-2xl p-8">
            {selectedTab === 'detail' && (
              <div className="text-center py-20">
                <span className="text-[150px]">{product.image}</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{product.name}</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">{product.description}</p>
              </div>
            )}
            {selectedTab === 'review' && (
              <div className="py-10 text-center text-gray-500">
                리뷰 기능은 준비 중입니다.
              </div>
            )}
            {selectedTab === 'qna' && (
              <div className="py-10 text-center text-gray-500">
                Q&A 기능은 준비 중입니다.
              </div>
            )}
            {selectedTab === 'shipping' && (
              <div className="py-10 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">배송 안내</h4>
                  <p className="text-sm text-gray-600">주문 후 3-5일 이내 배송됩니다. (주말/공휴일 제외)</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">교환/반품 안내</h4>
                  <p className="text-sm text-gray-600">상품 수령 후 30일 이내 교환/반품 가능합니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

