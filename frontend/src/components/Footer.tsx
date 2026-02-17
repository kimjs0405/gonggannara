import { Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const footerLinks = [
    {
      title: '쇼핑안내',
      links: [
        { name: '전체상품', path: '/products' },
        { name: '베스트상품', path: '/products?sort=best' },
        { name: '신상품', path: '/products?sort=new' },
        { name: '특가상품', path: '/products?sort=sale' },
      ],
    },
    {
      title: '인테리어',
      links: [
        { name: '견적문의', path: '/estimate' },
        { name: '포트폴리오', path: '/portfolio' },
        { name: '시공절차', path: '/process' },
        { name: '고객후기', path: '/reviews' },
      ],
    },
    {
      title: '고객지원',
      links: [
        { name: '자주묻는질문', path: '/faq' },
        { name: '1:1 문의', path: '/inquiry' },
        { name: '주문/배송조회', path: '/orders' },
        { name: '회사소개', path: '/about' },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">G</span>
              </div>
              <div>
                <h3 className="text-lg font-black">공간나라</h3>
                <p className="text-[10px] text-gray-400">인테리어 & 쇼핑몰</p>
              </div>
            </Link>
            <div className="space-y-1 text-sm text-gray-400 mb-5">
              <p>상호: 개성종합네트웍스</p>
              <p>대표: 김준서</p>
              <p>사업자등록번호: 289-70-00760</p>
              <p className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                서울특별시 관악구 신림동 257-13 1층 대원빌딩
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-xl font-black text-blue-400">02-875-8204</span>
              </div>
              <p className="text-xs text-gray-500">평일 09:00 ~ 18:00</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@gonggannara.co.kr</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold mb-3 text-white">{section.title}</h4>
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
              <Link to="/guide" className="hover:text-white transition-colors">이용안내</Link>
            </div>
            <p className="text-xs text-gray-500">
              Copyright © 2024 공간나라. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
