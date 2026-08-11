# harimxchoi.github.io

[English](./README.md) | 한국어

Applied ML, 오픈소스 Agent 인프라와 연구 프로젝트를 함께 보여주는 최하림의 영문·국문 포트폴리오입니다.

Live: https://harimxchoi.github.io

포트폴리오 파일: https://harimxchoi.github.io/files/harim-choi-ml-portfolio.pptx

## 로컬 실행

```bash
npm install
npm run dev
npm run build
```

## 구성

- Astro 6 정적 사이트
- `@tailwindcss/vite` 기반 Tailwind CSS 4
- Inter, Noto Sans KR, JetBrains Mono
- 영문 `/`, 국문 `/ko/`

## 배포

`main`에 push하면 GitHub Actions가 빌드한 뒤 GitHub Pages에 배포합니다.
