-- 광고 슬라이드 테이블 스키마
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- 광고 슬라이드 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS ad_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  slide_group VARCHAR(50) NOT NULL CHECK (slide_group IN ('group1', 'group2')), -- group1 또는 group2
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 이벤트 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS 정책
-- ============================================

-- 광고 슬라이드: 모든 사용자 읽기 가능 (활성화된 슬라이드만)
ALTER TABLE ad_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active ad slides are viewable by everyone" ON ad_slides 
  FOR SELECT USING (is_active = true);

-- 이벤트: 모든 사용자 읽기 가능 (활성화된 이벤트만)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active events are viewable by everyone" ON events 
  FOR SELECT USING (is_active = true);

-- service_role은 모든 작업 가능
CREATE POLICY "Allow service_role to manage ad_slides" ON ad_slides
  FOR ALL USING (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Allow service_role to manage events" ON events
  FOR ALL USING (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ad_slides_group ON ad_slides(slide_group);
CREATE INDEX IF NOT EXISTS idx_ad_slides_position ON ad_slides(position);
CREATE INDEX IF NOT EXISTS idx_ad_slides_active ON ad_slides(is_active);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
