# CSL Dashboard

대시보드 애플리케이션으로, 버즈량, 브랜드 긍/부정/문의량, 소상공인 동향 등의 데이터를 시각화하여 보여줍니다.

## 기술 스택

### 프론트엔드
- React
- TypeScript
- Material-UI
- Chart.js
- React Router
- Styled Components

### 백엔드
- Node.js
- Express
- TypeORM
- PostgreSQL
- JWT 인증

### DevOps
- Docker
- Docker Compose

## 프로젝트 구조

### 프론트엔드 구조
```
frontend/
├─ src/
│  ├─ assets/          # 이미지, 아이콘 등 정적 자원
│  ├─ components/      # 재사용 가능한 컴포넌트
│  ├─ contexts/        # React Context API를 사용한 상태 관리
│  ├─ hooks/           # 커스텀 React 훅
│  ├─ pages/           # 페이지 컴포넌트
│  ├─ services/        # API 호출 및 서비스 로직
│  ├─ styles/          # 글로벌 스타일 및 테마
│  ├─ types/           # TypeScript 타입 정의
│  ├─ utils/           # 유틸리티 함수
│  ├─ App.tsx          # 메인 앱 컴포넌트
│  └─ index.tsx        # 앱 진입점
```

### 백엔드 구조
```
backend/
├─ src/
│  ├─ config/          # 앱 설정 및 환경 변수
│  ├─ controllers/     # API 엔드포인트 컨트롤러
│  ├─ middleware/      # Express 미들웨어
│  ├─ models/          # 데이터 모델 및 스키마
│  ├─ routes/          # API 라우트 정의
│  ├─ services/        # 비즈니스 로직 및 서비스
│  ├─ utils/           # 유틸리티 함수
│  └─ index.ts         # 서버 진입점
```

## 설치 및 실행 방법

### 도커를 이용한 실행
1. 프로젝트를 클론합니다:
```bash
git clone <repository-url>
cd csl-dashboard
```

2. 도커 컴포즈로 빌드 및 실행:
```bash
docker-compose up --build
```

3. 브라우저에서 다음 주소로 접속:
   - 프론트엔드: http://localhost:80
   - 백엔드 API: http://localhost:3000/api

### 로컬 개발 환경 (프론트엔드)
```bash
cd frontend
npm install
npm start
```

### 로컬 개발 환경 (백엔드)
```bash
cd backend
npm install
npm run dev
```

## 기능

### 사용자 인증
- 로그인/회원가입
- JWT 기반 인증

### 대시보드
- 버즈량
- 자사브랜드에 대한 긍정/부정/문의량
- 타사브랜드에 대한 긍정/부정/문의량
- 워드 클라우드 시각화

### 리포트
- 데일리 리포트
- 위클리 리포트 (소상공인 동향 포함)
- 월별 리포트
- 트랜드 리포트

### 차트 시각화
- 막대 그래프
- 선 그래프
- 파이/도넛 차트
- 워드 클라우드