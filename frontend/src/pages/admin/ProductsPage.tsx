import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  Eye,
  Copy,
  ChevronLeft,
  ChevronRight,
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
    price: 0,
    original_price: 0,
    discount: 0,
    category_id: '',
    image_url: '',
    badge: '',
    stock: 0,
    is_active: true,
  })

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
    if (editingProduct) {
      // 수정
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProduct.id)

      if (error) {
        alert('수정 실패: ' + error.message)
      } else {
        setShowModal(false)
        fetchProducts()
      }
    } else {
      // 새 상품 등록
      const { error } = await supabase.from('products').insert([formData])

      if (error) {
        alert('등록 실패: ' + error.message)
      } else {
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
      price: 0,
      original_price: 0,
      discount: 0,
      category_id: '',
      image_url: '',
      badge: '',
      stock: 0,
      is_active: true,
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      original_price: product.original_price || 0,
      discount: product.discount || 0,
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      badge: product.badge || '',
      stock: product.stock,
      is_active: product.is_active,
    })
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">{editingProduct ? '상품 수정' : '상품 등록'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상품명 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">슬러그 *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="product-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">판매가 *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">정가</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">할인율 (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">배지</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">없음</option>
                    <option value="NEW">NEW</option>
                    <option value="BEST">BEST</option>
                    <option value="HOT">HOT</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">판매중</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
