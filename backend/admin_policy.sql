-- 관리자용 RLS 정책 추가
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- 관리자 접근을 위한 정책 (읽기/쓰기 모두 허용)
-- 주의: 실제 운영에서는 관리자 인증 로직 추가 필요
-- ============================================

-- 상품 테이블: 모든 작업 허용 (관리자용)
DROP POLICY IF EXISTS "Active products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products can be inserted" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products can be updated" ON products FOR UPDATE USING (true);
CREATE POLICY "Products can be deleted" ON products FOR DELETE USING (true);

-- 주문 테이블: 모든 읽기 허용 (관리자용)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Orders are viewable by everyone" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders can be updated" ON orders FOR UPDATE USING (true);

-- 주문 상세: 모든 읽기 허용 (관리자용)
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Order items are viewable by everyone" ON order_items FOR SELECT USING (true);

-- 프로필: 모든 읽기 허용 (관리자용)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles can be updated by admin" ON profiles FOR UPDATE USING (true);

-- 카테고리: 모든 작업 허용
CREATE POLICY "Categories can be inserted" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Categories can be updated" ON categories FOR UPDATE USING (true);
CREATE POLICY "Categories can be deleted" ON categories FOR DELETE USING (true);

