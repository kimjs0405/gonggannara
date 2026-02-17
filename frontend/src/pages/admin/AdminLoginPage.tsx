import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff } from 'lucide-react'

const AdminLoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // 관리자 계정 정보
  const ADMIN_ID = 'gonggan8204'
  const ADMIN_PW = '1823310'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // 약간의 딜레이 (UX)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (username === ADMIN_ID && password === ADMIN_PW) {
      // 로그인 성공
      localStorage.setItem('adminLoggedIn', 'true')
      localStorage.setItem('adminLoginTime', Date.now().toString())
      navigate('/admin')
    } else {
      // 로그인 실패
      setError('아이디 또는 비밀번호가 일치하지 않습니다.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1E293B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-2xl">G</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white">공간나라</h1>
              <p className="text-xs text-gray-400">Admin System</p>
            </div>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-[#334155] rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white text-center mb-6">관리자 로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">아이디</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="관리자 아이디"
                  className="w-full h-12 pl-12 pr-4 bg-[#1E293B] border border-[#475569] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full h-12 pl-12 pr-12 bg-[#1E293B] border border-[#475569] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-600/50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2024 공간나라. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage

