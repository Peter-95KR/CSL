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