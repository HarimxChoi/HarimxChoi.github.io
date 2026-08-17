# harimxchoi.github.io

[English](./README.md) | 한국어

예측과 불확실성, 프로덕션 ML을 중심으로 Tabular ML, NLP, Computer Vision과 LLM Agent 프로젝트를 보여주는 최하림의 영문·국문 포트폴리오입니다.

Live: https://harimxchoi.github.io

포트폴리오 PDF: https://harimxchoi.github.io/files/harim-choi-ml-portfolio-ko.pdf

## 로컬 실행

```bash
npm install
npm run hooks:install
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
