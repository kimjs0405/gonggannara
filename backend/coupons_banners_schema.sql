-- 쿠폰 및 배너 테이블 추가 스키마
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- 쿠폰 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  discount_type VARCHAR(10) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER DEFAULT 0,
  max_discount INTEGER,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 배너 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS 정책
-- ============================================

-- 쿠폰: 모든 사용자 읽기 가능 (활성화된 쿠폰만)
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active coupons are viewable by everyone" ON coupons 
  FOR SELECT USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- service_role은 모든 작업 가능
CREATE POLICY "Allow service_role to manage coupons" ON coupons
  FOR ALL USING (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- 배너: 모든 사용자 읽기 가능 (활성화된 배너만)
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active banners are viewable by everyone" ON banners 
  FOR SELECT USING (is_active = true);

-- service_role은 모든 작업 가능
CREATE POLICY "Allow service_role to manage banners" ON banners
  FOR ALL USING (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);

-- ============================================
-- 샘플 데이터
-- ============================================

-- 샘플 쿠폰
INSERT INTO coupons (code, name, discount_type, discount_value, min_order_amount, max_discount, start_date, end_date, usage_limit, is_active)
VALUES 
  ('WELCOME10', '신규가입 10% 할인', 'percent', 10, 30000, 10000, '2024-01-01', '2025-12-31', 1000, true),
  ('SPRING2024', '봄맞이 특별할인', 'fixed', 5000, 50000, NULL, '2024-03-01', '2024-05-31', 500, true),
  ('VIP20', 'VIP 회원 20% 할인', 'percent', 20, 100000, 50000, '2024-01-01', '2025-12-31', NULL, true);

-- 샘플 배너
INSERT INTO banners (title, subtitle, image_url, link_url, position, is_active)
VALUES 
  ('2024 봄맞이 대세일', '최대 50% 할인 이벤트', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop', '/products?sale=true', 1, true),
  ('새로운 소파 컬렉션', '편안함을 디자인하다', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&h=400&fit=crop', '/products?category=sofa', 2, true),
  ('무료배송 이벤트', '5만원 이상 구매시', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=400&fit=crop', '/products', 3, true);

