import { useState } from 'react'
import { 
  Store, 
  Bell, 
  CreditCard, 
  Truck, 
  Shield,
  Save,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('store')
  const [saved, setSaved] = useState(false)

  const [storeSettings, setStoreSettings] = useState({
    storeName: '공간나라',
    storeDescription: '당신의 공간을 더 특별하게',
    businessNumber: '123-45-67890',
    ceoName: '홍길동',
    email: 'contact@gonggan.com',
    phone: '02-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    businessHours: '평일 09:00 - 18:00',
  })

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 50000,
    defaultShippingFee: 3000,
    jejuShippingFee: 5000,
    mountainShippingFee: 8000,
    estimatedDeliveryDays: 3,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderNotification: true,
    reviewNotification: true,
    lowStockNotification: true,
    marketingEmail: false,
  })

  const handleSave = () => {
    // 실제로는 Supabase에 저장
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'store', label: '쇼핑몰 정보', icon: Store },
    { id: 'shipping', label: '배송 설정', icon: Truck },
    { id: 'payment', label: '결제 설정', icon: CreditCard },
    { id: 'notification', label: '알림 설정', icon: Bell },
    { id: 'security', label: '보안 설정', icon: Shield },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">설정</h1>
          <p className="text-sm text-gray-500 mt-1">쇼핑몰 운영에 필요한 설정을 관리합니다.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          저장
        </button>
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          설정이 저장되었습니다.
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6">
          {/* Store Settings */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 pb-4 border-b border-gray-100">쇼핑몰 정보</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Store className="w-4 h-4 inline mr-1" />
                    쇼핑몰 이름
                  </label>
                  <input
                    type="text"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">대표자명</label>
                  <input
                    type="text"
                    value={storeSettings.ceoName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, ceoName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">쇼핑몰 소개</label>
                <textarea
                  value={storeSettings.storeDescription}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
                <input
                  type="text"
                  value={storeSettings.businessNumber}
                  onChange={(e) => setStoreSettings({ ...storeSettings, businessNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    이메일
                  </label>
                  <input
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    연락처
                  </label>
                  <input
                    type="text"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  사업장 주소
                </label>
                <input
                  type="text"
                  value={storeSettings.address}
                  onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  영업시간
                </label>
                <input
                  type="text"
                  value={storeSettings.businessHours}
                  onChange={(e) => setStoreSettings({ ...storeSettings, businessHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 pb-4 border-b border-gray-100">배송 설정</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">무료배송 기준금액</label>
                <div className="relative">
                  <input
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">이 금액 이상 구매 시 무료배송</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">기본 배송비</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={shippingSettings.defaultShippingFee}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, defaultShippingFee: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제주 배송비</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={shippingSettings.jejuShippingFee}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, jejuShippingFee: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">산간지역 배송비</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={shippingSettings.mountainShippingFee}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, mountainShippingFee: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예상 배송기간</label>
                <div className="relative w-48">
                  <input
                    type="number"
                    value={shippingSettings.estimatedDeliveryDays}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDeliveryDays: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">일</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 pb-4 border-b border-gray-100">결제 설정</h2>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">토스페이먼츠</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">연동됨</span>
                </div>
                <p className="text-sm text-blue-600">신용카드, 가상계좌 결제가 활성화되어 있습니다.</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">결제 수단</h3>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">신용카드</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">가상계좌</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">실시간 계좌이체</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">무통장입금</span>
                </label>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notification' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 pb-4 border-b border-gray-100">알림 설정</h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">새 주문 알림</p>
                    <p className="text-sm text-gray-500">새로운 주문이 들어오면 알림을 받습니다.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.orderNotification}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, orderNotification: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">새 리뷰 알림</p>
                    <p className="text-sm text-gray-500">새로운 리뷰가 작성되면 알림을 받습니다.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.reviewNotification}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, reviewNotification: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">재고 부족 알림</p>
                    <p className="text-sm text-gray-500">상품 재고가 부족하면 알림을 받습니다.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.lowStockNotification}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockNotification: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">마케팅 이메일</p>
                    <p className="text-sm text-gray-500">프로모션 및 업데이트 소식을 받습니다.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.marketingEmail}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, marketingEmail: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 pb-4 border-b border-gray-100">보안 설정</h2>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">관리자 비밀번호 변경</h3>
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">현재 비밀번호</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">새 비밀번호</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">새 비밀번호 확인</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
                    비밀번호 변경
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">로그인 기록</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>마지막 로그인: {new Date().toLocaleString('ko-KR')}</p>
                  <p>IP 주소: 127.0.0.1</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

