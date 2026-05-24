# harimxchoi.github.io

[English](./README.md) | 한국어

개인 포트폴리오. Astro + Tailwind v4, GitHub Pages 배포.

Live: https://harimxchoi.github.io

사이트도 이중언어. `/` 영어, `/ko/` 한국어. 우상단 토글로 전환.

## Local

```bash
npm install
npm run dev      # localhost:4321
npm run build    # dist/
```

## Stack

- Astro 5 (static)
- Tailwind v4 (`@tailwindcss/vite`)
- Inter + JetBrains Mono (Google Fonts)
- 1페이지, 벤토 그리드 레이아웃

## Deploy

`main`에 push하면 GitHub Actions가 빌드, Pages로 배포.
Source: Settings → Pages → Build and deployment → GitHub Actions.
