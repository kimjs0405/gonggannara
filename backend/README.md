# 공간나라 Backend - Supabase

이 폴더는 Supabase 백엔드 설정 및 데이터베이스 스키마를 포함합니다.

## Supabase 설정 방법

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 접속
2. 새 프로젝트 생성
3. 프로젝트 대시보드에서 API 키 확인

### 2. 환경변수 설정
프론트엔드 `.env` 파일에 다음 값을 설정:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 데이터베이스 테이블 생성
Supabase SQL Editor에서 `schema.sql` 파일의 내용을 실행하세요.

### 4. Storage 버킷 생성 (선택)
상품 이미지 업로드용 버킷 생성:
- 버킷 이름: `product-images`
- Public 접근 허용

### 5. 인증 설정
Supabase Authentication 대시보드에서:
- Email 인증 활성화
- (선택) 카카오/Google OAuth 설정

## 파일 구조
```
backend/
├── README.md           # 이 파일
├── schema.sql          # 데이터베이스 스키마
└── seed.sql            # 샘플 데이터 (선택)
```

## API 엔드포인트
Supabase는 자동으로 REST API를 생성합니다:
- `GET /rest/v1/products` - 상품 목록
- `GET /rest/v1/products?id=eq.1` - 상품 상세
- `GET /rest/v1/categories` - 카테고리 목록
- `POST /rest/v1/orders` - 주문 생성
- 등등...

## Row Level Security (RLS)
모든 테이블에 RLS가 적용되어 있습니다.
자세한 정책은 `schema.sql`을 참조하세요.

