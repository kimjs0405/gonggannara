-- Supabase Storage 버킷 설정
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- Storage 버킷 생성
-- ============================================

-- 상품 이미지 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 배너 이미지 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  10485760,  -- 10MB (배너는 큰 이미지 필요)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 리뷰 이미지 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reviews',
  'reviews',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 프로필 이미지 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,  -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage RLS 정책
-- ============================================

-- products 버킷: 모든 사용자 읽기 가능, 관리자만 업로드/삭제
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admin can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Admin can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');

CREATE POLICY "Admin can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');

-- banners 버킷: 모든 사용자 읽기 가능, 관리자만 업로드/삭제
CREATE POLICY "Anyone can view banner images"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Admin can upload banner images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'banners');

CREATE POLICY "Admin can update banner images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'banners');

CREATE POLICY "Admin can delete banner images"
ON storage.objects FOR DELETE
USING (bucket_id = 'banners');

-- reviews 버킷: 모든 사용자 읽기 가능, 로그인 사용자 업로드 가능
CREATE POLICY "Anyone can view review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'reviews');

CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reviews' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own review images"
ON storage.objects FOR DELETE
USING (bucket_id = 'reviews' AND auth.uid()::text = (storage.foldername(name))[1]);

-- avatars 버킷: 모든 사용자 읽기 가능, 본인만 업로드/삭제
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

