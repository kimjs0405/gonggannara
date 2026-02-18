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

interface PromotionCard {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  link_url: string | null
  background_color: string
  position: number
  is_active: boolean
  created_at: string
}

const PromotionCardsPage = () => {
  const [cards, setCards] = useState<PromotionCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCard, setEditingCard] = useState<PromotionCard | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    background_color: 'from-pink-50 to-purple-50',
    is_active: true,
  })

  const backgroundColors = [
    { value: 'from-pink-50 to-purple-50', label: '핑크-퍼플' },
    { value: 'from-purple-50 to-indigo-50', label: '퍼플-인디고' },
    { value: 'from-blue-50 to-cyan-50', label: '블루-시안' },
    { value: 'from-green-50 to-emerald-50', label: '그린-에메랄드' },
    { value: 'from-orange-50 to-red-50', label: '오렌지-레드' },
    { value: 'from-yellow-50 to-amber-50', label: '옐로우-앰버' },
  ]

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('promotion_cards')
      .select('*')
      .order('position', { ascending: true })

    if (!error && data) {
      setCards(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCard) {
      const { error } = await supabase
        .from('promotion_cards')
        .update({
          title: formData.title,
          subtitle: formData.subtitle || null,
          image_url: formData.image_url || null,
          link_url: formData.link_url || null,
          background_color: formData.background_color,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingCard.id)

      if (!error) {
        fetchCards()
        setShowModal(false)
        resetForm()
      }
    } else {
      const maxPosition = cards.length > 0 ? Math.max(...cards.map(c => c.position)) + 1 : 1
      const { error } = await supabase
        .from('promotion_cards')
        .insert([{
          title: formData.title,
          subtitle: formData.subtitle || null,
          image_url: formData.image_url || null,
          link_url: formData.link_url || null,
          background_color: formData.background_color,
          is_active: formData.is_active,
          position: maxPosition,
        }])

      if (!error) {
        fetchCards()
        setShowModal(false)
        resetForm()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 카드를 삭제하시겠습니까?')) return
    
    const { error } = await supabase
      .from('promotion_cards')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchCards()
    }
  }

  const handleEdit = (card: PromotionCard) => {
    setEditingCard(card)
    setFormData({
      title: card.title,
      subtitle: card.subtitle || '',
      image_url: card.image_url || '',
      link_url: card.link_url || '',
      background_color: card.background_color,
      is_active: card.is_active,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingCard(null)
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      background_color: 'from-pink-50 to-purple-50',
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
      const fileName = `promotion_card_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

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

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' })
  }

  const toggleActive = async (card: PromotionCard) => {
    const { error } = await supabase
      .from('promotion_cards')
      .update({ is_active: !card.is_active })
      .eq('id', card.id)

    if (!error) {
      fetchCards()
    }
  }

  const movePosition = async (cardId: string, direction: 'up' | 'down') => {
    const idx = cards.findIndex(c => c.id === cardId)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === cards.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const currentCard = cards[idx]
    const swapCard = cards[swapIdx]

    await Promise.all([
      supabase.from('promotion_cards').update({ position: swapCard.position }).eq('id', currentCard.id),
      supabase.from('promotion_cards').update({ position: currentCard.position }).eq('id', swapCard.id),
    ])

    fetchCards()
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">프로모션 카드 관리</h1>
          <p className="text-sm text-gray-500 mt-1">홈페이지 프로모션 카드를 관리합니다.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          카드 등록
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
              <p className="text-sm text-gray-500">전체 카드</p>
              <p className="text-xl font-bold text-gray-800">{cards.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">활성 카드</p>
              <p className="text-xl font-bold text-gray-800">{cards.filter(c => c.is_active).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">비활성 카드</p>
              <p className="text-xl font-bold text-gray-800">{cards.filter(c => !c.is_active).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">로딩 중...</div>
        ) : cards.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>등록된 카드가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cards.map((card, idx) => (
              <div key={card.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => movePosition(card.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-xs text-center text-gray-400">{idx + 1}</span>
                  <button
                    onClick={() => movePosition(card.id, 'down')}
                    disabled={idx === cards.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className={`w-32 h-20 bg-gradient-to-br ${card.background_color} rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden`}>
                  {card.image_url ? (
                    <img 
                      src={card.image_url} 
                      alt={card.title} 
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800 truncate">{card.title}</h3>
                    {!card.is_active && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">비활성</span>
                    )}
                  </div>
                  {card.subtitle && (
                    <p className="text-sm text-gray-500 truncate mt-0.5">{card.subtitle}</p>
                  )}
                  {card.link_url && (
                    <a 
                      href={card.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {card.link_url}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(card)}
                    className={`p-2 rounded-lg transition-colors ${
                      card.is_active 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {card.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(card)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCard ? '카드 수정' : '카드 등록'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부제목
                </label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배경색
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, background_color: color.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.background_color === color.value
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-8 bg-gradient-to-br ${color.value} rounded mb-2`}></div>
                      <span className="text-xs text-gray-600">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지
                </label>
                {formData.image_url ? (
                  <div className="relative">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-48 object-contain bg-gray-50 rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 URL
                </label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  활성화
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingCard ? '수정하기' : '등록하기'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromotionCardsPage
