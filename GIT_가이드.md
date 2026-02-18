# 🚀 공간나라 프로젝트 Git/GitHub 사용 가이드

## 📋 목차
1. [집에서 처음 설정하기](#1-집에서-처음-설정하기)
2. [GitHub에 코드 올리기](#2-github에-코드-올리기)
3. [사무실에서 처음 받기](#3-사무실에서-처음-받기)
4. [일상적인 작업 흐름](#4-일상적인-작업-흐름)
5. [문제 해결](#5-문제-해결)

---

## 1. 집에서 처음 설정하기

### 1-1. Git 설치 확인
PowerShell 또는 명령 프롬프트를 열고 다음 명령어 실행:

```powershell
git --version
```

**결과가 나오면**: Git이 설치되어 있습니다 ✅  
**"명령을 찾을 수 없습니다" 오류**: [Git 다운로드](https://git-scm.com/download/win) 후 설치 필요

### 1-2. Git 사용자 정보 설정 (처음 한 번만)
```powershell
git config --global user.name "당신의 이름"
git config --global user.email "your-email@example.com"
```

**예시:**
```powershell
git config --global user.name "김준서"
git config --global user.email "kimjs0405@example.com"
```

### 1-3. 프로젝트 폴더로 이동
```powershell
cd "C:\Users\김준서\Desktop\공간나라"
```

### 1-4. Git 저장소 초기화
```powershell
git init
```

### 1-5. 모든 파일 추가
```powershell
git add .
```

### 1-6. 첫 번째 커밋
```powershell
git commit -m "초기 프로젝트 설정"
```

---

## 2. GitHub에 코드 올리기

### 2-1. GitHub에서 저장소 생성
1. [GitHub.com](https://github.com)에 로그인
2. 우측 상단 **+** 버튼 클릭 → **New repository** 선택
3. 저장소 이름: `gonggannara` (또는 원하는 이름)
4. **Public** 또는 **Private** 선택
5. **"Initialize this repository with a README"** 체크 해제 (이미 코드가 있으므로)
6. **Create repository** 클릭

### 2-2. GitHub 저장소 주소 확인
생성된 저장소 페이지에서 초록색 **Code** 버튼 클릭 → HTTPS 주소 복사
예: `https://github.com/kimjs0405/gonggannara.git`

### 2-3. 원격 저장소 연결
```powershell
git remote add origin https://github.com/kimjs0405/gonggannara.git
```

**확인:**
```powershell
git remote -v
```

### 2-4. 메인 브랜치 이름 설정 (필요한 경우)
```powershell
git branch -M main
```

### 2-5. GitHub에 푸시
```powershell
git push -u origin main
```

**GitHub 로그인 요청 시:**
- 사용자 이름: GitHub 사용자명 입력
- 비밀번호: **Personal Access Token** 입력 필요 (일반 비밀번호 아님!)
- 토큰이 없으면: [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)에서 생성

---

## 3. 사무실에서 처음 받기

### 3-1. 사무실 컴퓨터 준비사항
- ✅ Node.js 설치 확인: `node --version`
- ✅ Git 설치 확인: `git --version`
- ✅ GitHub 계정 로그인

### 3-2. 프로젝트 클론 (처음 한 번만)
원하는 폴더로 이동 후 (예: `C:\Users\사용자명\Desktop`):

```powershell
git clone https://github.com/kimjs0405/gonggannara.git
```

### 3-3. 프로젝트 폴더로 이동
```powershell
cd gonggannara
```

### 3-4. 의존성 설치
```powershell
cd frontend
npm install
cd ..
```

**백엔드가 있다면:**
```powershell
cd backend
# 필요한 경우 여기서도 npm install 또는 다른 설치 명령 실행
cd ..
```

---

## 4. 일상적인 작업 흐름

### 📍 집에서 작업 끝날 때

```powershell
# 1. 프로젝트 폴더로 이동
cd "C:\Users\김준서\Desktop\공간나라"

# 2. 변경된 파일 확인
git status

# 3. 모든 변경사항 추가
git add .

# 4. 커밋 (작업 내용을 간단히 설명)
git commit -m "홈페이지 레이아웃 수정"

# 5. GitHub에 업로드
git push
```

**커밋 메시지 예시:**
- `"상품 상세 페이지 추가"`
- `"장바구니 기능 구현"`
- `"버그 수정: 로그인 오류 해결"`
- `"디자인 개선"`

### 📍 사무실에서 시작할 때

```powershell
# 1. 프로젝트 폴더로 이동
cd "C:\Users\사용자명\Desktop\gonggannara"

# 2. 최신 코드 받기
git pull
```

### 📍 사무실에서 작업 끝날 때

```powershell
# 1. 변경사항 확인
git status

# 2. 모든 변경사항 추가
git add .

# 3. 커밋
git commit -m "관리자 페이지 기능 추가"

# 4. GitHub에 업로드
git push
```

### 📍 다시 집에서 시작할 때

```powershell
cd "C:\Users\김준서\Desktop\공간나라"
git pull
```

---

## 5. 문제 해결

### ❌ "git pull" 시 충돌 발생

**상황:** 집과 사무실에서 같은 파일을 동시에 수정한 경우

**해결 방법:**
```powershell
# 1. 현재 변경사항 확인
git status

# 2. 충돌 파일 확인 (<<<<<<< 표시가 있는 파일)
# 3. 에디터에서 충돌 부분 수정
# 4. 수정 후:
git add .
git commit -m "충돌 해결"
git push
```

### ❌ "git push" 시 권한 오류

**해결 방법:**
1. GitHub Personal Access Token 확인
2. Windows 자격 증명 관리자에서 GitHub 인증 정보 삭제 후 다시 입력

### ❌ "git pull" 시 "Your local changes would be overwritten"

**해결 방법:**
```powershell
# 변경사항 임시 저장
git stash

# 최신 코드 받기
git pull

# 임시 저장한 변경사항 다시 적용
git stash pop
```

### ❌ 실수로 잘못된 파일 커밋

**해결 방법:**
```powershell
# 마지막 커밋 취소 (파일은 그대로 유지)
git reset --soft HEAD~1

# 또는 커밋 메시지만 수정
git commit --amend -m "새로운 메시지"
```

---

## 💡 유용한 Git 명령어 모음

```powershell
# 현재 상태 확인
git status

# 변경된 파일 확인 (상세)
git diff

# 커밋 히스토리 보기
git log

# 원격 저장소 정보 확인
git remote -v

# 브랜치 목록 보기
git branch

# 특정 파일만 추가
git add 파일명

# 특정 파일만 커밋
git commit 파일명 -m "메시지"
```

---

## 📝 체크리스트

### 집 컴퓨터 (처음 설정)
- [ ] Git 설치 확인
- [ ] Git 사용자 정보 설정
- [ ] `git init` 실행
- [ ] `git add .` 실행
- [ ] `git commit` 실행
- [ ] GitHub 저장소 생성
- [ ] `git remote add origin` 실행
- [ ] `git push` 실행

### 사무실 컴퓨터 (처음 설정)
- [ ] Node.js 설치 확인
- [ ] Git 설치 확인
- [ ] `git clone` 실행
- [ ] `npm install` 실행

### 매일 작업
- [ ] 작업 시작 전: `git pull`
- [ ] 작업 끝날 때: `git add .` → `git commit` → `git push`

---

## 🎯 요약

**집에서 작업 끝날 때:**
```powershell
git add .
git commit -m "작업 내용"
git push
```

**사무실에서 시작할 때:**
```powershell
git pull
```

**사무실에서 작업 끝날 때:**
```powershell
git add .
git commit -m "작업 내용"
git push
```

**다시 집에서:**
```powershell
git pull
```

이렇게 하면 USB나 파일 복사 없이 항상 최신 코드로 작업할 수 있습니다! 🎉

