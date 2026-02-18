# 공간나라 - 인테리어 전문 쇼핑몰

인테리어 전문 업체 겸 자사 쇼핑몰 웹사이트입니다.

## 프로젝트 구조

```
공간나라/
├── frontend/           # 프론트엔드 (Netlify 배포)
│   ├── src/
│   │   ├── components/ # 공통 컴포넌트
│   │   ├── pages/      # 페이지 컴포넌트
│   │   └── lib/        # 유틸리티 (Supabase 클라이언트)
│   ├── package.json
│   ├── netlify.toml    # Netlify 배포 설정
│   └── ...
│
├── backend/            # 백엔드 설정 (Supabase)
│   ├── schema.sql      # 데이터베이스 스키마
│   ├── seed.sql        # 샘플 데이터
│   └── README.md       # Supabase 설정 가이드
│
└── README.md           # 이 파일
```

## 기술 스택

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Hosting:** Netlify

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **API:** Supabase Auto-generated REST API

## 시작하기

### 1. 프론트엔드 설정

```bash
cd frontend
npm install
```

### 2. 환경변수 설정

`frontend/env.example.txt` 파일을 참고하여 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com) 프로젝트 생성
2. SQL Editor에서 `backend/schema.sql` 실행
3. (선택) `backend/seed.sql`로 샘플 데이터 추가

### 4. 개발 서버 실행

```bash
cd frontend
npm run dev
```

## 배포

### Netlify 배포 (프론트엔드)

1. [Netlify](https://netlify.com) 접속
2. GitHub 저장소 연결 또는 폴더 드래그&드롭
3. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Environment variables 설정:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Supabase 설정 (백엔드)

`backend/README.md` 참조

## 주요 기능

- ✅ 메인 페이지 (배너, 카테고리, 인기상품)
- ✅ 상품 목록 (필터, 정렬)
- ✅ 상품 상세 페이지
- ✅ 장바구니
- ✅ 로그인/회원가입
- 🔜 주문/결제
- 🔜 마이페이지
- 🔜 상품 리뷰
- 🔜 관리자 페이지

## 라이선스

MIT License

