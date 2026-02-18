import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Grid, List, ChevronDown, Search, X, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Product {
  id: string
  name: string
  price: number
  original_price: number
  discount: number
  image_url: string
  badge?: string
  category_id: string
  is_active: boolean
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  // 필터 상태
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceRanges, setPriceRanges] = useState<string[]>([])
  const [discountFilter, setDiscountFilter] = useState<string>('')
  const [badgeFilter, setBadgeFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'newest' | 'discount'>('popular')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // 가격대 옵션
  const priceRangeOptions = [
    { label: '~5만원', min: 0, max: 50000 },
    { label: '5만원~10만원', min: 50000, max: 100000 },
    { label: '10만원~30만원', min: 100000, max: 300000 },
    { label: '30만원~50만원', min: 300000, max: 500000 },
    { label: '50만원 이상', min: 500000, max: Infinity },
  ]

  // 할인율 옵션
  const discountOptions = [
    { label: '10% 이상', value: '10' },
    { label: '20% 이상', value: '20' },
    { label: '30% 이상', value: '30' },
    { label: '40% 이상', value: '40' },
  ]

  // 배지 옵션
  const badgeOptions = [
    { label: 'BEST', value: 'BEST' },
    { label: 'HOT', value: 'HOT' },
    { label: 'NEW', value: 'NEW' },
  ]

  // 정렬 옵션
  const sortOptions = [
    { label: '인기순', value: 'popular' },
    { label: '가격 낮은순', value: 'price-low' },
    { label: '가격 높은순', value: 'price-high' },
    { label: '최신순', value: 'newest' },
    { label: '할인율순', value: 'discount' },
  ]

  // 상품 및 카테고리 데이터 가져오기
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // URL 파라미터 변경 감지
  useEffect(() => {
    const category = searchParams.get('category') || ''
    setSelectedCategory(category)
  }, [searchParams])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // 필터링된 상품
  const filteredProducts = products.filter((product) => {
    // 검색어 필터
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // 카테고리 필터
    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory)
      if (category && product.category_id !== category.id) {
        return false
      }
    }

    // 가격대 필터
    if (priceRanges.length > 0) {
      const matchesPriceRange = priceRanges.some(range => {
        const option = priceRangeOptions.find(opt => opt.label === range)
        if (!option) return false
        const finalPrice = product.price
        return finalPrice >= option.min && finalPrice <= option.max
      })
      if (!matchesPriceRange) return false
    }

    // 할인율 필터
    if (discountFilter && product.discount < parseInt(discountFilter)) {
      return false
    }

    // 배지 필터
    if (badgeFilter && product.badge !== badgeFilter) {
      return false
    }

    return true
  })

  // 정렬된 상품
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'discount':
        return (b.discount || 0) - (a.discount || 0)
      case 'popular':
      default:
        // 인기순은 할인율과 최신순을 조합
        const aScore = (a.discount || 0) * 0.5 + (new Date(a.created_at).getTime() / 1000000) * 0.5
        const bScore = (b.discount || 0) * 0.5 + (new Date(b.created_at).getTime() / 1000000) * 0.5
        return bScore - aScore
    }
  })

  // 가격대 필터 토글
  const togglePriceRange = (range: string) => {
    setPriceRanges(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    )
  }

  // 필터 초기화
  const resetFilters = () => {
    setSearchQuery('')
    setPriceRanges([])
    setDiscountFilter('')
    setBadgeFilter('')
    setSelectedCategory('')
    setSearchParams({})
  }

  // 카테고리 변경
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    if (categorySlug) {
      setSearchParams({ category: categorySlug })
    } else {
      setSearchParams({})
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || '기타'
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb - Hidden on mobile */}
        <div className="hidden md:block text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">홈</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">전체 상품</span>
        </div>

        {/* 검색 바 */}
        <div className="mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="상품명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Category Filter */}
        <div className="md:hidden mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                showMobileFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              <Filter className="w-4 h-4" />
              필터
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {showMobileFilters && (
          <div className="md:hidden mb-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">필터</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 가격대 */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">가격대</h4>
              <div className="space-y-2">
                {priceRangeOptions.map((option) => (
                  <label key={option.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priceRanges.includes(option.label)}
                      onChange={() => togglePriceRange(option.label)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 할인율 */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">할인율</h4>
              <div className="space-y-2">
                {discountOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="discount"
                      checked={discountFilter === option.value}
                      onChange={() => setDiscountFilter(discountFilter === option.value ? '' : option.value)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 배지 */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">특가 배지</h4>
              <div className="flex gap-2">
                {badgeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setBadgeFilter(badgeFilter === option.value ? '' : option.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      badgeFilter === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* Desktop: 필터와 상세 필터 조건을 같은 행에 배치 */}
        <div className="hidden md:flex gap-6 mb-4 md:mb-6">
          {/* Sidebar Filters - Desktop only */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">필터</h3>
                {(priceRanges.length > 0 || discountFilter || badgeFilter) && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    초기화
                  </button>
                )}
              </div>

              {/* 카테고리 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">카테고리</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    전체
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 가격대 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">가격대</h4>
                <div className="space-y-2">
                  {priceRangeOptions.map((option) => (
                    <label key={option.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={priceRanges.includes(option.label)}
                        onChange={() => togglePriceRange(option.label)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 할인율 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">할인율</h4>
                <div className="space-y-2">
                  {discountOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discount"
                        checked={discountFilter === option.value}
                        onChange={() => setDiscountFilter(discountFilter === option.value ? '' : option.value)}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 배지 */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">특가 배지</h4>
                <div className="flex flex-wrap gap-2">
                  {badgeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBadgeFilter(badgeFilter === option.value ? '' : option.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        badgeFilter === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 상세 필터 조건 - 오른쪽 */}
          <div className="flex-1 bg-white rounded-lg p-2 md:p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-1.5 md:mb-2">
              <div className="flex items-center gap-1 md:gap-1.5">
                <Filter className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-600" />
                <h3 className="text-[10px] md:text-xs font-semibold text-gray-800">상세 필터 조건</h3>
              </div>
              {(selectedCategory || priceRanges.length > 0 || discountFilter || badgeFilter || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-[9px] md:text-[10px] text-blue-600 hover:text-blue-700 font-medium"
                >
                  전체 초기화
                </button>
              )}
            </div>

            {/* 선택된 필터 표시 */}
            <div className="flex flex-wrap gap-1 md:gap-1.5">
              {/* 카테고리 필터 */}
              {selectedCategory && (
                <div className="flex items-center gap-0.5 px-1.5 md:px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[9px] md:text-[10px]">
                  <span className="text-blue-700 font-medium">
                    {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  </span>
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-2 h-2 md:w-2.5 md:h-2.5" />
                  </button>
                </div>
              )}

              {/* 가격대 필터 */}
              {priceRanges.map((range) => (
                <div
                  key={range}
                  className="flex items-center gap-0.5 px-1.5 md:px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-[9px] md:text-[10px]"
                >
                  <span className="text-green-700 font-medium">{range}</span>
                  <button
                    onClick={() => togglePriceRange(range)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-2 h-2 md:w-2.5 md:h-2.5" />
                  </button>
                </div>
              ))}

              {/* 할인율 필터 */}
              {discountFilter && (
                <div className="flex items-center gap-0.5 px-1.5 md:px-2 py-0.5 bg-orange-50 border border-orange-200 rounded-full text-[9px] md:text-[10px]">
                  <span className="text-orange-700 font-medium">
                    {discountOptions.find(opt => opt.value === discountFilter)?.label}
                  </span>
                  <button
                    onClick={() => setDiscountFilter('')}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-2 h-2 md:w-2.5 md:h-2.5" />
                  </button>
                </div>
              )}

              {/* 배지 필터 */}
              {badgeFilter && (
                <div className="flex items-center gap-0.5 px-1.5 md:px-2 py-0.5 bg-purple-50 border border-purple-200 rounded-full text-[9px] md:text-[10px]">
                  <span className="text-purple-700 font-medium">{badgeFilter}</span>
                  <button
                    onClick={() => setBadgeFilter('')}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-2 h-2 md:w-2.5 md:h-2.5" />
                  </button>
                </div>
              )}

              {/* 검색어 필터 */}
              {searchQuery && (
                <div className="flex items-center gap-0.5 px-1.5 md:px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-[9px] md:text-[10px]">
                  <span className="text-gray-700 font-medium">"{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-2 h-2 md:w-2.5 md:h-2.5" />
                  </button>
                </div>
              )}

              {/* 필터가 없을 때 */}
              {!selectedCategory && priceRanges.length === 0 && !discountFilter && !badgeFilter && !searchQuery && (
                <p className="text-[9px] md:text-[10px] text-gray-400">필터 조건을 선택해주세요</p>
              )}
            </div>

            {/* 빠른 필터 버튼 */}
            <div className="mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-gray-200">
              <div className="flex flex-wrap gap-1 md:gap-1.5">
                <span className="text-[9px] md:text-[10px] text-gray-500 self-center">빠른 필터:</span>
                
                {/* 할인율 빠른 필터 */}
                {discountOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDiscountFilter(discountFilter === option.value ? '' : option.value)}
                    className={`px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium transition-colors ${
                      discountFilter === option.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

                {/* 배지 빠른 필터 */}
                {badgeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setBadgeFilter(badgeFilter === option.value ? '' : option.value)}
                    className={`px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium transition-colors ${
                      badgeFilter === option.value
                        ? option.value === 'BEST' ? 'bg-red-500 text-white' :
                          option.value === 'HOT' ? 'bg-orange-500 text-white' :
                          'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

                {/* 가격대 빠른 필터 (인기 있는 것만) */}
                {['~5만원', '10만원~30만원', '50만원 이상'].map((range) => (
                  <button
                    key={range}
                    onClick={() => togglePriceRange(range)}
                    className={`px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium transition-colors ${
                      priceRanges.includes(range)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="w-full">
            {/* Sort & View Options */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs md:text-sm text-gray-500">
                총 <span className="font-bold text-blue-600">{sortedProducts.length}</span>개의 상품
              </p>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border rounded-lg text-xs md:text-sm text-gray-600 hover:border-blue-500 transition-colors"
                  >
                    {sortOptions.find(opt => opt.value === sortBy)?.label || '인기순'}
                    <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showSortMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[140px]">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as typeof sortBy)
                            setShowSortMenu(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="bg-white rounded-lg md:rounded-xl p-10 md:p-16 text-center">
                <p className="text-gray-400 text-sm md:text-lg">로딩 중...</p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className={`grid gap-3 md:gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className={`bg-white rounded-lg md:rounded-xl overflow-hidden hover:shadow-lg transition-shadow group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ${
                      viewMode === 'list' ? 'w-28 md:w-40 h-28 md:h-40 flex-shrink-0' : 'h-32 md:h-48'
                    }`}>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className={`group-hover:scale-110 transition-transform ${
                          viewMode === 'list' ? 'text-4xl md:text-5xl' : 'text-5xl md:text-7xl'
                        }`}>
                          📦
                        </span>
                      )}
                      {product.badge && (
                        <span className={`absolute top-2 left-2 px-1.5 md:px-2 py-0.5 md:py-1 text-[8px] md:text-[10px] font-bold text-white rounded ${
                          product.badge === 'BEST' ? 'bg-red-500' :
                          product.badge === 'HOT' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {product.badge}
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="absolute top-2 right-2 px-1.5 md:px-2 py-0.5 md:py-1 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded">
                          {product.discount}%
                        </span>
                      )}
                    </div>
                    <div className={`p-3 md:p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <p className="text-[10px] md:text-xs text-gray-400 mb-1">{getCategoryName(product.category_id)}</p>
                      <h3 className="text-xs md:text-sm text-gray-700 font-medium mb-1 md:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        {product.discount > 0 && (
                          <span className="text-red-500 text-xs md:text-base font-bold">{product.discount}%</span>
                        )}
                        <span className="text-sm md:text-lg font-black text-gray-900">
                          {product.price.toLocaleString()}원
                        </span>
                        {product.original_price > product.price && (
                          <span className="text-[10px] md:text-xs text-gray-400 line-through">
                            {product.original_price.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg md:rounded-xl p-10 md:p-16 text-center">
                <p className="text-gray-400 text-sm md:text-lg mb-1 md:mb-2">검색 결과가 없습니다</p>
                <p className="text-xs md:text-sm text-gray-400">다른 조건으로 검색해보세요</p>
                {(priceRanges.length > 0 || discountFilter || badgeFilter || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    필터 초기화
                  </button>
                )}
              </div>
            )}
        </div>

        {/* Sort menu backdrop */}
        {showSortMenu && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowSortMenu(false)}
          />
        )}
      </div>
    </div>
  )
}

export default ProductsPage
