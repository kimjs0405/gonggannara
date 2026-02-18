const CategoryIcons = () => {
  const categories = [
    { name: '소파', icon: '🛋️', color: 'bg-orange-50' },
    { name: '침대', icon: '🛏️', color: 'bg-blue-50' },
    { name: '조명', icon: '💡', color: 'bg-yellow-50' },
    { name: '의자', icon: '🪑', color: 'bg-amber-50' },
    { name: '책상', icon: '🖥️', color: 'bg-gray-50' },
    { name: '수납장', icon: '🗄️', color: 'bg-purple-50' },
    { name: '커튼', icon: '🪟', color: 'bg-pink-50' },
    { name: '러그', icon: '🧶', color: 'bg-red-50' },
    { name: '시계', icon: '🕰️', color: 'bg-teal-50' },
    { name: '액자', icon: '🖼️', color: 'bg-indigo-50' },
    { name: '화분', icon: '🪴', color: 'bg-green-50' },
    { name: '신상품', icon: '🆕', color: 'bg-rose-50', isNew: true },
  ]

  return (
    <div className="bg-white py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Promotion Banner */}
          <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white w-32 h-24 flex flex-col justify-center">
            <p className="text-xs opacity-90">공간나라</p>
            <p className="font-bold text-sm">이달의 혜택</p>
            <p className="text-[10px] mt-1 opacity-80">인테리어를<br/>공간나라에서!</p>
          </div>

          {/* Category Icons Grid */}
          <div className="flex-1 grid grid-cols-12 gap-2">
            {categories.map((category, index) => (
              <a
                key={index}
                href="#"
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:shadow-md transition-all group"
              >
                <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform relative`}>
                  {category.icon}
                  {category.isNew && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                      N
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-700 font-medium">{category.name}</span>
              </a>
            ))}
          </div>

          {/* Guide Banner */}
          <div className="flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white w-32 h-24 flex flex-col justify-center cursor-pointer hover:shadow-lg transition-shadow">
            <p className="text-xs opacity-90">이용가이드</p>
            <p className="font-bold text-sm">주문방법</p>
            <p className="text-[10px] mt-1 opacity-80 flex items-center gap-1">
              자세히보기 →
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryIcons

