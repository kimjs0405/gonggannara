-- 방문자 통계 테이블 스키마
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- 방문자 통계 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS visitor_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_date DATE NOT NULL UNIQUE,
  visitor_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS 정책
-- ============================================

-- 방문자 통계: 모든 사용자 읽기 가능
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitor stats are viewable by everyone" ON visitor_stats 
  FOR SELECT USING (true);

-- service_role은 모든 작업 가능
CREATE POLICY "Allow service_role to manage visitor_stats" ON visitor_stats
  FOR ALL USING (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_stats(visit_date DESC);

-- ============================================
-- 함수: 방문자 수 증가
-- ============================================
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS INTEGER AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  current_count INTEGER;
BEGIN
  -- 오늘 날짜의 레코드가 있는지 확인
  SELECT visitor_count INTO current_count
  FROM visitor_stats
  WHERE visit_date = today_date;
  
  IF current_count IS NULL THEN
    -- 오늘 날짜 레코드가 없으면 새로 생성
    INSERT INTO visitor_stats (visit_date, visitor_count)
    VALUES (today_date, 1)
    ON CONFLICT (visit_date) DO UPDATE
    SET visitor_count = visitor_stats.visitor_count + 1,
        updated_at = NOW();
    RETURN 1;
  ELSE
    -- 있으면 카운트 증가
    UPDATE visitor_stats
    SET visitor_count = visitor_count + 1,
        updated_at = NOW()
    WHERE visit_date = today_date;
    RETURN current_count + 1;
  END IF;
END;
$$ LANGUAGE plpgsql;
