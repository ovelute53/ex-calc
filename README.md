💱 ExchangeView Pro at Meowster

2026년형 실시간 환율 분석 및 스마트 계산기 대시보드 > 공식 도메인: meowster.co.kr

🌟 프로젝트 소개

ExchangeView Pro는 전 세계 주요 통화와 암호화폐 시세를 실시간으로 분석하고 계산할 수 있는 단일 페이지 웹 애플리케이션(SPA)입니다. 카페24(Cafe24) 뉴아우토반 호스팅 환경과 클라우드플레어(Cloudflare)의 보안 네트워크에 최적화되어 설계되었습니다.

주요 기능

스마트 계산기: 실시간 환율을 반영한 즉각적인 통화 변환.

시장 동향 분석: Chart.js 기반의 대화형 라인 차트를 통한 과거 추이 분석.

실시간 티커: 주요 통화 쌍의 실시간 변동률을 상단 마키(Marquee) UI로 제공.

다국어 지원: 한국어와 영어 간의 원클릭 언어 전환.

SEO 최적화: Google 및 Naver 검색 노출을 위한 JSON-LD 구조화 데이터 적용.

🛠 기술 스택

Frontend: HTML5, Tailwind CSS (via CDN)

Library: Chart.js (Data Visualization)

Hosting: Cloudflare Pages

Domain: Gabia (meowster.co.kr)

CI/CD: GitHub Actions (Auto Deployment)

🚀 유지보수 및 업데이트 방법 (GitHub Codespaces)

이 프로젝트는 GitHub와 Cloudflare Pages가 연동되어 있어, 코드 수정 후 push만 하면 자동으로 사이트에 반영됩니다.

1. 코드 수정

Codespaces 에디터에서 index.html 파일을 엽니다. 원하는 텍스트나 로직을 수정한 후 저장(Ctrl + S)합니다.

2. 변경사항 반영 (터미널 명령어)

터미널 창에 아래 명령어를 입력하여 업데이트를 완료합니다.

# 1. 변경된 파일 스테이징
git add index.html

# 2. 커밋 메시지 작성
git commit -m "update: 환율 데이터 로직 고도화"

# 3. GitHub로 푸시 (자동으로 Cloudflare Pages 배포 시작)
git push origin main


🔒 보안 및 도메인 설정

SSL: Cloudflare의 Flexible 모드를 사용하여 보안 연결(HTTPS)이 강제 적용됩니다.

DNS 관리: 클라우드플레어 네임서버를 통해 meowster.co.kr 도메인이 관리되고 있습니다.

보안: DDoS 공격 방어 및 에지 캐싱 기술이 적용되어 있습니다.

📝 라이선스

© 2026 Meowster FX Pro. All rights reserved.

본 프로젝트는 개인 포트폴리오 및 상용화 준비 모델로 제작되었습니다.

Last Updated: 2026-01-31