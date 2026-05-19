# 세션 기록 — 2026-05-19 #1

## 작업 요약
MongoDB + Vercel 서버리스 구조를 Google Apps Script + Google Sheets로 전환하고, AWS EC2 + Nginx로 정적 사이트 배포 완료.

## 변경 파일
- `package.json` — mongoose, @vercel/node, vercel 의존성 제거
- `src/lib/api.ts` — API 호출 대상을 Vercel 서버리스에서 GAS 웹앱 URL로 변경, Content-Type: text/plain 방식으로 CORS 해결, 비밀키(_secret) 전송 추가
- `src/types/index.ts` — 기존 유지 (변경 없음)
- `vite.config.ts` — /api 프록시 설정 제거
- `.env` — MONGODB_URI 제거, VITE_GAS_URL과 VITE_GAS_SECRET 추가
- `.gitignore` — 새로 생성 (node_modules, dist, .env, .DS_Store 등 제외)
- `google-apps-script/inquiries.gs` — 새로 생성. GAS 웹앱 코드 (문의 데이터를 Google Sheets에 저장)
- `api/inquiries.ts` — 삭제 (Vercel 서버리스 함수, 더 이상 불필요)
- `vercel.json` — 존재하지만 현재 미사용 (EC2 배포로 전환)
- `.claude/skills/session-save.md` — 새로 생성. 세션 저장 스킬 정의

## 구현 내용

### 1. 백엔드 전환: MongoDB → Google Apps Script + Sheets
- 기존: 프론트엔드 → Vercel 서버리스(`api/inquiries.ts`) → MongoDB
- 변경: 프론트엔드 → Google Apps Script 웹앱 → Google Sheets
- GAS 웹앱은 302 리다이렉트 특성이 있어 `Content-Type: text/plain` + `redirect: follow`로 해결
- 처음 시도한 `mode: no-cors`는 응답을 읽을 수 없어 폐기

### 2. GAS 보안 조치
- 비밀키(_secret) 검증: 프론트엔드와 GAS 양쪽에 동일한 랜덤 키 설정
- Rate Limit: 같은 전화번호로 30초 내 중복 제출 차단 (CacheService 사용)
- 입력값 길이 제한: 이름/기관명 500자, 전화번호 20자, 메시지 2000자
- 전화번호 형식 검증: 숫자와 하이픈만 허용
- 전화번호 저장 시 앞에 작은따옴표(') 추가하여 텍스트로 인식 (앞자리 0 보존)
- VITE_ 접두사 환경변수는 빌드 시 JS에 포함되므로 완벽한 보안은 아니나, URL만으로 공격 불가하게 만드는 실질적 방어

### 3. AWS EC2 배포
- 로컬에서 `npm run build` → `dist/` 폴더만 EC2에 업로드
- EC2에 Node.js 설치하지 않음, Nginx가 정적 파일 서빙

### 4. Nginx 설정
- SPA 라우팅: 모든 경로를 index.html로 fallback (`try_files $uri $uri/ /index.html`)
- `/apps/` 경로: 데모 앱 실제 파일 서빙 (try_files $uri $uri/ =404)
- 정적 파일 캐싱: `/assets/` 경로 1년 캐싱, immutable 헤더
- gzip 압축 활성화

### 5. SSL (HTTPS)
- Let's Encrypt + certbot으로 무료 SSL 인증서 발급
- typingedu.com, www.typingedu.com 모두 HTTPS 적용
- HTTP → HTTPS 자동 리다이렉트 설정
- certbot-renew.timer로 자동 갱신 활성화

## 인프라 / 배포
- **EC2 인스턴스**: t3.micro, Amazon Linux 2023, 이름 `typingedu-web`
- **탄력적 IP**: 3.37.14.23
- **도메인**: typingedu.com (Route 53에서 관리)
- **DNS**: A 레코드 — typingedu.com → 3.37.14.23, www.typingedu.com → 3.37.14.23
- **SSL 만료일**: 2026-08-17 (자동 갱신 활성화)
- **웹서버**: Nginx 1.30.0
- **웹루트**: /var/www/typingedu/
- **SSH 키**: typingedu-web_260519_1.pem (프로젝트 루트에 위치)
- **배포 방법**: 로컬 빌드 → scp로 dist/ 업로드 → /var/www/typingedu/에 복사

## 미완료 / 다음 단계
- [ ] 배포 자동화 스크립트 작성 (`npm run deploy`로 빌드+업로드 원커맨드)
- [ ] vercel.json 파일 정리 (현재 미사용, 삭제 고려)
- [ ] .env.example 파일 재생성 (기존 것이 삭제됨, .env로 rename된 것으로 추정)
- [ ] www.typingedu.com → typingedu.com 리다이렉트 통합 (현재 양쪽 모두 독립 서빙)
- [ ] GAS 응답 속도 (2.4초) — GAS 구조적 한계, UI에서 로딩 피드백으로 체감 개선 검토

## 메모
- GAS 웹앱의 CORS 문제: `application/json`은 preflight를 트리거하고, `no-cors`는 응답을 못 읽음. `text/plain`이 가장 실용적 해결책
- GAS 웹앱 배포 시 Google Workspace 계정은 기본 액세스가 "조직 내"로 되어있어 401 에러 발생 → "모든 사용자"로 변경 필요
- GAS 웹앱 URL은 재배포마다 변경되므로, 수정 시 .env 업데이트 + 프론트 재빌드 + EC2 재업로드 필요
- Google Sheets 시트명은 "문의", 헤더: 접수일시 | 이름 | 기관명 | 연락처 | 문의내용 | 상태
