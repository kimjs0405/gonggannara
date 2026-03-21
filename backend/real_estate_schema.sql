-- 공간나라 부동산 매물 스키마
-- Supabase SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS real_estate_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT '매매', -- 매매, 전세, 월세
  area VARCHAR(100) NOT NULL,
  address TEXT,
  price BIGINT,
  deposit BIGINT,
  monthly_rent BIGINT,
  tag VARCHAR(30) DEFAULT '추천',
  image_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE real_estate_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Real estate listings are viewable by everyone" ON real_estate_listings;
CREATE POLICY "Real estate listings are viewable by everyone"
  ON real_estate_listings
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Real estate listings can be inserted" ON real_estate_listings;
CREATE POLICY "Real estate listings can be inserted"
  ON real_estate_listings
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Real estate listings can be updated" ON real_estate_listings;
CREATE POLICY "Real estate listings can be updated"
  ON real_estate_listings
  FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Real estate listings can be deleted" ON real_estate_listings;
CREATE POLICY "Real estate listings can be deleted"
  ON real_estate_listings
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_real_estate_listings_area ON real_estate_listings(area);
CREATE INDEX IF NOT EXISTS idx_real_estate_listings_type ON real_estate_listings(type);
CREATE INDEX IF NOT EXISTS idx_real_estate_listings_active ON real_estate_listings(is_active);
