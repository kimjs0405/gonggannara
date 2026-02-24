import { useState, useEffect, useRef } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  GripVertical
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface AdSlide {
  id: string
  title: string
  image_url: string
  link_url: string | null
  slide_group: 'group1' | 'group2'
  position: number
  is_active: boolean
  created_at: string
}

const AdSlidesPage = () => {
  const [slides, setSlides] = useState<AdSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState<AdSlide | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    slide_group: 'group1' as 'group1' | 'group2',
    is_active: true,
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ad_slides')
        .select('*')
        .order('slide_group', { ascending: true })
        .order('position', { ascending: true })

      if (error) {
        console.error('Error fetching ad slides:', error)
        alert('광고 슬라이드 목록을 불러오는데 실패했습니다.')
      } else {
        setSlides(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image_url) {
      alert('이미지를 업로드해주세요.')
      return
    }

    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('ad_slides')
          .update({
            title: formData.title,
            image_url: formData.image_url,
            link_url: formData.link_url || null,
            slide_group: formData.slide_group,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSlide.id)

        if (error) {
          alert('수정 실패: ' + error.message)
        } else {
          alert('광고 슬라이드가 수정되었습니다.')
          fetchSlides()
          setShowModal(false)
          resetForm()
          // 홈페이지에 업데이트 알림
          window.dispatchEvent(new Event('adSlideUpdated'))
        }
      } else {
        // 새 슬라이드 추가시 position 계산
        const groupSlides = slides.filter(s => s.slide_group === formData.slide_group)
        const maxPosition = groupSlides.length > 0 
          ? Math.max(...groupSlides.map(s => s.position)) + 1 
          : 1

        const { error } = await supabase
          .from('ad_slides')
          .insert([{
            ...formData,
            link_url: formData.link_url || null,
            position: maxPosition,
          }])

        if (error) {
          alert('등록 실패: ' + error.message)
        } else {
          alert('광고 슬라이드가 등록되었습니다.')
          fetchSlides()
          setShowModal(false)
          resetForm()
          // 홈페이지에 업데이트 알림
          window.dispatchEvent(new Event('adSlideUpdated'))
        }
      }
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 광고 슬라이드를 삭제하시겠습니까?')) return
    
    try {
      const { error } = await supabase
        .from('ad_slides')
        .delete()
        .eq('id', id)

      if (error) {
        alert('삭제 실패: ' + error.message)
      } else {
        alert('광고 슬라이드가 삭제되었습니다.')
        fetchSlides()
        // 홈페이지에 업데이트 알림
        window.dispatchEvent(new Event('adSlideUpdated'))
      }
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message)
    }
  }

  const handleEdit = (slide: AdSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      image_url: slide.image_url,
      link_url: slide.link_url || '',
      slide_group: slide.slide_group,
      is_active: slide.is_active,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingSlide(null)
    setFormData({
      title: '',
      image_url: '',
      link_url: '',
      slide_group: 'group1',
      is_active: true,
    })
    setUploadError('')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('JPG, PNG, WebP, GIF 이미지만 업로드 가능합니다.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('이미지 크기는 10MB 이하여야 합니다.')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `ad_slide_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

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

  const toggleActive = async (slide: AdSlide) => {
    try {
      const { error } = await supabase
        .from('ad_slides')
        .update({ is_active: !slide.is_active })
        .eq('id', slide.id)

      if (error) {
        alert('상태 변경 실패: ' + error.message)
      } else {
        fetchSlides()
        // 홈페이지에 업데이트 알림
        window.dispatchEvent(new Event('adSlideUpdated'))
      }
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message)
    }
  }

  const movePosition = async (slideId: string, direction: 'up' | 'down') => {
    const slide = slides.find(s => s.id === slideId)
    if (!slide) return

    const groupSlides = slides
      .filter(s => s.slide_group === slide.slide_group)
      .sort((a, b) => a.position - b.position)
    
    const idx = groupSlides.findIndex(s => s.id === slideId)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === groupSlides.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const currentSlide = groupSlides[idx]
    const swapSlide = groupSlides[swapIdx]

    await Promise.all([
      supabase.from('ad_slides').update({ position: swapSlide.position }).eq('id', currentSlide.id),
      supabase.from('ad_slides').update({ position: currentSlide.position }).eq('id', swapSlide.id),
    ])

    fetchSlides()
    // 홈페이지에 업데이트 알림
    window.dispatchEvent(new Event('adSlideUpdated'))
  }

  const group1Slides = slides.filter(s => s.slide_group === 'group1').sort((a, b) => a.position - b.position)
  const group2Slides = slides.filter(s => s.slide_group === 'group2').sort((a, b) => a.position - b.position)

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">광고 슬라이드 관리</h1>
          <p className="text-sm text-gray-500 mt-1">홈페이지 광고 슬라이드를 관리합니다.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          슬라이드 등록
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
              <p className="text-sm text-gray-500">전체 슬라이드</p>
              <p className="text-xl font-bold text-gray-800">{slides.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">그룹 1</p>
              <p className="text-xl font-bold text-gray-800">{group1Slides.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">그룹 2</p>
              <p className="text-xl font-bold text-gray-800">{group2Slides.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group 1 Slides */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">광고 슬라이드 그룹 1</h2>
        </div>
        {loading ? (
          <div className="text-center py-20 text-gray-500">로딩 중...</div>
        ) : group1Slides.length === 0 ? (
          <div className="text-center py-20 text-gray-500">등록된 슬라이드가 없습니다.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {group1Slides.map((slide, idx) => (
              <div key={slide.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => movePosition(slide.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-xs text-center text-gray-400">{idx + 1}</span>
                  <button
                    onClick={() => movePosition(slide.id, 'down')}
                    disabled={idx === group1Slides.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <img 
                  src={slide.image_url} 
                  alt={slide.title} 
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800 truncate">{slide.title}</h3>
                    {!slide.is_active && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">비활성</span>
                    )}
                  </div>
                  {slide.link_url && (
                    <p className="text-sm text-gray-500 truncate mt-1">{slide.link_url}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(slide)}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.is_active 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {slide.is_active ? '활성' : '비활성'}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group 2 Slides */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">광고 슬라이드 그룹 2</h2>
        </div>
        {loading ? (
          <div className="text-center py-20 text-gray-500">로딩 중...</div>
        ) : group2Slides.length === 0 ? (
          <div className="text-center py-20 text-gray-500">등록된 슬라이드가 없습니다.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {group2Slides.map((slide, idx) => (
              <div key={slide.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => movePosition(slide.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-xs text-center text-gray-400">{idx + 1}</span>
                  <button
                    onClick={() => movePosition(slide.id, 'down')}
                    disabled={idx === group2Slides.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <img 
                  src={slide.image_url} 
                  alt={slide.title} 
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800 truncate">{slide.title}</h3>
                    {!slide.is_active && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">비활성</span>
                    )}
                  </div>
                  {slide.link_url && (
                    <p className="text-sm text-gray-500 truncate mt-1">{slide.link_url}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(slide)}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.is_active 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {slide.is_active ? '활성' : '비활성'}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
          <div className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingSlide ? '슬라이드 수정' : '슬라이드 등록'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">슬라이드 그룹 *</label>
                <select
                  value={formData.slide_group}
                  onChange={(e) => setFormData({ ...formData, slide_group: e.target.value as 'group1' | 'group2' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="group1">그룹 1</option>
                  <option value="group2">그룹 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지 *</label>
                {formData.image_url ? (
                  <div className="relative">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-48 object-contain bg-gray-50 rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex flex-col items-center gap-2 text-gray-500 hover:text-gray-700"
                    >
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      ) : (
                        <Upload className="w-8 h-8" />
                      )}
                      <span className="text-sm">
                        {uploading ? '업로드 중...' : '이미지 업로드'}
                      </span>
                    </button>
                    {uploadError && (
                      <p className="text-xs text-red-500 mt-2">{uploadError}</p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                  {editingSlide ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdSlidesPage
