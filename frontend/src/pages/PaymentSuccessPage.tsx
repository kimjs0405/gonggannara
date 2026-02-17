import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const [orderInfo, setOrderInfo] = useState({
    orderId: '',
    amount: 0,
    paymentKey: '',
  })

  useEffect(() => {
    // URL에서 결제 정보 추출
    const orderId = searchParams.get('orderId') || ''
    const amount = Number(searchParams.get('amount')) || 0
    const paymentKey = searchParams.get('paymentKey') || ''

    setOrderInfo({ orderId, amount, paymentKey })

    // 실제로는 여기서 서버에 결제 승인 요청을 보내야 합니다
    // 서버에서 토스페이먼츠 API로 결제 승인 처리
    console.log('Payment success:', { orderId, amount, paymentKey })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">결제가 완료되었습니다</h1>
        <p className="text-gray-500 mb-6">주문이 정상적으로 접수되었습니다.</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="font-medium text-gray-800">{orderInfo.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제금액</span>
              <span className="font-bold text-blue-600">{orderInfo.amount.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          주문 내역은 마이페이지에서 확인하실 수 있습니다.
        </p>

        <div className="flex gap-3">
          <Link
            to="/mypage"
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            주문내역 보기
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage

