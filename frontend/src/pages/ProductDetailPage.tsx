import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Heart, Share2, Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('detail')
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('상품 ID가 없습니다.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) {
          console.error('Error fetching product:', fetchError)
          setError('상품을 찾을 수 없습니다.')
          setLoading(false)
          return
        }

        if (!data) {
          setError('상품을 찾을 수 없습니다.')
          setLoading(false)
          return
        }

        setProduct(data)
      } catch (err: any) {
        console.error('Error:', err)
        setError('상품을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center py-20">
            <p className="text-gray-500">상품 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center py-20">
            <p className="text-red-500 mb-4">{error || '상품을 찾을 수 없습니다.'}</p>
            <Link to="/products" className="text-blue-600 hover:underline">
              상품 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const finalPrice = product.original_price && product.original_price > product.price 
    ? product.price 
    : product.price
  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : (product.discount || 0)
  const features = product.features && Array.isArray(product.features) 
    ? product.features.filter((f: any) => typeof f === 'string' && !f.startsWith('{'))
    : []

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
          <div className="flex flex-col md:flex-row gap-10">
            {/* Product Image */}
            <div className="w-full md:w-[500px] flex-shrink-0">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-[400px] md:h-[500px] flex items-center justify-center relative overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<span class="text-[200px]">📦</span>'
                      }
                    }}
                  />
                ) : (
                  <span className="text-[200px]">📦</span>
                )}
                {product.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-bold text-white rounded-lg ${
                    product.badge === 'BEST' ? 'bg-red-500' :
                    product.badge === 'HOT' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 text-sm font-bold text-white bg-red-500 rounded-lg">
                    {discountPercent}%
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

              {product.description && (
                <p className="text-gray-600 mb-6">{product.description}</p>
              )}

              {/* Price */}
              <div className="border-t border-b py-6 mb-6">
                <div className="flex items-end gap-3 mb-2">
                  {discountPercent > 0 && (
                    <span className="text-red-500 text-2xl font-bold">{discountPercent}%</span>
                  )}
                  <span className="text-3xl font-black text-gray-900">{finalPrice.toLocaleString()}원</span>
                </div>
                {product.original_price && product.original_price > product.price && (
                  <p className="text-gray-400 line-through text-lg">{product.original_price.toLocaleString()}원</p>
                )}
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">상품 특징</h3>
                  <ul className="space-y-2">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Shipping Info */}
              {product.shipping_info && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-blue-600">배송 정보</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-600">{product.shipping_info}</span>
                  </div>
                </div>
              )}

              {/* Stock Info */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  재고: <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock}개` : '품절'}
                  </span>
                </p>
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
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
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm">
                    총 금액: <span className="text-xl font-black text-blue-600">{(finalPrice * quantity).toLocaleString()}원</span>
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  장바구니
                </button>
                <button 
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
              <div className="py-8">
                {product.image_url ? (
                  <div className="mb-8">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full max-w-2xl mx-auto rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center mb-8">
                    <span className="text-[150px]">📦</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h3>
                {product.description && (
                  <div className="text-gray-600 max-w-2xl mx-auto whitespace-pre-line">
                    {product.description}
                  </div>
                )}
                {features.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-bold text-gray-800 mb-3">상품 특징</h4>
                    <ul className="space-y-2">
                      {features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

