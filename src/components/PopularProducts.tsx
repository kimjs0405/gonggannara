const PopularProducts = () => {
  const products = [
    {
      id: 1,
      name: '모던 패브릭 3인 소파',
      price: 450000,
      originalPrice: 580000,
      discount: 22,
      image: '🛋️',
      badge: 'BEST',
    },
    {
      id: 2,
      name: '북유럽 스타일 펜던트 조명',
      price: 89000,
      originalPrice: 120000,
      discount: 26,
      image: '💡',
      badge: 'HOT',
    },
    {
      id: 3,
      name: '원목 6단 서랍장',
      price: 320000,
      originalPrice: 400000,
      discount: 20,
      image: '🗄️',
      badge: 'NEW',
    },
    {
      id: 4,
      name: '프리미엄 암막 커튼 세트',
      price: 78000,
      originalPrice: 98000,
      discount: 20,
      image: '🪟',
    },
    {
      id: 5,
      name: '모던 라운지 체어',
      price: 189000,
      originalPrice: 250000,
      discount: 24,
      image: '🪑',
    },
    {
      id: 6,
      name: '북유럽 러그 카펫',
      price: 65000,
      originalPrice: 85000,
      discount: 24,
      image: '🧶',
    },
  ]

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-800">인기 인테리어 상품</h2>
            <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">VIP 전용</span>
          </div>
          <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            전체보기 &gt;
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-6 gap-4">
          {products.map((product) => (
            <a
              key={product.id}
              href="#"
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Product Image */}
              <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>
                {product.badge && (
                  <span className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold text-white rounded ${
                    product.badge === 'BEST' ? 'bg-red-500' :
                    product.badge === 'HOT' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>
              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm text-gray-700 font-medium line-clamp-2 h-10 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">{product.discount}%</span>
                  <span className="text-lg font-black text-gray-900">
                    {product.price.toLocaleString()}원
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()}원
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PopularProducts

