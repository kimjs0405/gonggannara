import { Mail, MapPin, Download, Upload, CreditCard, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      {/* 고객센터 / 파일업로드 / 입금계좌 섹션 */}
      <div className="border-b">
        <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* 고객센터 이용안내 */}
            <div className="border-r-0 md:border-r border-gray-200 pr-0 md:pr-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">고객센터 이용안내</h3>
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">대표전화</p>
                  <a href="tel:02-875-8204" className="text-2xl md:text-3xl font-black text-blue-600">
                    02-875-8204
                  </a>
                </div>
                <div className="flex-1 text-xs text-gray-600 space-y-0.5">
                  <p>운영시간 09:00~18:00</p>
                  <p>점심시간 12:00~13:00</p>
                  <p className="text-gray-400">주말 및 공휴일 휴무</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href="mailto:GongganWord@gmail.com" className="text-blue-600 hover:underline">
                    GongganWord@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* 파일업로드/다운로드 */}
            <div className="border-r-0 md:border-r border-gray-200 pr-0 md:pr-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">파일업로드/다운로드</h3>
              <div className="space-y-3">
                <a href="mailto:GongganWord@gmail.com" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">이메일로 파일올리기</p>
                    <p className="text-xs text-gray-500">견적 및 도면 파일 전송</p>
                  </div>
                </a>
                <Link to="/downloads" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">자료 다운로드</p>
                    <p className="text-xs text-gray-500">카탈로그, 시공 가이드</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* 입금계좌 */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">입금계좌</h3>
              <div className="space-y-2">
                <img src="/KBbank.png" alt="국민은행" className="h-6 w-auto" />
                <p className="text-xl font-bold text-gray-800">51840101405665</p>
                <p className="text-xs text-gray-500">예금주 : 개성종합네트웍스</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="py-2 px-3 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  카드결제
                </button>
                <button className="py-2 px-3 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  영수증 출력
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 링크 바 */}
      <div className="border-b bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm">
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">회사소개</Link>
            <span className="text-gray-300">|</span>
            <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">이용약관</Link>
            <span className="text-gray-300">|</span>
            <Link to="/privacy" className="text-gray-800 font-bold hover:text-blue-600 transition-colors">개인정보처리방침</Link>
            <span className="text-gray-300">|</span>
            <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">고객센터</Link>
            <span className="text-gray-300">|</span>
            <Link to="/guide" className="text-gray-600 hover:text-blue-600 transition-colors">이용안내</Link>
            <span className="text-gray-300">|</span>
            <Link to="/location" className="text-gray-600 hover:text-blue-600 transition-colors">오시는 길</Link>
          </div>
        </div>
      </div>

      {/* 사업자 정보 */}
      <div className="bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            {/* 로고 */}
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.svg" alt="공간나라" className="h-8 md:h-10" />
            </Link>

            {/* 사업자 정보 */}
            <div className="flex-1 text-xs text-gray-500 space-y-1">
              <p>
                <span className="font-medium text-gray-700">개성종합네트웍스</span>
                <span className="mx-2">|</span>
                사업자등록번호 : 289-70-00760
                <span className="mx-2">|</span>
                대표 : 김준서
                <span className="mx-2">|</span>
                통신판매업신고 : 제2024-서울관악-0001호
              </p>
              <p className="flex items-start gap-1">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>서울특별시 관악구 신림동 257-13 1층 대원빌딩</span>
                <span className="mx-2">|</span>
                <span>TEL : 02-875-8204</span>
                <span className="mx-2">|</span>
                <span>FAX : 02-875-8205</span>
                <span className="mx-2">|</span>
                <span>이메일 : GongganWord@gmail.com</span>
              </p>
              <p className="pt-2 text-gray-400">
                COPYRIGHT © 공간나라. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
