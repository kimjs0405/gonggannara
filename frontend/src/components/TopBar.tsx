import { Phone, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const TopBar = () => {
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-9 text-xs">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              <span className="font-bold text-white">공간나라</span> - 20년 전통 인테리어 전문 기업
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 text-gray-300">
            <a 
              href="tel:1577-2288" 
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone size={12} />
              <span>1577-2288</span>
            </a>
            <span className="text-gray-600">|</span>
            <Link 
              to="/estimate" 
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <MessageCircle size={12} />
              <span>빠른 상담</span>
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/faq" className="hover:text-white transition-colors">
              자주 묻는 질문
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/location" className="hover:text-white transition-colors">
              오시는 길
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
