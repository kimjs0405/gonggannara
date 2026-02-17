import { Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const TopBar = () => {
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-8 text-xs">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <span className="text-gray-300">
              <span className="font-bold text-white">공간나라</span> - 인테리어 용품 쇼핑몰 & 시공 전문
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 text-gray-300">
            <a 
              href="tel:02-875-8204" 
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone size={11} />
              <span>02-875-8204</span>
            </a>
            <span className="text-gray-600">|</span>
            <Link to="/login" className="hover:text-white transition-colors">
              로그인
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/signup" className="hover:text-white transition-colors">
              회원가입
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/mypage" className="hover:text-white transition-colors">
              마이페이지
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/cart" className="hover:text-white transition-colors">
              장바구니
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
