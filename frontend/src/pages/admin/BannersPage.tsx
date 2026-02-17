import { useState, useEffect, useRef } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  ExternalLink,
  GripVertical,
  Eye,
  EyeOff,
  Upload,
  X,
  Loader2
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_url: string | null
  position: number
  is_active: boolean
  created_at: string
}

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    is_active: true,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('position', { ascending: true })

    if (!error && data) {
      setBanners(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBanner) {
      const { error } = await supabase
        .from('banners')
        .update({
          title: formData.title,
          subtitle: formData.subtitle || null,
          image_url: formData.image_url,
          link_url: formData.link_url || null,
          is_active: formData.is_active,
        })
        .eq('id', editingBanner.id)

      if (!error) {
        fetchBanners()
        setShowModal(false)
        resetForm()
      }
    } else {
      const maxPosition = banners.length > 0 ? Math.max(...banners.map(b => b.position)) + 1 : 1
      const { error } = await supabase
        .from('banners')
        .insert([{
          title: formData.title,
          subtitle: formData.subtitle || null,
          image_url: formData.image_url,
          link_url: formData.link_url || null,
          is_active: formData.is_active,
          position: maxPosition,
        }])

      if (!error) {
        fetchBanners()
        setShowModal(false)
        resetForm()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 배너를 삭제하시겠습니까?')) return
    
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchBanners()
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      is_active: banner.is_active,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      is_active: true,
    })
    setUploadError('')
  }

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('JPG, PNG, WebP, GIF 이미지만 업로드 가능합니다.')
      return
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('이미지 크기는 10MB 이하여야 합니다.')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      // 파일명 생성 (고유한 이름)
      const fileExt = file.name.split('.').pop()
      const fileName = `banner_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

      // Supabase Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName)

      setFormData({ ...formData, image_url: urlData.publicUrl })
    } catch (err: any) {
      console.error('업로드 오류:', err)
      setUploadError(err.message || '이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 이미지 삭제 (URL 초기화)
  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' })
  }

  const toggleActive = async (banner: Banner) => {
    const { error } = await supabase
      .from('banners')
      .update({ is_active: !banner.is_active })
      .eq('id', banner.id)

    if (!error) {
      fetchBanners()
    }
  }

  const movePosition = async (bannerId: string, direction: 'up' | 'down') => {
    const idx = banners.findIndex(b => b.id === bannerId)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === banners.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const currentBanner = banners[idx]
    const swapBanner = banners[swapIdx]

    await Promise.all([
      supabase.from('banners').update({ position: swapBanner.position }).eq('id', currentBanner.id),
      supabase.from('banners').update({ position: currentBanner.position }).eq('id', swapBanner.id),
    ])

    fetchBanners()
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">배너 관리</h1>
          <p className="text-sm text-gray-500 mt-1">메인 페이지 슬라이드 배너를 관리합니다.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          배너 등록
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">전체 배너</p>
              <p className="text-xl font-bold text-gray-800">{banners.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">활성 배너</p>
              <p className="text-xl font-bold text-gray-800">{banners.filter(b => b.is_active).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">비활성 배너</p>
              <p className="text-xl font-bold text-gray-800">{banners.filter(b => !b.is_active).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">로딩 중...</div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>등록된 배너가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {banners.map((banner, idx) => (
              <div key={banner.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => movePosition(banner.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-xs text-center text-gray-400">{idx + 1}</span>
                  <button
                    onClick={() => movePosition(banner.id, 'down')}
                    disabled={idx === banners.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="w-40 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {banner.image_url ? (
                    <img 
                      src={banner.image_url} 
                      alt={banner.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800 truncate">{banner.title}</h3>
                    {!banner.is_active && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">비활성</span>
                    )}
                  </div>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-500 truncate mt-0.5">{banner.subtitle}</p>
                  )}
                  {banner.link_url && (
                    <a 
                      href={banner.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {banner.link_url}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium ${
                      banner.is_active
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {banner.is_active ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingBanner ? '배너 수정' : '배너 등록'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배너 제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="메인 타이틀"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">부제목 (선택)</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="서브 타이틀"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배너 이미지</label>
                
                {/* 이미지 미리보기 또는 업로드 영역 */}
                {formData.image_url ? (
                  <div className="relative">
                    <div className="h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12">이미지 로드 실패</text></svg>'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                        <span className="text-sm text-gray-500">업로드 중...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">클릭하여 이미지 업로드</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF (최대 10MB)</span>
                      </>
                    )}
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {uploadError && (
                  <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                )}

                {/* URL 직접 입력 옵션 */}
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">또는 이미지 URL 직접 입력:</p>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL (선택)</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/page"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">활성화</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingBanner ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannersPage

