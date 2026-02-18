import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

// 토스페이먼츠 타입 선언
declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (method: string, options: {
        amount: number
        orderId: string
        orderName: string
        customerName: string
        successUrl: string
        failUrl: string
      }) => Promise<void>
    }
  }
}

const CheckoutPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [items] = useState<OrderItem[]>(location.state?.items || [])
  const [user, setUser] = useState<{ email: string; name?: string; phone?: string } | null>(null)
  
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    phone1: '010',
    phone2: '',
    phone3: '',
    email: '',
    zipcode: '',
    address: '',
    addressDetail: '',
    memo: '',
  })
  
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }
      
      const userData = {
        email: session.user.email || '',
        name: session.user.user_metadata?.name || '',
        phone: session.user.user_metadata?.phone || '',
      }
      setUser(userData)
      
      // 사용자 정보로 초기값 설정
      const phoneParts = userData.phone?.split('-') || ['010', '', '']
      setOrderInfo(prev => ({
        ...prev,
        name: userData.name,
        email: userData.email,
        phone1: phoneParts[0] || '010',
        phone2: phoneParts[1] || '',
        phone3: phoneParts[2] || '',
      }))
    }
    checkAuth()

    // 상품이 없으면 장바구니로 리다이렉트
    if (!location.state?.items || location.state.items.length === 0) {
      navigate('/cart')
    }
  }, [navigate, location.state])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value })
  }

  const handleSearchAddress = () => {
    // @ts-expect-error daum postcode API
    new window.daum.Postcode({
      oncomplete: function(data: { zonecode: string; address: string; buildingName: string }) {
        const fullAddress = data.buildingName 
          ? `${data.address} (${data.buildingName})`
          : data.address
        
        setOrderInfo(prev => ({
          ...prev,
          zipcode: data.zonecode,
          address: fullAddress,
        }))
      }
    }).open()
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 50000 ? 0 : 3000
  const total = subtotal + shipping

  const handlePayment = async () => {
    // 유효성 검사
    if (!orderInfo.name || !orderInfo.phone2 || !orderInfo.phone3 || !orderInfo.address) {
      alert('배송 정보를 모두 입력해주세요.')
      return
    }
    if (!agreeTerms) {
      alert('결제 약관에 동의해주세요.')
      return
    }

    setIsProcessing(true)

    try {
      // 주문 ID 생성
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 주문명 생성
      const orderName = items.length > 1 
        ? `${items[0].name} 외 ${items.length - 1}건`
        : items[0].name

      // 토스페이먼츠 클라이언트 키 (테스트용)
      // 실제 운영시에는 환경변수로 관리해야 합니다
      const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

      if (typeof window.TossPayments === 'undefined') {
        alert('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
        setIsProcessing(false)
        return
      }

      const tossPayments = window.TossPayments(clientKey)

      await tossPayments.requestPayment(paymentMethod === 'card' ? '카드' : '가상계좌', {
        amount: total,
        orderId: orderId,
        orderName: orderName,
        customerName: orderInfo.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
    } catch (error) {
      console.error('Payment error:', error)
      setIsProcessing(false)
    }
  }

  if (!user || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1000px] mx-auto px-4 py-4 md:py-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">주문/결제</h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Left: Order Form */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* 주문 상품 */}
            <div className="bg-white rounded-lg">
              <div className="p-3 md:p-4 border-b">
                <h2 className="font-bold text-gray-800 text-sm md:text-base">주문 상품 ({items.length}개)</h2>
              </div>
              <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 md:gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl md:text-3xl">{item.image}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm md:text-base truncate">{item.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">수량: {item.quantity}개</p>
                    </div>
                    <p className="font-bold text-gray-800 text-sm md:text-base flex-shrink-0">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-white rounded-lg">
              <div className="p-3 md:p-4 border-b">
                <h2 className="font-bold text-gray-800 text-sm md:text-base">배송 정보</h2>
              </div>
              <div className="p-3 md:p-4 space-y-4">
                {/* 받는분 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    받는분 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orderInfo.name}
                    onChange={handleChange}
                    className="w-full md:w-48 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* 연락처 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <select
                      name="phone1"
                      value={orderInfo.phone1}
                      onChange={handleChange}
                      className="w-20 px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="010">010</option>
                      <option value="011">011</option>
                      <option value="016">016</option>
                      <option value="017">017</option>
                    </select>
                    <span className="text-gray-400">-</span>
                    <input
                      type="text"
                      name="phone2"
                      value={orderInfo.phone2}
                      onChange={handleChange}
                      maxLength={4}
                      className="flex-1 md:w-20 md:flex-none px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      required
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="text"
                      name="phone3"
                      value={orderInfo.phone3}
                      onChange={handleChange}
                      maxLength={4}
                      className="flex-1 md:w-20 md:flex-none px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* 주소 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="zipcode"
                        value={orderInfo.zipcode}
                        placeholder="우편번호"
                        className="w-24 md:w-28 px-2 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={handleSearchAddress}
                        className="px-3 py-2.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                      >
                        주소검색
                      </button>
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={orderInfo.address}
                      placeholder="기본주소"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      readOnly
                    />
                    <input
                      type="text"
                      name="addressDetail"
                      value={orderInfo.addressDetail}
                      onChange={handleChange}
                      placeholder="상세주소를 입력하세요"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 배송메모 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">배송메모</label>
                  <select
                    name="memo"
                    value={orderInfo.memo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">배송메모를 선택하세요</option>
                    <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                    <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                    <option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</option>
                    <option value="부재시 문 앞에 놓아주세요">부재시 문 앞에 놓아주세요</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 결제 수단 */}
            <div className="bg-white rounded-lg">
              <div className="p-3 md:p-4 border-b">
                <h2 className="font-bold text-gray-800 text-sm md:text-base">결제 수단</h2>
              </div>
              <div className="p-3 md:p-4">
                <div className="flex gap-2 md:gap-3">
                  {[
                    { id: 'card', label: '신용/체크카드' },
                    { id: 'virtual', label: '가상계좌' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex-1 py-2.5 md:py-3 border rounded-lg text-xs md:text-sm font-medium transition-colors ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] md:text-xs text-gray-400 mt-2 md:mt-3">
                  * 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 md:p-6 md:sticky md:top-24">
              <h3 className="font-bold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">결제 금액</h3>
              
              <div className="space-y-2 md:space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">상품금액</span>
                  <span className="text-gray-800">{subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">배송비</span>
                  <span className={shipping === 0 ? 'text-blue-600' : 'text-gray-800'}>
                    {shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}
                  </span>
                </div>
              </div>

              <div className="border-t mt-3 md:mt-4 pt-3 md:pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm md:text-base">총 결제금액</span>
                  <span className="text-xl md:text-2xl font-black text-blue-600">{total.toLocaleString()}원</span>
                </div>
              </div>

              <div className="mt-4 md:mt-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] md:text-xs text-gray-600">
                    주문 내용을 확인하였으며, 결제 진행에 동의합니다.
                    <Link to="/terms" className="text-blue-600 hover:underline ml-1">(약관보기)</Link>
                  </span>
                </label>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || !agreeTerms}
                className="w-full mt-3 md:mt-4 py-3 md:py-4 bg-blue-600 text-white rounded-lg font-bold text-sm md:text-base hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? '처리중...' : `${total.toLocaleString()}원 결제하기`}
              </button>

              <Link
                to="/cart"
                className="block text-center text-xs md:text-sm text-gray-500 hover:text-blue-600 mt-3 md:mt-4"
              >
                장바구니로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

