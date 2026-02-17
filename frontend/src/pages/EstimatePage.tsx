import { useState } from 'react'
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import SubVisual from '../components/SubVisual'

const EstimatePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    service: '',
    budget: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제로는 API 호출
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">견적 문의가 접수되었습니다</h2>
          <p className="text-gray-500 mb-6">담당자가 빠른 시일 내에 연락드리겠습니다.</p>
          <a href="/" className="text-blue-600 font-medium hover:underline">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SubVisual
        title="무료 견적문의"
        subtitle="전문 상담사가 맞춤형 견적을 제공해드립니다"
        breadcrumb={[{ name: '견적문의' }]}
        bgColor="from-emerald-600 to-teal-700"
      />
      
      <div className="py-8 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <p className="text-gray-500 text-sm md:text-lg">
            상담 신청을 남겨주시면 전문 상담사가 친절하게 안내해 드립니다
          </p>
        </div>

        <div className="grid grid-cols-3 gap-12">
          {/* Form */}
          <div className="col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    평수
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 32평"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시공 주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="서울시 강남구..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    서비스 종류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택해주세요</option>
                    <option value="전체 리모델링">전체 리모델링</option>
                    <option value="부분 인테리어">부분 인테리어</option>
                    <option value="거실 인테리어">거실 인테리어</option>
                    <option value="주방 인테리어">주방 인테리어</option>
                    <option value="침실 인테리어">침실 인테리어</option>
                    <option value="욕실 인테리어">욕실 인테리어</option>
                    <option value="사무실 인테리어">사무실 인테리어</option>
                    <option value="상업공간 인테리어">상업공간 인테리어</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    예산
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택해주세요</option>
                    <option value="1000만원 이하">1000만원 이하</option>
                    <option value="1000~2000만원">1000~2000만원</option>
                    <option value="2000~3000만원">2000~3000만원</option>
                    <option value="3000~5000만원">3000~5000만원</option>
                    <option value="5000만원 이상">5000만원 이상</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="원하시는 스타일, 요청사항 등을 자유롭게 작성해주세요"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                견적 문의하기
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">전화 상담</h3>
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-6 h-6" />
                <span className="text-2xl font-black">02-875-8204</span>
              </div>
              <p className="text-sm text-blue-200">평일 09:00 ~ 18:00</p>
              <p className="text-sm text-blue-200">주말/공휴일 상담 가능</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900">오시는 길</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>서울특별시 관악구 신림동 257-13 1층 대원빌딩</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>GongganWord@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900">상담 절차</h3>
              <div className="space-y-4">
                {['견적 문의', '무료 방문 상담', '디자인 제안', '계약 및 시공'].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default EstimatePage

