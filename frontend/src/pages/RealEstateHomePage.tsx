import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, MapPin, Home, Landmark, Phone, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

const defaultAreas = [
  { name: '서울 관악구', count: '매물 42' },
  { name: '서울 동작구', count: '매물 31' },
  { name: '서울 영등포구', count: '매물 28' },
  { name: '서울 금천구', count: '매물 19' },
]

const fallbackListings = [
  { title: '신림역 도보 5분, 올수리 2룸', price: 380000000, type: '매매', tag: '추천', area: '서울 관악구', deposit: null, monthly_rent: null },
  { title: '봉천동 신축 오피스텔, 역세권', price: 240000000, type: '매매', tag: '신규', area: '서울 관악구', deposit: null, monthly_rent: null },
  { title: '서울대입구역 인근 상가 1층', price: null, type: '월세', tag: '급매', area: '서울 관악구', deposit: 30000000, monthly_rent: 1800000 },
  { title: '관악구 단독주택 리모델링 완료', price: 720000000, type: '매매', tag: '인기', area: '서울 관악구', deposit: null, monthly_rent: null },
]

const serviceSteps = [
  { title: '1:1 상담 접수', desc: '원하시는 지역과 예산을 알려주세요.' },
  { title: '맞춤 매물 제안', desc: '조건에 맞는 매물을 선별해 안내해드립니다.' },
  { title: '현장 동행 투어', desc: '실매물 확인부터 체크포인트를 함께 봅니다.' },
  { title: '계약/입주 지원', desc: '계약 검토와 일정 조율까지 도와드립니다.' },
]

const RealEstateHomePage = () => {
  const [listings, setListings] = useState<any[]>([])
  const [loadingListings, setLoadingListings] = useState(true)

  useEffect(() => {
    document.title = '공간나라부동산 - 지역 맞춤 매물'
    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', '공간나라부동산에서 지역 기반 실매물과 맞춤 중개 상담을 받아보세요.')
  }, [])

  useEffect(() => {
    const fetchListings = async () => {
      setLoadingListings(true)
      try {
        const { data, error } = await supabase
          .from('real_estate_listings')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8)

        if (!error && data && data.length > 0) {
          setListings(data)
        } else {
          setListings(fallbackListings)
        }
      } catch (_error) {
        setListings(fallbackListings)
      } finally {
        setLoadingListings(false)
      }
    }

    fetchListings()
  }, [])

  const areas = useMemo(() => {
    if (listings.length === 0) return defaultAreas
    const areaCount = listings.reduce((acc: Record<string, number>, item: any) => {
      const key = item.area || item.region || '기타'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return Object.entries(areaCount)
      .slice(0, 4)
      .map(([name, count]) => ({ name, count: `매물 ${count}` }))
  }, [listings])

  const formatPrice = (item: any) => {
    if (item.type === '월세' && item.deposit && item.monthly_rent) {
      return `보증금 ${(item.deposit / 10000).toLocaleString()} / 월 ${(item.monthly_rent / 10000).toLocaleString()}`
    }
    if (item.price) {
      return `${Math.floor(item.price / 10000).toLocaleString()}만원`
    }
    return '가격 문의'
  }

  return (
    <div className="bg-white">
      <section className="py-4 md:py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="relative overflow-hidden border border-gray-200 bg-gradient-to-r from-slate-800 to-blue-700 text-white">
            <div className="p-6 md:p-12">
              <p className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/15 px-3 py-1.5 rounded-full mb-4">
                <Building2 className="w-4 h-4" />
                공간나라부동산
              </p>
              <h1 className="text-2xl md:text-4xl font-black leading-tight">
                지역 기반 맞춤 매물,
                <br />
                공간나라부동산에서 시작하세요
              </h1>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-white/80">
                실매물 중심으로 주거/상가/사무실까지 빠르게 제안합니다.
              </p>
              <div className="mt-6 flex flex-col md:flex-row gap-3">
                <a
                  href="tel:02-875-8204"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-800 font-bold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  상담전화 02-875-8204
                </a>
                <Link
                  to="/interior"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/60 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                >
                  인테리어 홈 보기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">지역별 주요 매물</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {areas.map((area) => (
              <div key={area.name} className="border border-gray-200 p-4 md:p-5 hover:border-blue-400 transition-colors">
                <p className="flex items-center gap-2 text-sm md:text-base font-bold text-gray-800">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {area.name}
                </p>
                <p className="mt-2 text-sm text-gray-500">{area.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">추천 매물</h2>
          {loadingListings ? (
            <div className="text-center py-10 text-gray-500">매물 정보를 불러오는 중입니다...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.slice(0, 4).map((item) => (
              <article key={item.title} className="bg-white border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700">{item.tag || '추천'}</span>
                  <span className="text-xs text-gray-500">{item.type}</span>
                </div>
                <h3 className="mt-3 text-base md:text-lg font-bold text-gray-900">{item.title || item.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{item.area || item.region || '지역 정보 준비중'}</p>
                <p className="mt-2 text-sm md:text-base text-blue-700 font-bold">{formatPrice(item)}</p>
              </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">중개 진행 프로세스</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            {serviceSteps.map((step, idx) => (
              <div key={step.title} className="border border-gray-200 p-4 md:p-5">
                <p className="text-xs text-blue-600 font-bold mb-2">STEP {idx + 1}</p>
                <h3 className="text-sm md:text-base font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-xs md:text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">공간나라는 인테리어와 부동산을 함께 제안합니다</h2>
          <p className="mt-3 text-sm md:text-base text-gray-600">매물 탐색 후 인테리어 상담까지 한 번에 연결해드립니다.</p>
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-3">
            <Link to="/interior" className="px-6 py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              공간나라인테리어
            </Link>
            <a href="tel:02-875-8204" className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-colors inline-flex items-center justify-center gap-2">
              <Landmark className="w-4 h-4" />
              부동산 상담 연결
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RealEstateHomePage
