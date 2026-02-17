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
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <Link to="/" className="mb-3 md:mb-4 inline-block">
              <img src="/logo.svg" alt="공간나라" className="h-8 md:h-10 brightness-0 invert" />
            </Link>
            <div className="space-y-0.5 md:space-y-1 text-xs md:text-sm text-gray-400 mb-4 md:mb-5">
              <p>상호: 개성종합네트웍스</p>
              <p>대표: 김준서</p>
              <p>사업자등록번호: 289-70-00760</p>
              <p className="flex items-start gap-1">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>서울특별시 관악구 신림동 257-13 1층 대원빌딩</span>
              </p>
            </div>
            <div className="space-y-1 md:space-y-1.5">
              <a href="tel:02-875-8204" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-lg md:text-xl font-black text-blue-400">02-875-8204</span>
              </a>
              <p className="text-[10px] md:text-xs text-gray-500">평일 09:00 ~ 18:00</p>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@gonggannara.co.kr</span>
              </div>
            </div>
          </div>

          {/* Links - Hidden on mobile, show as accordion or simplified */}
          {footerLinks.map((section, index) => (
            <div key={index} className="hidden md:block">
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

        {/* Mobile Quick Links */}
        <div className="md:hidden mt-6 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <Link to="/products" className="py-2 text-gray-400 hover:text-white">전체상품</Link>
            <Link to="/estimate" className="py-2 text-gray-400 hover:text-white">견적문의</Link>
            <Link to="/faq" className="py-2 text-gray-400 hover:text-white">FAQ</Link>
            <Link to="/about" className="py-2 text-gray-400 hover:text-white">회사소개</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1200px] mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-gray-500">
              <Link to="/terms" className="hover:text-white transition-colors">이용약관</Link>
              <span>|</span>
              <Link to="/privacy" className="hover:text-white transition-colors font-bold">개인정보처리방침</Link>
              <span>|</span>
              <Link to="/guide" className="hover:text-white transition-colors">이용안내</Link>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500">
              © 2024 공간나라. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
