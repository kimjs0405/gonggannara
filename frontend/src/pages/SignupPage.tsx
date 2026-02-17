import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronRight, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SignupPage = () => {
  const [step, setStep] = useState(1)
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  })
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone1: '010',
    phone2: '',
    phone3: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    zipcode: '',
    address: '',
    addressDetail: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedTerms, setExpandedTerms] = useState<string | null>(null)

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
    })
  }

  const handleAgreementChange = (key: keyof typeof agreements, checked: boolean) => {
    const newAgreements = { ...agreements, [key]: checked }
    newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.marketing
    setAgreements(newAgreements)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSearchAddress = () => {
    // @ts-expect-error daum postcode API
    new window.daum.Postcode({
      oncomplete: function(data: { zonecode: string; address: string; buildingName: string }) {
        const fullAddress = data.buildingName 
          ? `${data.address} (${data.buildingName})`
          : data.address
        
        setFormData(prev => ({
          ...prev,
          zipcode: data.zonecode,
          address: fullAddress,
        }))
      }
    }).open()
  }

  const handleStep1Next = () => {
    if (!agreements.terms || !agreements.privacy) {
      setError('필수 약관에 동의해주세요.')
      return
    }
    setError('')
    setStep(2)
  }

  const handleStep2Next = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setError('')
    setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone2 || !formData.phone3) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: `${formData.phone1}-${formData.phone2}-${formData.phone3}`,
            birth: formData.birthYear ? `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}` : null,
            gender: formData.gender,
            address: formData.address,
            addressDetail: formData.addressDetail,
            marketingAgreed: agreements.marketing,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('이미 가입된 이메일입니다.')
        } else {
          setError(signUpError.message)
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: formData.email,
          name: formData.name,
          phone: `${formData.phone1}-${formData.phone2}-${formData.phone3}`,
        })
        setStep(4)
      }
    } catch {
      setError('회원가입 중 오류가 발생했습니다.')
    }

    setIsLoading(false)
  }

  const termsContent = {
    terms: `제1조 (목적)
이 약관은 공간나라(이하 "회사")가 제공하는 인테리어 관련 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 인테리어 상품 판매, 시공 서비스 중개 등 관련 제반 서비스를 의미합니다.
2. "회원"이란 이 약관에 동의하고 회원가입을 완료한 자를 의미합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.

제4조 (서비스의 제공)
회사는 다음과 같은 서비스를 제공합니다.
1. 인테리어 상품 판매 서비스
2. 인테리어 시공 서비스 중개
3. 인테리어 상담 서비스
4. 기타 회사가 정하는 서비스`,
    privacy: `1. 수집하는 개인정보 항목
회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
- 필수항목: 이름, 이메일, 비밀번호, 연락처
- 선택항목: 생년월일, 성별, 주소

2. 개인정보의 수집 및 이용목적
- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별
- 마케팅 및 광고에 활용: 신규 서비스 개발 및 맞춤 서비스 제공

3. 개인정보의 보유 및 이용기간
회원의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.

4. 개인정보의 파기절차 및 방법
- 파기절차: 회원이 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.`,
  }

  // 완료 화면
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-[900px] mx-auto px-4 py-4">
            <Link to="/">
              <img src="/logo.svg" alt="공간나라" className="h-10" />
            </Link>
          </div>
        </div>

        <div className="max-w-[600px] mx-auto px-4 py-20">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">회원가입이 완료되었습니다</h2>
            <p className="text-gray-500 mb-2">공간나라의 회원이 되신 것을 환영합니다.</p>
            <p className="text-sm text-gray-400 mb-8">
              가입하신 이메일로 인증 메일이 발송되었습니다.<br />
              이메일 인증 후 로그인해주세요.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50"
              >
                홈으로
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-[900px] mx-auto px-4 py-4">
          <Link to="/">
            <img src="/logo.svg" alt="공간나라" className="h-10" />
          </Link>
        </div>
      </div>

      {/* Title */}
      <div className="bg-white border-b">
        <div className="max-w-[900px] mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800">회원가입</h1>
          <p className="text-gray-500 mt-1">공간나라 회원이 되시면 다양한 혜택을 받으실 수 있습니다.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-[900px] mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {[
              { num: 1, label: '약관동의' },
              { num: 2, label: '아이디/비밀번호' },
              { num: 3, label: '정보입력' },
              { num: 4, label: '가입완료' },
            ].map((item, idx) => (
              <div key={item.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= item.num
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > item.num ? <Check className="w-5 h-5" /> : item.num}
                  </div>
                  <span className={`text-xs mt-1 ${step >= item.num ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`w-20 h-0.5 mx-2 ${step > item.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: 약관동의 */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">약관동의</h2>
              <p className="text-sm text-gray-500 mt-1">서비스 이용을 위해 약관에 동의해주세요.</p>
            </div>

            <div className="p-6">
              {/* 전체 동의 */}
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.all}
                    onChange={(e) => handleAllAgreement(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-gray-800">전체 약관에 동의합니다</span>
                </label>
              </div>

              {/* 개별 약관 */}
              <div className="space-y-3">
                {/* 이용약관 */}
                <div className="border rounded-lg">
                  <div className="flex items-center justify-between p-4">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={agreements.terms}
                        onChange={(e) => handleAgreementChange('terms', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        <span className="text-red-500 font-medium">[필수]</span> 이용약관 동의
                      </span>
                    </label>
                    <button
                      onClick={() => setExpandedTerms(expandedTerms === 'terms' ? null : 'terms')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedTerms === 'terms' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {expandedTerms === 'terms' && (
                    <div className="px-4 pb-4">
                      <div className="h-40 overflow-y-auto p-3 bg-gray-50 rounded text-sm text-gray-600 whitespace-pre-line">
                        {termsContent.terms}
                      </div>
                    </div>
                  )}
                </div>

                {/* 개인정보처리방침 */}
                <div className="border rounded-lg">
                  <div className="flex items-center justify-between p-4">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={agreements.privacy}
                        onChange={(e) => handleAgreementChange('privacy', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        <span className="text-red-500 font-medium">[필수]</span> 개인정보 수집 및 이용 동의
                      </span>
                    </label>
                    <button
                      onClick={() => setExpandedTerms(expandedTerms === 'privacy' ? null : 'privacy')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedTerms === 'privacy' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {expandedTerms === 'privacy' && (
                    <div className="px-4 pb-4">
                      <div className="h-40 overflow-y-auto p-3 bg-gray-50 rounded text-sm text-gray-600 whitespace-pre-line">
                        {termsContent.privacy}
                      </div>
                    </div>
                  )}
                </div>

                {/* 마케팅 동의 */}
                <div className="border rounded-lg">
                  <div className="flex items-center p-4">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={agreements.marketing}
                        onChange={(e) => handleAgreementChange('marketing', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        <span className="text-gray-400 font-medium">[선택]</span> 마케팅 정보 수신 동의
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button
                onClick={handleStep1Next}
                className="px-8 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                다음 단계 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 아이디/비밀번호 */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">아이디 / 비밀번호 설정</h2>
              <p className="text-sm text-gray-500 mt-1">로그인에 사용할 아이디와 비밀번호를 설정해주세요.</p>
            </div>

            <div className="p-6">
              <table className="w-full">
                <tbody>
                  <tr className="border-t">
                    <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700 w-40">
                      이메일(아이디) <span className="text-red-500">*</span>
                    </th>
                    <td className="py-4 px-4">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="이메일 주소를 입력하세요"
                        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">* 입력하신 이메일로 인증 메일이 발송됩니다.</p>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700">
                      비밀번호 <span className="text-red-500">*</span>
                    </th>
                    <td className="py-4 px-4">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호 (6자 이상)"
                        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-400 mt-1">* 영문, 숫자 조합 6자 이상</p>
                    </td>
                  </tr>
                  <tr className="border-t border-b">
                    <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700">
                      비밀번호 확인 <span className="text-red-500">*</span>
                    </th>
                    <td className="py-4 px-4">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호를 다시 입력하세요"
                        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-100"
              >
                이전 단계
              </button>
              <button
                onClick={handleStep2Next}
                className="px-8 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                다음 단계 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 정보입력 */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-bold text-gray-800">회원정보 입력</h2>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
                </p>
              </div>

              <div className="p-6">
                <table className="w-full">
                  <tbody>
                    <tr className="border-t">
                      <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700 w-40">
                        이름 <span className="text-red-500">*</span>
                      </th>
                      <td className="py-4 px-4">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="이름을 입력하세요"
                          className="w-60 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700">
                        휴대폰번호 <span className="text-red-500">*</span>
                      </th>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            name="phone1"
                            value={formData.phone1}
                            onChange={handleChange}
                            className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          >
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="017">017</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                          </select>
                          <span className="text-gray-400">-</span>
                          <input
                            type="text"
                            name="phone2"
                            value={formData.phone2}
                            onChange={handleChange}
                            maxLength={4}
                            className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="text"
                            name="phone3"
                            value={formData.phone3}
                            onChange={handleChange}
                            maxLength={4}
                            className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700">
                        생년월일
                      </th>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            name="birthYear"
                            value={formData.birthYear}
                            onChange={handleChange}
                            className="w-28 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          >
                            <option value="">년도</option>
                            {Array.from({ length: 80 }, (_, i) => 2010 - i).map((year) => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <select
                            name="birthMonth"
                            value={formData.birthMonth}
                            onChange={handleChange}
                            className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          >
                            <option value="">월</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <option key={month} value={String(month).padStart(2, '0')}>{month}월</option>
                            ))}
                          </select>
                          <select
                            name="birthDay"
                            value={formData.birthDay}
                            onChange={handleChange}
                            className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          >
                            <option value="">일</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                              <option key={day} value={String(day).padStart(2, '0')}>{day}일</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700">
                        성별
                      </th>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={formData.gender === 'male'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">남성</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={formData.gender === 'female'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">여성</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t border-b">
                      <th className="py-4 px-4 bg-gray-50 text-left text-sm font-medium text-gray-700 align-top">
                        주소
                      </th>
                      <td className="py-4 px-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleChange}
                            placeholder="우편번호"
                            className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-gray-50"
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={handleSearchAddress}
                            className="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                          >
                            우편번호 검색
                          </button>
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="우편번호 검색 후 자동입력됩니다"
                          className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-gray-50"
                          readOnly
                        />
                        <input
                          type="text"
                          name="addressDetail"
                          value={formData.addressDetail}
                          onChange={handleChange}
                          placeholder="상세주소를 입력하세요"
                          className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-gray-50 border-t flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-100"
                >
                  이전 단계
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isLoading ? '처리중...' : '회원가입 완료'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 하단 안내 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            이미 회원이신가요?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
