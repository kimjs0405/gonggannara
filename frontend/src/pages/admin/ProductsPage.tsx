import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  Package,
  X,
  Save
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price: number
  discount: number
  category_id: string
  image_url: string
  badge: string
  stock: number
  is_active: boolean
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    detailed_description: '',
    price: 0,
    original_price: 0,
    discount: 0,
    category_id: '',
    image_url: '',
    images: [] as string[],
    badge: '',
    stock: 0,
    min_stock: 0,
    is_active: true,
    product_code: '',
    barcode: '',
    manufacturer: '',
    origin: '',
    shipping_fee: 0,
    shipping_info: '',
    features: [] as string[],
    keywords: '',
    meta_title: '',
    meta_description: '',
    sale_start_date: '',
    sale_end_date: '',
    weight: 0,
    dimensions: '',
    warranty: '',
  })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newFeature, setNewFeature] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [categoryFilter, statusFilter])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })

    if (categoryFilter) {
      query = query.eq('category_id', categoryFilter)
    }
    if (statusFilter === 'active') {
      query = query.eq('is_active', true)
    } else if (statusFilter === 'inactive') {
      query = query.eq('is_active', false)
    } else if (statusFilter === 'out_of_stock') {
      query = query.eq('stock', 0)
    } else if (statusFilter === 'low_stock') {
      query = query.lt('stock', 10).gt('stock', 0)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order')
    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
  }

  const handleSave = async () => {
    // 필수 필드 검증
    if (!formData.name || !formData.price) {
      alert('상품명과 판매가는 필수 입력 항목입니다.')
      return
    }

    // slug 자동 생성 (입력하지 않은 경우)
    let slug = formData.slug
    if (!slug && formData.name) {
      slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    }

    const productData: any = {
      name: formData.name,
      slug,
      description: formData.description || null,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : null,
      discount: formData.discount ? Number(formData.discount) : 0,
      category_id: formData.category_id || null,
      image_url: formData.image_url || null,
      images: formData.images.length > 0 ? formData.images : null,
      badge: formData.badge || null,
      stock: formData.stock ? Number(formData.stock) : 0,
      is_active: formData.is_active,
      features: formData.features.length > 0 ? formData.features : null,
      shipping_info: formData.shipping_info || null,
    }

    // 추가 필드들은 JSON 필드나 별도 테이블에 저장하거나, description에 포함시킬 수 있습니다
    // 여기서는 간단하게 JSON 형태로 저장하거나 description에 포함시키겠습니다
    const additionalInfo: any = {}
    if (formData.product_code) additionalInfo.product_code = formData.product_code
    if (formData.barcode) additionalInfo.barcode = formData.barcode
    if (formData.manufacturer) additionalInfo.manufacturer = formData.manufacturer
    if (formData.origin) additionalInfo.origin = formData.origin
    if (formData.shipping_fee) additionalInfo.shipping_fee = formData.shipping_fee
    if (formData.keywords) additionalInfo.keywords = formData.keywords
    if (formData.meta_title) additionalInfo.meta_title = formData.meta_title
    if (formData.meta_description) additionalInfo.meta_description = formData.meta_description
    if (formData.sale_start_date) additionalInfo.sale_start_date = formData.sale_start_date
    if (formData.sale_end_date) additionalInfo.sale_end_date = formData.sale_end_date
    if (formData.weight) additionalInfo.weight = formData.weight
    if (formData.dimensions) additionalInfo.dimensions = formData.dimensions
    if (formData.warranty) additionalInfo.warranty = formData.warranty
    if (formData.detailed_description) additionalInfo.detailed_description = formData.detailed_description

    // 추가 정보를 description에 JSON으로 포함시키거나 별도 필드에 저장
    // 여기서는 features 필드에 추가 정보를 포함시키는 방식으로 처리
    if (Object.keys(additionalInfo).length > 0) {
      productData.features = formData.features.length > 0 
        ? [...formData.features, JSON.stringify(additionalInfo)]
        : [JSON.stringify(additionalInfo)]
    }

    if (editingProduct) {
      // 수정
      const { error } = await supabase
        .from('products')
        .update({
          ...productData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProduct.id)

      if (error) {
        alert('수정 실패: ' + error.message)
      } else {
        alert('상품이 수정되었습니다.')
        setShowModal(false)
        fetchProducts()
      }
    } else {
      // 새 상품 등록
      const { error } = await supabase.from('products').insert([productData])

      if (error) {
        alert('등록 실패: ' + error.message)
      } else {
        alert('상품이 등록되었습니다.')
        setShowModal(false)
        fetchProducts()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      alert('삭제 실패: ' + error.message)
    } else {
      fetchProducts()
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`선택한 ${selectedProducts.length}개 상품을 삭제하시겠습니까?`)) return

    const { error } = await supabase.from('products').delete().in('id', selectedProducts)

    if (error) {
      alert('삭제 실패: ' + error.message)
    } else {
      setSelectedProducts([])
      fetchProducts()
    }
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      detailed_description: '',
      price: 0,
      original_price: 0,
      discount: 0,
      category_id: '',
      image_url: '',
      images: [],
      badge: '',
      stock: 0,
      min_stock: 0,
      is_active: true,
      product_code: '',
      barcode: '',
      manufacturer: '',
      origin: '',
      shipping_fee: 0,
      shipping_info: '',
      features: [],
      keywords: '',
      meta_title: '',
      meta_description: '',
      sale_start_date: '',
      sale_end_date: '',
      weight: 0,
      dimensions: '',
      warranty: '',
    })
    setNewImageUrl('')
    setNewFeature('')
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      detailed_description: '',
      price: product.price,
      original_price: product.original_price || 0,
      discount: product.discount || 0,
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      images: [],
      badge: product.badge || '',
      stock: product.stock,
      min_stock: 0,
      is_active: product.is_active,
      product_code: '',
      barcode: '',
      manufacturer: '',
      origin: '',
      shipping_fee: 0,
      shipping_info: '',
      features: [],
      keywords: '',
      meta_title: '',
      meta_description: '',
      sale_start_date: '',
      sale_end_date: '',
      weight: 0,
      dimensions: '',
      warranty: '',
    })
    setNewImageUrl('')
    setNewFeature('')
    setShowModal(true)
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || '-'
  }

  const getStatusBadge = (product: Product) => {
    if (!product.is_active) {
      return <span className="px-2 py-1 rounded text-[11px] font-medium bg-gray-100 text-gray-600">판매중지</span>
    }
    if (product.stock === 0) {
      return <span className="px-2 py-1 rounded text-[11px] font-medium bg-red-100 text-red-700">품절</span>
    }
    if (product.stock < 10) {
      return <span className="px-2 py-1 rounded text-[11px] font-medium bg-yellow-100 text-yellow-700">재고부족</span>
    }
    return <span className="px-2 py-1 rounded text-[11px] font-medium bg-green-100 text-green-700">판매중</span>
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">상품 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {products.length}개의 상품</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            상품 등록
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품명, 상품코드 검색"
              className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="">전체 카테고리</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="">상태 전체</option>
            <option value="active">판매중</option>
            <option value="inactive">판매중지</option>
            <option value="low_stock">재고부족</option>
            <option value="out_of_stock">품절</option>
          </select>

          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            새로고침
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedProducts.length}개 상품 선택됨
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              일괄 삭제
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">등록된 상품이 없습니다.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상품정보</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">판매가</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">재고</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="w-24 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">{getCategoryName(product.category_id)}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-medium text-gray-800">₩{product.price.toLocaleString()}</span>
                    {product.discount > 0 && (
                      <span className="text-xs text-red-500 ml-1">-{product.discount}%</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-sm font-medium ${
                      product.stock === 0 ? 'text-red-600' : 
                      product.stock < 10 ? 'text-yellow-600' : 'text-gray-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {getStatusBadge(product)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="수정"
                      >
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            {/* Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingProduct ? '상품 정보 수정' : '신규 상품 등록'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white hover:bg-blue-700 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form Content */}
            <div className="p-6 bg-gray-50">
              {/* 기본 정보 */}
              <div className="bg-white border border-gray-300 mb-4">
                <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-700">기본 정보</h3>
                </div>
                <div className="p-4 space-y-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 w-32 border-r border-gray-200">상품명 <span className="text-red-500">*</span></td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                              const name = e.target.value
                              if (!editingProduct && (!formData.slug || formData.slug === '')) {
                                const autoSlug = name
                                  .toLowerCase()
                                  .replace(/[^a-z0-9가-힣]/g, '-')
                                  .replace(/-+/g, '-')
                                  .replace(/^-|-$/g, '')
                                setFormData({ ...formData, name, slug: autoSlug })
                              } else {
                                setFormData({ ...formData, name })
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">상품코드</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.product_code}
                            onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                            placeholder="PRD-00001"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">슬러그 <span className="text-red-500">*</span></td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="product-name"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                          <p className="text-xs text-gray-500 mt-1">URL에 사용되는 고유 식별자</p>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">바코드</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.barcode}
                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                            placeholder="8801234567890"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">카테고리</td>
                        <td className="px-4 py-3">
                          <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          >
                            <option value="">선택하세요</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">간단 설명</td>
                        <td className="px-4 py-3">
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className="bg-white border border-gray-300 mb-4">
                <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-700">가격 정보</h3>
                </div>
                <div className="p-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 w-32 border-r border-gray-200">판매가 <span className="text-red-500">*</span></td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">정가</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={formData.original_price || ''}
                            onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">할인율 (%)</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={formData.discount || ''}
                            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">배송비</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={formData.shipping_fee || ''}
                            onChange={(e) => setFormData({ ...formData, shipping_fee: Number(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 재고 정보 */}
              <div className="bg-white border border-gray-300 mb-4">
                <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-700">재고 정보</h3>
                </div>
                <div className="p-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 w-32 border-r border-gray-200">재고 수량</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={formData.stock || ''}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">최소 재고</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={formData.min_stock || ''}
                            onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">판매 상태</td>
                        <td className="px-4 py-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.is_active}
                              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                              className="w-4 h-4 border-gray-300"
                            />
                            <span className="text-sm text-gray-700">판매중</span>
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 상품 상세 정보 */}
              <div className="bg-white border border-gray-300 mb-4">
                <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-700">상품 상세 정보</h3>
                </div>
                <div className="p-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 w-32 border-r border-gray-200">제조사</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.manufacturer}
                            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">원산지</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            placeholder="대한민국"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">무게 (kg)</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={formData.weight || ''}
                            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">치수</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.dimensions}
                            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                            placeholder="가로 x 세로 x 높이 (cm)"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">보증기간</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.warranty}
                            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                            placeholder="1년"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">배송 정보</td>
                        <td className="px-4 py-3">
                          <textarea
                            value={formData.shipping_info}
                            onChange={(e) => setFormData({ ...formData, shipping_info: e.target.value })}
                            rows={2}
                            placeholder="배송 방법 및 소요 시간"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">상세 설명</td>
                        <td className="px-4 py-3">
                          <textarea
                            value={formData.detailed_description}
                            onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 이미지 및 배지 */}
              <div className="bg-white border border-gray-300 mb-4">
                <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-700">이미지 및 배지</h3>
                </div>
                <div className="p-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 w-32 border-r border-gray-200">대표 이미지</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">추가 이미지</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              placeholder="이미지 URL 입력"
                              className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                              style={{ fontSize: '13px' }}
                            />
                            <button
                              onClick={() => {
                                if (newImageUrl) {
                                  setFormData({ ...formData, images: [...formData.images, newImageUrl] })
                                  setNewImageUrl('')
                                }
                              }}
                              className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700"
                              style={{ fontSize: '13px' }}
                            >
                              추가
                            </button>
                          </div>
                          <div className="space-y-1">
                            {formData.images.map((img, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={img}
                                  readOnly
                                  className="flex-1 px-2 py-1 border border-gray-300 bg-gray-50"
                                  style={{ fontSize: '12px' }}
                                />
                                <button
                                  onClick={() => {
                                    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })
                                  }}
                                  className="px-2 py-1 bg-red-600 text-white hover:bg-red-700"
                                  style={{ fontSize: '12px' }}
                                >
                                  삭제
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">배지</td>
                        <td className="px-4 py-3">
                          <select
                            value={formData.badge}
                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          >
                            <option value="">없음</option>
                            <option value="NEW">NEW</option>
                            <option value="BEST">BEST</option>
                            <option value="HOT">HOT</option>
                            <option value="SALE">SALE</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 판매 기간 및 검색 */}
              <div className="bg-white border border-gray-300 mb-4">
                <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-700">판매 기간 및 검색</h3>
                </div>
                <div className="p-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 w-32 border-r border-gray-200">판매 시작일</td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={formData.sale_start_date}
                            onChange={(e) => setFormData({ ...formData, sale_start_date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">판매 종료일</td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={formData.sale_end_date}
                            onChange={(e) => setFormData({ ...formData, sale_end_date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">검색 키워드</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.keywords}
                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            placeholder="쉼표로 구분하여 입력"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">상품 특징</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={newFeature}
                              onChange={(e) => setNewFeature(e.target.value)}
                              placeholder="특징 입력"
                              className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                              style={{ fontSize: '13px' }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && newFeature) {
                                  setFormData({ ...formData, features: [...formData.features, newFeature] })
                                  setNewFeature('')
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                if (newFeature) {
                                  setFormData({ ...formData, features: [...formData.features, newFeature] })
                                  setNewFeature('')
                                }
                              }}
                              className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700"
                              style={{ fontSize: '13px' }}
                            >
                              추가
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.features.map((feature, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200">
                                {feature}
                                <button
                                  onClick={() => {
                                    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== idx) })
                                  }}
                                  className="text-blue-700 hover:text-blue-900"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SEO 정보 */}
              <div className="bg-white border border-gray-300 mb-4">
                <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-700">SEO 정보</h3>
                </div>
                <div className="p-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 w-32 border-r border-gray-200">메타 제목</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.meta_title}
                            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">메타 설명</td>
                        <td className="px-4 py-3">
                          <textarea
                            value={formData.meta_description}
                            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ fontSize: '13px' }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Footer Buttons */}
            <div className="bg-gray-100 border-t border-gray-300 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-white border border-gray-400 text-gray-700 hover:bg-gray-50"
                style={{ fontSize: '13px', fontWeight: '500' }}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
                style={{ fontSize: '13px', fontWeight: '500' }}
              >
                <Save className="w-4 h-4" />
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductsPage
