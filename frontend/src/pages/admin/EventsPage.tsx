import { useState, useEffect, useRef } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  Upload,
  X,
  Loader2
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Event {
  id: string
  title: string
  description: string | null
  image_url: string | null
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    start_date: '',
    end_date: '',
    is_active: true,
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching events:', error)
        alert('이벤트 목록을 불러오는데 실패했습니다.')
      } else {
        setEvents(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingEvent.id)

        if (error) {
          alert('수정 실패: ' + error.message)
        } else {
          alert('이벤트가 수정되었습니다.')
          fetchEvents()
          setShowModal(false)
          resetForm()
        }
      } else {
        const { error } = await supabase
          .from('events')
          .insert([formData])

        if (error) {
          alert('등록 실패: ' + error.message)
        } else {
          alert('이벤트가 등록되었습니다.')
          fetchEvents()
          setShowModal(false)
          resetForm()
        }
      }
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 이벤트를 삭제하시겠습니까?')) return
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) {
        alert('삭제 실패: ' + error.message)
      } else {
        alert('이벤트가 삭제되었습니다.')
        fetchEvents()
      }
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      image_url: event.image_url || '',
      start_date: event.start_date,
      end_date: event.end_date,
      is_active: event.is_active,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingEvent(null)
    setFormData({
      title: '',
      description: '',
      image_url: '',
      start_date: '',
      end_date: '',
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
      const fileName = `event_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

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

  const toggleActive = async (event: Event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !event.is_active })
        .eq('id', event.id)

      if (error) {
        alert('상태 변경 실패: ' + error.message)
      } else {
        fetchEvents()
      }
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message)
    }
  }

  const getStatus = (event: Event) => {
    const now = new Date()
    const start = new Date(event.start_date)
    const end = new Date(event.end_date)

    if (!event.is_active) return { label: '비활성', color: 'bg-gray-100 text-gray-600' }
    if (now < start) return { label: '대기중', color: 'bg-yellow-100 text-yellow-700' }
    if (now > end) return { label: '종료됨', color: 'bg-red-100 text-red-600' }
    return { label: '진행중', color: 'bg-green-100 text-green-700' }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">이벤트 관리</h1>
          <p className="text-sm text-gray-500 mt-1">이벤트를 관리합니다.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          이벤트 등록
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">전체 이벤트</p>
              <p className="text-xl font-bold text-gray-800">{events.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">진행중</p>
              <p className="text-xl font-bold text-gray-800">
                {events.filter(e => getStatus(e).label === '진행중').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">대기중</p>
              <p className="text-xl font-bold text-gray-800">
                {events.filter(e => getStatus(e).label === '대기중').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">종료됨</p>
              <p className="text-xl font-bold text-gray-800">
                {events.filter(e => getStatus(e).label === '종료됨').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">로딩 중...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500">등록된 이벤트가 없습니다.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">이벤트 정보</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">기간</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">상태</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">관리</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const status = getStatus(event)
                return (
                  <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {event.image_url && (
                          <img 
                            src={event.image_url} 
                            alt={event.title} 
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{event.title}</p>
                          {event.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      <p>{event.start_date}</p>
                      <p className="text-gray-400">~ {event.end_date}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleActive(event)}
                          className={`px-2 py-1 text-xs rounded ${
                            event.is_active 
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        >
                          {event.is_active ? '비활성화' : '활성화'}
                        </button>
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingEvent ? '이벤트 수정' : '이벤트 등록'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이벤트 제목 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지</label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작일 *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">종료일 *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
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
                  {editingEvent ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsPage
