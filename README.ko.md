# harimxchoi.github.io

[English](./README.md) | 한국어

개인 포트폴리오. Astro + Tailwind v4, GitHub Pages 배포.

Live: https://harimxchoi.github.io

사이트 자체도 다국어 지원: `/` (영어) / `/ko/` (한국어). 라이브 사이트에서 우상단 토글로 전환 가능.

## Local

```bash
npm install
npm run dev      # localhost:4321
npm run build    # dist/
```

## Stack

- Astro 5 (static)
- Tailwind v4, `@tailwindcss/vite` 경유
- Inter + JetBrains Mono, Google Fonts 경유
- 1페이지, 벤토 그리드 레이아웃

## Deploy

`main`에 push. GitHub Actions가 빌드해서 Pages로 배포.
Source: Settings → Pages → Build and deployment → GitHub Actions.
