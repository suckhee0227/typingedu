# 타이핑 에듀 (typingedu.com)

맞춤형 스마트 교구 제작 서비스 랜딩 페이지

## 기술 스택

- **프론트엔드**: React 19, TypeScript, Tailwind CSS v4, Framer Motion, Three.js
- **빌드**: Vite 8
- **백엔드**: Google Apps Script + Google Sheets (문의 폼)
- **배포**: AWS EC2 (Amazon Linux 2023) + Nginx

## 로컬 실행

```bash
npm install
npm run dev
```

## 환경 변수

`.env` 파일을 프로젝트 루트에 생성:

```
VITE_GAS_URL=<Google Apps Script 웹앱 URL>
VITE_GAS_SECRET=<비밀키>
```

## 빌드 및 배포

```bash
npm run build
```

빌드된 `dist/` 폴더를 EC2의 `/var/www/typingedu/`에 업로드하면 Nginx가 서빙합니다.

## 프로젝트 구조

```
src/
  components/
    forms/         # 문의 폼
    layout/        # Navbar, Footer, FloatingWidget, EventPopup
    sections/      # Hero, Expertise, Portfolio, Process, Pricing, Contact
    three/         # Three.js 3D 씬
  hooks/           # 커스텀 훅
  lib/             # API 호출, 상수
  types/           # TypeScript 타입 정의
public/
  apps/            # 데모 교구 앱 (정적 HTML/JS)
google-apps-script/
  inquiries.gs     # GAS 문의 폼 처리 코드
```
