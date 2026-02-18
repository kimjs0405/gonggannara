-- 프로모션 카드 테이블 스키마
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- 프로모션 카드 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS promotion_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link_url TEXT,
  background_color VARCHAR(50) DEFAULT 'from-pink-50 to-purple-50', -- Tailwind gradient 클래스
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS 정책
-- ============================================

-- 프로모션 카드: 모든 사용자 읽기 가능 (활성화된 카드만)
ALTER TABLE promotion_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active promotion cards are viewable by everyone" ON promotion_cards 
  FOR SELECT USING (is_active = true);

-- service_role은 모든 작업 가능
CREATE POLICY "Allow service_role to manage promotion_cards" ON promotion_cards
  FOR ALL USING (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_promotion_cards_position ON promotion_cards(position);
CREATE INDEX IF NOT EXISTS idx_promotion_cards_active ON promotion_cards(is_active);

-- ============================================
-- 샘플 데이터
-- ============================================

INSERT INTO promotion_cards (title, subtitle, image_url, link_url, background_color, position, is_active)
VALUES 
  ('공공기관 인기 판촉물', '관공서·공공기관에서 실제 구매한 인기 상품!', '', '/products?category=promotional', 'from-pink-50 to-purple-50', 1, true),
  ('굿즈 제작', '브랜드·맞춤·굿즈키트 특별한 순간을 위한 굿즈 제작!', '', '/products?category=goods', 'from-purple-50 to-indigo-50', 2, true);
