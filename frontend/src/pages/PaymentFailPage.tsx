import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'

const PaymentFailPage = () => {
  const [searchParams] = useSearchParams()
  const errorCode = searchParams.get('code') || ''
  const errorMessage = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.'

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">결제에 실패했습니다</h1>
        <p className="text-gray-500 mb-6">{errorMessage}</p>

        {errorCode && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">오류 코드: {errorCode}</p>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-6">
          결제 정보를 확인하신 후 다시 시도해주세요.<br />
          문제가 계속되면 고객센터로 문의해주세요.
        </p>

        <div className="flex gap-3">
          <Link
            to="/cart"
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            장바구니로
          </Link>
          <a
            href="tel:02-875-8204"
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            고객센터 연결
          </a>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailPage

