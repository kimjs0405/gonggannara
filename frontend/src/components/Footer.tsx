import { Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const footerLinks = [
    {
      title: '서비스',
      links: [
        { name: '거실 인테리어', path: '/services/living' },
        { name: '주방 인테리어', path: '/services/kitchen' },
        { name: '침실 인테리어', path: '/services/bedroom' },
        { name: '리모델링', path: '/services/remodeling' },
      ],
    },
    {
      title: '고객지원',
      links: [
        { name: '견적문의', path: '/estimate' },
        { name: '자주 묻는 질문', path: '/faq' },
        { name: '시공 절차 안내', path: '/process' },
        { name: '1:1 문의', path: '/inquiry' },
      ],
    },
    {
      title: '회사정보',
      links: [
        { name: '회사소개', path: '/about' },
        { name: '포트폴리오', path: '/portfolio' },
        { name: '고객후기', path: '/reviews' },
        { name: '오시는 길', path: '/location' },
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
                <p className="text-xs text-gray-400">인테리어 전문 시공업체</p>
              </div>
            </Link>
            <div className="space-y-1.5 text-sm text-gray-400 mb-6">
              <p>상호: 공간나라 인테리어</p>
              <p>대표: 김대표</p>
              <p>사업자등록번호: 123-45-67890</p>
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
              <p className="text-xs text-gray-500">평일 09:00 ~ 18:00 (주말 상담 가능)</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@gonggannara.co.kr</span>
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
            </div>
            <p className="text-xs text-gray-500">
              Copyright © 2024 공간나라. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center gap-12">
            {[
              { title: '20년 경력', sub: '인테리어 전문' },
              { title: '무료 상담', sub: '방문 견적' },
              { title: '책임 시공', sub: '하자 보수 보장' },
              { title: '고객 만족', sub: '평점 4.9' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
