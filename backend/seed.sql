-- 공간나라 샘플 데이터
-- 스키마 생성 후 실행하세요

-- ============================================
-- 카테고리 데이터
-- ============================================
INSERT INTO categories (name, slug, icon, sort_order) VALUES
('가구·소파·침대', 'furniture', '🛋️', 1),
('조명·인테리어등', 'lighting', '💡', 2),
('커튼·블라인드', 'curtain', '🪟', 3),
('벽지·바닥재', 'wallpaper', '🧱', 4),
('주방·욕실용품', 'kitchen', '🚿', 5),
('수납·정리용품', 'storage', '📦', 6),
('홈데코·소품', 'deco', '🎨', 7);

-- ============================================
-- 상품 데이터
-- ============================================
INSERT INTO products (name, slug, description, price, original_price, discount, category_id, image_url, badge, stock, features) VALUES
(
  '모던 패브릭 3인 소파',
  'modern-fabric-3-seater-sofa',
  '편안한 착석감과 고급스러운 디자인이 특징인 3인용 패브릭 소파입니다. 거실 인테리어의 중심이 될 수 있는 제품입니다.',
  450000,
  580000,
  22,
  (SELECT id FROM categories WHERE slug = 'furniture'),
  '🛋️',
  'BEST',
  50,
  ARRAY['고밀도 우레탄 폼 사용', '내구성 높은 패브릭 원단', '조립 서비스 제공', '30일 무료 반품']
),
(
  '북유럽 스타일 펜던트 조명',
  'nordic-pendant-light',
  '심플하면서도 세련된 북유럽 스타일의 펜던트 조명입니다. 다이닝 룸이나 거실에 포인트가 됩니다.',
  89000,
  120000,
  26,
  (SELECT id FROM categories WHERE slug = 'lighting'),
  '💡',
  'HOT',
  100,
  ARRAY['E27 소켓', '높이 조절 가능', '간편 설치']
),
(
  '원목 6단 서랍장',
  'wooden-6-drawer-chest',
  '천연 원목으로 제작된 6단 서랍장입니다. 넉넉한 수납공간과 클래식한 디자인이 특징입니다.',
  320000,
  400000,
  20,
  (SELECT id FROM categories WHERE slug = 'storage'),
  '🗄️',
  'NEW',
  30,
  ARRAY['천연 원목 사용', '부드러운 서랍 레일', '조립 서비스 포함']
),
(
  '프리미엄 암막 커튼 세트',
  'premium-blackout-curtain-set',
  '99% 차광률의 프리미엄 암막 커튼입니다. 숙면을 위한 최적의 선택입니다.',
  78000,
  98000,
  20,
  (SELECT id FROM categories WHERE slug = 'curtain'),
  '🪟',
  NULL,
  200,
  ARRAY['99% 차광', '방음 효과', '세탁 가능']
),
(
  '모던 라운지 체어',
  'modern-lounge-chair',
  '인체공학적 설계로 편안한 착석감을 제공하는 라운지 체어입니다.',
  189000,
  250000,
  24,
  (SELECT id FROM categories WHERE slug = 'furniture'),
  '🪑',
  NULL,
  40,
  ARRAY['인체공학적 설계', '360도 회전', '높이 조절 가능']
),
(
  '북유럽 러그 카펫',
  'nordic-rug-carpet',
  '부드러운 촉감의 북유럽 스타일 러그입니다. 거실이나 침실에 따뜻함을 더해줍니다.',
  65000,
  85000,
  24,
  (SELECT id FROM categories WHERE slug = 'deco'),
  '🧶',
  NULL,
  80,
  ARRAY['부드러운 촉감', '미끄럼 방지', '세탁 가능']
),
(
  '스마트 LED 스탠드',
  'smart-led-stand',
  '밝기와 색온도 조절이 가능한 스마트 LED 스탠드입니다.',
  45000,
  60000,
  25,
  (SELECT id FROM categories WHERE slug = 'lighting'),
  '💡',
  NULL,
  150,
  ARRAY['밝기 조절', '색온도 조절', 'USB 충전 포트']
),
(
  '미니멀 원목 책상',
  'minimal-wooden-desk',
  '깔끔한 디자인의 미니멀 원목 책상입니다. 재택근무나 학습에 적합합니다.',
  280000,
  350000,
  20,
  (SELECT id FROM categories WHERE slug = 'furniture'),
  '🖥️',
  NULL,
  25,
  ARRAY['천연 원목', '케이블 정리홀', '넉넉한 작업 공간']
),
(
  '대형 벽걸이 시계',
  'large-wall-clock',
  '인테리어 포인트가 되는 대형 벽걸이 시계입니다.',
  55000,
  70000,
  21,
  (SELECT id FROM categories WHERE slug = 'deco'),
  '🕰️',
  NULL,
  60,
  ARRAY['무소음 무브먼트', '간편 설치', '배터리 포함']
),
(
  '프리미엄 퀸 매트리스',
  'premium-queen-mattress',
  '고밀도 메모리폼이 적용된 프리미엄 퀸 사이즈 매트리스입니다.',
  890000,
  1200000,
  26,
  (SELECT id FROM categories WHERE slug = 'furniture'),
  '🛏️',
  'BEST',
  15,
  ARRAY['고밀도 메모리폼', '통기성 우수', '10년 보증']
),
(
  '모던 화이트 TV 선반',
  'modern-white-tv-shelf',
  '깔끔한 화이트 컬러의 TV 선반입니다. 수납과 디스플레이를 동시에.',
  180000,
  230000,
  22,
  (SELECT id FROM categories WHERE slug = 'storage'),
  '🗄️',
  NULL,
  35,
  ARRAY['케이블 정리 기능', '넉넉한 수납', '조립 서비스']
),
(
  '인테리어 화분 세트',
  'interior-plant-pot-set',
  '세련된 디자인의 인테리어 화분 3종 세트입니다.',
  35000,
  45000,
  22,
  (SELECT id FROM categories WHERE slug = 'deco'),
  '🪴',
  NULL,
  100,
  ARRAY['배수구 포함', '3종 세트', '다양한 사이즈']
);

