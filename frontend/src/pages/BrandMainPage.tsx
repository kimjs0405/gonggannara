import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Home, Building2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const BrandMainPage = () => {
  const [brand, setBrand] = useState({
    heroTitle: '공간나라',
    heroSubtitle: '인테리어와 부동산을 하나로 연결하는 공간 라이프 플랫폼',
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
          <div className="border border-gray-200 bg-gradient-to-r from-slate-900 to-blue-700 text-white p-7 md:p-12">
            <h1 className="text-3xl md:text-5xl font-black leading-tight">{brand.heroTitle}</h1>
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
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{brand.introTitle}</h2>
          <p className="mt-4 text-sm md:text-base text-gray-600">{brand.introDescription}</p>
        </div>
      </section>
    </div>
  )
}

export default BrandMainPage
