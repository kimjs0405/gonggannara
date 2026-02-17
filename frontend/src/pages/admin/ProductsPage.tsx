import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react'

const AdminProductsPage = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const products = [
    { id: 'PRD001', name: '이탈리아 천연가죽 4인 소파', category: '가구', price: 1890000, stock: 12, status: 'active', sales: 45 },
    { id: 'PRD002', name: '루이스폴센 PH5 펜던트 조명', category: '조명', price: 890000, stock: 28, status: 'active', sales: 38 },
    { id: 'PRD003', name: '원목 월넛 6단 서랍장', category: '수납', price: 680000, stock: 8, status: 'active', sales: 28 },
    { id: 'PRD004', name: '프리미엄 암막커튼 세트', category: '커튼', price: 128000, stock: 45, status: 'active', sales: 62 },
    { id: 'PRD005', name: '허먼밀러 에어론 체어', category: '가구', price: 1650000, stock: 5, status: 'low_stock', sales: 32 },
    { id: 'PRD006', name: '페르시안 핸드메이드 러그', category: '데코', price: 450000, stock: 0, status: 'out_of_stock', sales: 18 },
    { id: 'PRD007', name: '스마트 LED 스탠드 조명', category: '조명', price: 89000, stock: 120, status: 'active', sales: 94 },
    { id: 'PRD008', name: '미니멀 원목 책상', category: '가구', price: 380000, stock: 15, status: 'inactive', sales: 12 },
  ]

  const categories = ['전체', '가구', '조명', '커튼', '수납', '데코']

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-600',
      low_stock: 'bg-yellow-100 text-yellow-700',
      out_of_stock: 'bg-red-100 text-red-700',
    }
    const labels = {
      active: '판매중',
      inactive: '판매중지',
      low_stock: '재고부족',
      out_of_stock: '품절',
    }
    return (
      <span className={`px-2 py-1 rounded text-[11px] font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
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
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            상품 등록
          </Link>
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
          <select className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-blue-500">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-blue-500">
            <option value="">상태 전체</option>
            <option value="active">판매중</option>
            <option value="inactive">판매중지</option>
            <option value="low_stock">재고부족</option>
            <option value="out_of_stock">품절</option>
          </select>

          <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            상세 필터
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
            <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors">
              일괄 수정
            </button>
            <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
              일괄 삭제
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상품정보</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">판매가</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">재고</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">판매량</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="w-20 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
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
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-600">{product.category}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-medium text-gray-800">₩{product.price.toLocaleString()}</span>
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
                  <span className="text-sm text-gray-600">{product.sales}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="보기">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="수정">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="복사">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded transition-colors" title="삭제">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            1-8 / 총 56개
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {[1, 2, 3, 4, 5].map(page => (
              <button
                key={page}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  page === 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-gray-400">...</span>
            <button className="w-8 h-8 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              7
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProductsPage

