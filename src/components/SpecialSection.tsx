const SpecialSection = () => {
  return (
    <div className="bg-white py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-2 gap-6">
          {/* 굿즈 제작 섹션 */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-600 font-medium mb-2">맞춤 인테리어</p>
              <h3 className="text-2xl font-black text-gray-800 mb-3">공간 디자인 컨설팅</h3>
              <p className="text-gray-600 text-sm mb-4">
                전문 디자이너가 직접 방문하여<br />
                고객님의 공간을 새롭게 꾸며드립니다
              </p>
              <a
                href="#"
                className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                상담 신청하기
              </a>
            </div>
            <div className="absolute right-4 bottom-4 text-[100px] opacity-30">
              🏠
            </div>
          </div>

          {/* 브랜드 파트너 */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-800 text-white text-[10px] rounded">PARTNER</span>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-3">프리미엄 브랜드</h3>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {['IKEA', 'Hanssem', 'Casamia', 'LG전자', 'Samsung', 'Dyson'].map((brand) => (
                  <div
                    key={brand}
                    className="bg-white rounded-lg py-2 px-3 text-center text-sm font-medium text-gray-600 hover:shadow-md cursor-pointer transition-shadow"
                  >
                    {brand}
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="inline-block mt-4 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                브랜드 전체보기 &gt;
              </a>
            </div>
          </div>
        </div>

        {/* 서비스 특징 */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { icon: '🚚', title: '무료배송', desc: '5만원 이상 구매시' },
            { icon: '🔧', title: '무료설치', desc: '대형가구 전문 설치' },
            { icon: '💰', title: '최저가 보장', desc: '차액 200% 보상' },
            { icon: '🔄', title: '30일 교환/반품', desc: '무료 반품 서비스' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-bold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpecialSection

