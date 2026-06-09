# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

타이핑 에듀(typingedu.com) — 맞춤형 스마트 교구 제작 서비스의 단일 페이지 랜딩 사이트. React 19 + TypeScript + Vite 8 + Tailwind CSS v4. 문의 폼 백엔드는 Google Apps Script(+ Google Sheets), 그 외에는 모두 정적 프론트엔드다.

## 명령어

```bash
npm run dev        # Vite 개발 서버 (host 노출 + usePolling)
npm run build      # tsc -b 타입체크 후 vite build → dist/
npm run preview    # 빌드 결과 미리보기
npm run lint       # ESLint (flat config: eslint.config.js)
```

테스트 러너는 없다. 검증은 `npm run build`(타입체크 포함) + `npm run lint`로 한다.

## 환경 변수

`.env`(루트, `.env.example` 참고):
- `VITE_GAS_URL` — Google Apps Script 웹앱 URL (문의 폼 제출 대상)
- `VITE_GAS_SECRET` — `google-apps-script/inquiries.gs`의 `SECRET_KEY`와 **반드시 동일**해야 함

## 아키텍처

### 페이지 구성
`src/App.tsx`가 전체 구조. 섹션이 위에서 아래로 한 페이지에 쌓이는 형태:
`HeroSection → ExpertiseSection → PortfolioSection → ProcessSection → PricingSection → ContactSection`. 그 위에 전역 오버레이/위젯(`Navbar`, `Footer`, `FloatingWidget`, `EventPopup`, `LegalModal`, `SampleTextbookOverlay`)이 얹힌다.

### 전역 커스텀 이벤트 버스 (핵심 패턴)
컴포넌트 간 통신은 prop drilling 대신 `window` CustomEvent로 한다. 한쪽이 `dispatchEvent`, 받는 오버레이/섹션이 `addEventListener`로 구독:
- `open-contact-widget` — FloatingWidget(문의 폼) 열기
- `open-portfolio-demo` (detail: 아이템 id) — PortfolioSection 데모 패널 열기
- `open-sample-textbook` — SampleTextbookOverlay 열기
- `open-event-popup` — EventPopup 열기
- `open-legal` (detail: `"privacy"` | `"terms"`) — LegalModal 열기. 헬퍼 함수가 `LegalModal.tsx`에 export됨

새 "어디서든 열리는" UI를 추가할 때는 이 패턴을 따른다.

### 스크롤
`App.tsx`가 Lenis 관성 스크롤을 초기화하고 `window.__lenis`로 전역 노출한다. 풀스크린 오버레이는 열릴 때 `__lenis.stop()` + `document.body.style.overflow="hidden"`으로 배경 스크롤을 잠그고 닫을 때 되돌린다(`SampleTextbookOverlay` 참고). `prefers-reduced-motion`이면 Lenis를 건너뛴다.

### 데모 교구 (live demo)
`public/apps/<slug>/`에 독립 실행형 정적 앱(자체 `index.html` + `main.js` 번들)이 들어있고, 사이트는 iframe으로 띄운다.
- **포트폴리오 데모**는 `PORTFOLIO_ITEMS`(`src/lib/constants.ts`)로 정의되고 PortfolioSection이 렌더. **DemoSection.tsx는 미사용 고아 컴포넌트** — 손대지 말 것.
- **샘플교본 갤러리**는 `SAMPLE_ITEMS` + `SAMPLE_CATEGORIES`(`src/lib/constants.ts`)로 정의되고 `SampleTextbookOverlay`가 업종별 탭 그리드로 렌더.
- 새 교구 추가: `public/apps/`에 정적 앱 폴더를 두고, 해당 상수 배열에 `demoUrl`/`thumbnail` 경로를 가리키는 항목을 추가한다. `samples-src/`는 갤러리에 올리기 전 **원본 소스 보관용**(빌드에 포함 안 됨).

### 콘텐츠/타입
- 마크다운 콘텐츠는 `src/content/*.md`를 `?raw`로 import해 `react-markdown` + `remark-gfm`으로 렌더(`LegalModal` 약관/개인정보). `?raw` 모듈 타입은 `src/content/txt-raw.d.ts`에 선언.
- 데이터 모델(`PortfolioItem`, `SampleItem`, `InquiryForm`, `Tier` 등)은 `src/types/index.ts`에 집중.
- 문의 폼: `useContactForm`(react-hook-form + zod) → `lib/api.submitInquiry` → GAS로 `text/plain` POST(CORS 회피). GAS는 30초 rate limit과 secret 검증을 함.

### 스타일
Tailwind v4 (`@tailwindcss/vite` 플러그인, JS config 없음). 디자인 토큰은 `src/index.css`의 `@theme` 블록에 정의 — `primary-*`(블루), `accent-*`(퍼플) 색 스케일을 클래스로 그대로 쓴다(예: `bg-primary-600`). 애니메이션은 Framer Motion. 재사용 텍스트 애니메이션 컴포넌트는 `src/components/ui/`(RevealText, Typewriter, BlurFadeIn 등).

## 배포

`vercel.json`이 있어 Vercel SPA 라우팅을 설정한다(`/apps/*`와 정적 파일을 먼저 서빙, 나머지는 `/index.html`로 fallback). 메모상 운영 배포는 GitHub(vibeeduai/typingedu) → 호스트 연결 방식이며, `npm run build`의 `dist/`를 서빙한다. 로컬 Vercel CLI는 네트워크가 불안정해 권장하지 않는다.
