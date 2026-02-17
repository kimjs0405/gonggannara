import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Grid, List, ChevronDown } from 'lucide-react'

const ProductsPage = () => {
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const category = searchParams.get('category')

  const products = [
    { id: 1, name: '모던 패브릭 3인 소파', price: 450000, originalPrice: 580000, discount: 22, image: '🛋️', badge: 'BEST', category: 'furniture' },
    { id: 2, name: '북유럽 스타일 펜던트 조명', price: 89000, originalPrice: 120000, discount: 26, image: '💡', badge: 'HOT', category: 'lighting' },
    { id: 3, name: '원목 6단 서랍장', price: 320000, originalPrice: 400000, discount: 20, image: '🗄️', badge: 'NEW', category: 'storage' },
    { id: 4, name: '프리미엄 암막 커튼 세트', price: 78000, originalPrice: 98000, discount: 20, image: '🪟', category: 'curtain' },
    { id: 5, name: '모던 라운지 체어', price: 189000, originalPrice: 250000, discount: 24, image: '🪑', category: 'furniture' },
    { id: 6, name: '북유럽 러그 카펫', price: 65000, originalPrice: 85000, discount: 24, image: '🧶', category: 'deco' },
    { id: 7, name: '스마트 LED 스탠드', price: 45000, originalPrice: 60000, discount: 25, image: '💡', category: 'lighting' },
    { id: 8, name: '미니멀 원목 책상', price: 280000, originalPrice: 350000, discount: 20, image: '🖥️', category: 'furniture' },
    { id: 9, name: '대형 벽걸이 시계', price: 55000, originalPrice: 70000, discount: 21, image: '🕰️', category: 'deco' },
    { id: 10, name: '프리미엄 퀸 매트리스', price: 890000, originalPrice: 1200000, discount: 26, image: '🛏️', badge: 'BEST', category: 'furniture' },
    { id: 11, name: '모던 화이트 TV 선반', price: 180000, originalPrice: 230000, discount: 22, image: '🗄️', category: 'storage' },
    { id: 12, name: '인테리어 화분 세트', price: 35000, originalPrice: 45000, discount: 22, image: '🪴', category: 'deco' },
  ]

  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products

  const categories = [
    { name: '전체', slug: '' },
    { name: '가구', slug: 'furniture' },
    { name: '조명', slug: 'lighting' },
    { name: '커튼', slug: 'curtain' },
    { name: '수납', slug: 'storage' },
    { name: '데코', slug: 'deco' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">홈</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">전체 상품</span>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">카테고리</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={cat.slug ? `/products?category=${cat.slug}` : '/products'}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === cat.slug || (!category && !cat.slug)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
              <h3 className="font-bold text-gray-800 mb-4">가격대</h3>
              <div className="space-y-2 text-sm">
                {['~5만원', '5만원~10만원', '10만원~30만원', '30만원~50만원', '50만원 이상'].map((range) => (
                  <label key={range} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-600">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="flex-1">
            {/* Sort & View Options */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                총 <span className="font-bold text-blue-600">{filteredProducts.length}</span>개의 상품
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-white border rounded-lg text-sm text-gray-600 hover:border-blue-500">
                  인기순 <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-4' : 'grid-cols-1'}`}>
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className={`bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ${
                    viewMode === 'list' ? 'w-40 h-40' : 'h-48'
                  }`}>
                    <span className={`group-hover:scale-110 transition-transform ${viewMode === 'list' ? 'text-5xl' : 'text-7xl'}`}>
                      {product.image}
                    </span>
                    {product.badge && (
                      <span className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold text-white rounded ${
                        product.badge === 'BEST' ? 'bg-red-500' :
                        product.badge === 'HOT' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="text-sm text-gray-700 font-medium mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">{product.discount}%</span>
                      <span className="text-lg font-black text-gray-900">{product.price.toLocaleString()}원</span>
                    </div>
                    <p className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage

