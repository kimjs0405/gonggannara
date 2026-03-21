import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Building2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Listing {
  id: string
  title: string
  type: string
  area: string
  price: number | null
  deposit: number | null
  monthly_rent: number | null
  tag: string | null
  is_active: boolean
}

const initialForm = {
  title: '',
  type: '매매',
  area: '',
  price: 0,
  deposit: 0,
  monthly_rent: 0,
  tag: '추천',
  is_active: true,
}

const AdminRealEstatePage = () => {
  const [items, setItems] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Listing | null>(null)
  const [form, setForm] = useState(initialForm)

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('real_estate_listings').select('*').order('created_at', { ascending: false })
    setItems((data || []) as Listing[])
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm(initialForm)
    setShowModal(true)
  }

  const openEdit = (item: Listing) => {
    setEditing(item)
    setForm({
      title: item.title || '',
      type: item.type || '매매',
      area: item.area || '',
      price: item.price || 0,
      deposit: item.deposit || 0,
      monthly_rent: item.monthly_rent || 0,
      tag: item.tag || '추천',
      is_active: item.is_active,
    })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.title || !form.area) {
      alert('제목과 지역은 필수입니다.')
      return
    }

    const payload = {
      title: form.title,
      type: form.type,
      area: form.area,
      price: form.type === '월세' ? null : Number(form.price || 0),
      deposit: form.type === '월세' ? Number(form.deposit || 0) : null,
      monthly_rent: form.type === '월세' ? Number(form.monthly_rent || 0) : null,
      tag: form.tag || null,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    }

    if (editing) {
      await supabase.from('real_estate_listings').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('real_estate_listings').insert([payload])
    }

    setShowModal(false)
    setEditing(null)
    await fetchItems()
  }

  const remove = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('real_estate_listings').delete().eq('id', id)
    await fetchItems()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">부동산 매물 관리</h1>
          <p className="text-sm text-gray-500 mt-1">공간나라부동산 메인에 노출되는 매물을 관리합니다.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          매물 등록
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">로딩 중...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-500">등록된 매물이 없습니다.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs text-gray-500">매물</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">유형</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">지역</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">상태</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 text-sm text-gray-800">{item.title}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{item.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{item.area}</td>
                  <td className="px-4 py-4 text-sm">{item.is_active ? '활성' : '비활성'}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(item.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 inline-flex items-center gap-2"><Building2 className="w-5 h-5" />{editing ? '매물 수정' : '매물 등록'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="매물 제목" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <option value="매매">매매</option>
                  <option value="전세">전세</option>
                  <option value="월세">월세</option>
                </select>
                <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="지역" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              {form.type === '월세' ? (
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: Number(e.target.value) })} placeholder="보증금" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  <input type="number" value={form.monthly_rent} onChange={(e) => setForm({ ...form, monthly_rent: Number(e.target.value) })} placeholder="월세" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
              ) : (
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="가격" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              )}
              <div className="grid grid-cols-2 gap-3">
                <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="태그(추천/신규 등)" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  활성화
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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

export default AdminRealEstatePage
