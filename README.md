# harimxchoi.github.io

English | [한국어](./README.ko.md)

Bilingual portfolio for Harim Choi, an applied machine learning engineer working across production ML, open-source agent infrastructure, and research.

Live: https://harimxchoi.github.io

Portfolio deck: https://harimxchoi.github.io/files/harim-choi-ml-portfolio-en.pptx

## Local development

```bash
npm install
npm run hooks:install
npm run dev
npm run build
```

## Stack

- Astro 6 static site
- Tailwind CSS 4 via `@tailwindcss/vite`
- Inter, Noto Sans KR, and JetBrains Mono
- English at `/`, Korean at `/ko/`

## Deployment

Pushes to `main` are built and deployed to GitHub Pages through GitHub Actions.
