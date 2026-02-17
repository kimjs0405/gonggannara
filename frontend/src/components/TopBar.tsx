import { Headphones, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const TopBar = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-9 text-xs">
          {/* Left side */}
          <div className="flex items-center gap-2">
            <span className="text-gray-700">
              <span className="font-bold text-blue-600">공간나라</span>는{' '}
              <span className="text-blue-600 font-medium">인테리어 전문 기업</span> 입니다
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full text-[10px] text-gray-600 cursor-pointer hover:bg-gray-300">
              GO
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 text-gray-600">
            <Link to="/login" className="hover:text-blue-600 transition-colors">
              로그인
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/signup" className="hover:text-blue-600 transition-colors">
              회원가입
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/mypage" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              마이페이지 <span className="text-[10px]">▼</span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/support" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Headphones size={12} />
              고객센터
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/faq" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
              <HelpCircle size={12} />
              자주하는 질문
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar

