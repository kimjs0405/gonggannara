-- 설정 테이블 스키마
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- 설정 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS 정책
-- ============================================

-- 설정: 모든 사용자 읽기 가능
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by everyone" ON settings 
  FOR SELECT USING (true);

-- service_role은 모든 작업 가능
CREATE POLICY "Allow service_role to manage settings" ON settings
  FOR ALL USING (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ============================================
-- 기본 설정 데이터
-- ============================================
INSERT INTO settings (key, value) VALUES
  ('store', '{
    "storeName": "공간나라",
    "storeDescription": "당신의 공간을 더 특별하게",
    "businessNumber": "",
    "ceoName": "",
    "email": "GongganWord@gmail.com",
    "phone": "",
    "address": "",
    "businessHours": "평일 09:00 - 18:00"
  }'::jsonb),
  ('shipping', '{
    "freeShippingThreshold": 50000,
    "defaultShippingFee": 3000,
    "jejuShippingFee": 5000,
    "mountainShippingFee": 8000,
    "estimatedDeliveryDays": 3
  }'::jsonb),
  ('notification', '{
    "orderNotification": true,
    "reviewNotification": true,
    "lowStockNotification": true,
    "marketingEmail": false
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;
