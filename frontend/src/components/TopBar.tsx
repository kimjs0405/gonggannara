import { Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // 초기 세션 확인
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      if (session) {
        localStorage.setItem('userLoggedIn', 'true')
      }
    }
    checkSession()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      if (session) {
        localStorage.setItem('userLoggedIn', 'true')
      } else {
        localStorage.removeItem('userLoggedIn')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('userLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    navigate('/')
  }

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
            
            {isLoggedIn ? (
              <>
                <Link to="/mypage" className="hover:text-white transition-colors">
                  마이페이지
                </Link>
                <span className="text-gray-600">|</span>
                <button onClick={handleLogout} className="hover:text-white transition-colors">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-white transition-colors">
                  로그인
                </Link>
                <span className="text-gray-600">|</span>
                <Link to="/signup" className="hover:text-white transition-colors">
                  회원가입
                </Link>
              </>
            )}
            
            <span className="text-gray-600">|</span>
            <Link 
              to={isLoggedIn ? "/cart" : "/login"} 
              className="hover:text-white transition-colors"
            >
              장바구니
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
