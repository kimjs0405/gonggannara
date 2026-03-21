import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Home, Building2, CheckCircle2, Sparkles, Clock3, ShieldCheck, PhoneCall } from 'lucide-react'
import { supabase } from '../lib/supabase'

const BrandMainPage = () => {
  const [brand, setBrand] = useState({
    heroTitle: '공간나라',
    heroSubtitle: '종합부동산파트너 공간나라',
    interiorCta: '공간나라인테리어',
    realEstateCta: '공간나라부동산',
    introTitle: '당신의 공간 여정을 함께합니다',
    introDescription: '집을 찾는 순간부터 공간을 완성하는 순간까지, 공간나라가 한 번에 도와드립니다.',
  })

  useEffect(() => {
    document.title = '공간나라 - 브랜드 메인'
    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', '공간나라는 인테리어와 부동산 서비스를 통합 제공하는 공간 전문 브랜드입니다.')
  }, [])

  useEffect(() => {
    const fetchBrand = async () => {
      const { data } = await supabase.from('settings').select('value').eq('key', 'brand').single()
      if (data?.value) {
        setBrand((prev) => ({ ...prev, ...(data.value as any) }))
      }
    }
    fetchBrand()
  }, [])

  return (
    <div className="bg-white">
      <section className="py-10 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="border border-gray-200 bg-gradient-to-r from-slate-900 to-blue-700 text-white p-7 md:p-12 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-10 -bottom-20 w-56 h-56 rounded-full bg-blue-400/20 blur-2xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-1.5 text-xs md:text-sm bg-white/15 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                종합부동산파트너 공간나라
              </p>
              <h1 className="mt-4 text-3xl md:text-5xl font-black leading-tight">{brand.heroTitle}</h1>
              <p className="mt-4 text-sm md:text-lg text-white/85">{brand.heroSubtitle}</p>
              <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Link to="/interior" className="bg-white text-slate-900 px-5 py-4 font-bold flex items-center justify-between hover:bg-slate-100 transition-colors">
                  <span className="inline-flex items-center gap-2"><Home className="w-4 h-4" />{brand.interiorCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/realestate" className="bg-white/10 border border-white/40 text-white px-5 py-4 font-bold flex items-center justify-between hover:bg-white/20 transition-colors">
                  <span className="inline-flex items-center gap-2"><Building2 className="w-4 h-4" />{brand.realEstateCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
                <div className="bg-white/10 border border-white/20 px-3 py-2">통합 상담 시스템</div>
                <div className="bg-white/10 border border-white/20 px-3 py-2">현장 기반 제안</div>
                <div className="bg-white/10 border border-white/20 px-3 py-2">전문 파트너 연결</div>
                <div className="bg-white/10 border border-white/20 px-3 py-2">사후 관리 지원</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{brand.introTitle}</h2>
          <p className="mt-4 text-sm md:text-base text-gray-600">{brand.introDescription}</p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900">인테리어 서비스</h3>
              <p className="mt-2 text-sm text-gray-600">상품 구매부터 시공 매칭까지, 목적에 맞는 공간 솔루션을 제공합니다.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" />가구/소품/조명 큐레이션</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" />맞춤 견적 및 시공 연계</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" />포트폴리오 기반 제안</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900">부동산 서비스</h3>
              <p className="mt-2 text-sm text-gray-600">실매물 중심으로 매매/전세/월세를 조건에 맞춰 빠르게 연결합니다.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" />지역 기반 맞춤 매물 추천</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" />현장 동행 및 계약 지원</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" />입주 후 인테리어 연계</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">공간나라 강점</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <p className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-blue-600" />빠른 응답과 일정 조율</p>
                <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-600" />검증된 파트너 네트워크</p>
                <p className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-blue-600" />통합 상담 02-875-8204</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BrandMainPage
