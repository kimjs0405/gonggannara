import { Award, Users, Clock, Shield, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  const strengths = [
    {
      icon: Clock,
      title: '20년 경력',
      desc: '2004년부터 인테리어 전문 업체로 오랜 경험과 노하우를 보유하고 있습니다.',
    },
    {
      icon: Users,
      title: '전문 인력',
      desc: '디자이너, 시공 전문가로 구성된 팀이 최상의 결과물을 만들어 드립니다.',
    },
    {
      icon: Shield,
      title: '책임 시공',
      desc: '시공 후에도 하자 보수를 책임지며, 고객 만족을 최우선으로 합니다.',
    },
    {
      icon: Award,
      title: '합리적 가격',
      desc: '거품 없는 합리적인 견적으로 최상의 품질을 제공합니다.',
    },
  ]

  const history = [
    { year: '2024', content: '고객 만족도 98% 달성' },
    { year: '2022', content: '인테리어 시공 2000건 돌파' },
    { year: '2018', content: '강남 본사 확장 이전' },
    { year: '2012', content: '상업공간 인테리어 사업 확대' },
    { year: '2008', content: '아파트 인테리어 전문화' },
    { year: '2004', content: '공간나라 설립' },
  ]

  return (
    <div className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-black text-gray-900 mb-4">회사소개</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            20년간 고객의 공간을 아름답게 만들어온 공간나라입니다.<br />
            정직한 견적과 책임 시공으로 신뢰를 쌓아왔습니다.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              "공간이 바뀌면 삶이 바뀝니다"
            </h2>
            <p className="text-blue-100 leading-relaxed">
              공간나라는 단순히 인테리어를 하는 것이 아니라, 고객님의 라이프스타일을 디자인합니다.
              매일 마주하는 공간이 편안하고 아름다워질 때, 삶의 질이 달라집니다.
              20년간의 경험과 노하우로 최고의 공간을 만들어 드리겠습니다.
            </p>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            공간나라의 강점
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {strengths.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-900 rounded-3xl p-12 mb-20">
          <div className="grid grid-cols-4 gap-8 text-center text-white">
            {[
              { number: '20+', label: '년 경력' },
              { number: '2,500+', label: '시공 실적' },
              { number: '98%', label: '고객 만족도' },
              { number: '4.9', label: '평균 평점' },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-4xl font-black text-blue-400 mb-2">{stat.number}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            연혁
          </h2>
          <div className="max-w-2xl mx-auto">
            {history.map((item, idx) => (
              <div key={idx} className="flex gap-6 pb-8 last:pb-0">
                <div className="w-20 text-right">
                  <span className="font-bold text-blue-600">{item.year}</span>
                </div>
                <div className="relative flex-1 pb-8 border-l-2 border-gray-200 pl-6 last:border-0">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full" />
                  <p className="text-gray-700">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="font-bold text-xl text-gray-900 mb-6">오시는 길</h3>
            <div className="aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-gray-400">
              지도 영역
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>주소:</strong> 서울특별시 관악구 신림동 257-13 1층 대원빌딩</p>
              <p><strong>지하철:</strong> 2호선 신림역 도보 10분</p>
              <p><strong>주차:</strong> 건물 앞 주차 가능</p>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col justify-center">
            <h3 className="font-bold text-xl mb-4">무료 상담 신청</h3>
            <p className="text-blue-200 mb-6">
              전문 상담원이 친절하게 안내해 드립니다.<br />
              부담없이 문의주세요.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <Phone className="w-6 h-6" />
              <span className="text-3xl font-black">02-875-8204</span>
            </div>
            <Link
              to="/estimate"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              온라인 견적문의
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

