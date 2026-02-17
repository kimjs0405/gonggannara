import { Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const footerLinks = [
    {
      title: '고객서비스',
      links: [
        { name: '자주하는 질문', path: '/faq' },
        { name: '1:1 문의', path: '/inquiry' },
        { name: '주문/배송조회', path: '/orders' },
        { name: '취소/반품/교환', path: '/returns' },
      ],
    },
    {
      title: '쇼핑정보',
      links: [
        { name: '베스트 상품', path: '/products?sort=best' },
        { name: '신상품', path: '/products?sort=new' },
        { name: '이벤트', path: '/events' },
        { name: '쿠폰존', path: '/coupons' },
      ],
    },
    {
      title: '회사정보',
      links: [
        { name: '회사소개', path: '/about' },
        { name: '인테리어 컨설팅', path: '/consulting' },
        { name: '제휴문의', path: '/partnership' },
        { name: '채용정보', path: '/careers' },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">G</span>
              </div>
              <div>
                <h3 className="text-xl font-black">공간나라</h3>
                <p className="text-xs text-gray-400">인테리어 전문 쇼핑몰</p>
              </div>
            </Link>
            <div className="space-y-1.5 text-sm text-gray-400 mb-6">
              <p>상호: (주)공간나라</p>
              <p>대표: 홍길동</p>
              <p>사업자등록번호: 123-45-67890</p>
              <p>통신판매업신고: 제2024-서울강남-1234호</p>
              <p className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                서울특별시 강남구 테헤란로 123
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-2xl font-black text-blue-400">1577-2288</span>
              </div>
              <p className="text-xs text-gray-500">평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>cs@gonggannara.co.kr</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link to="/terms" className="hover:text-white transition-colors">이용약관</Link>
              <span>|</span>
              <Link to="/privacy" className="hover:text-white transition-colors font-bold">개인정보처리방침</Link>
              <span>|</span>
              <Link to="/email-policy" className="hover:text-white transition-colors">이메일무단수집거부</Link>
            </div>
            <p className="text-xs text-gray-500">
              Copyright © 2024 공간나라. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center gap-8">
            {[
              { icon: '🏆', title: '품질인증', sub: 'ISO 9001' },
              { icon: '🛡️', title: '안전결제', sub: 'PG인증' },
              { icon: '📦', title: '정품보장', sub: '100% 정품' },
              { icon: '⭐', title: '고객만족', sub: '4.9점' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-lg">
                  {item.icon}
                </div>
                <div className="text-xs text-gray-400">
                  <p className="font-medium text-white">{item.title}</p>
                  <p>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

