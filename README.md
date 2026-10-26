# Sayan Paul — Portfolio

My personal site: the things I've built, the problems behind them, and how to reach me.

Built with Next.js (App Router), React, CSS and Motion.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000.

## Build

```sh
npm run build
```

The site is exported as static files to `out/`, so it can be hosted anywhere.

Set `SITE_URL` to the live address when deploying (for example `https://yourdomain.dev`) so link previews on LinkedIn, X and WhatsApp point to the right place.

## Where things live

- `app/projects.js` — project details, screenshots and links
- `app/page.js` — home page sections
- `app/about/` — about page, experience and education
- `app/components.js` — project gallery, problem list and contact form
- `app/globals.css` — styles
- `public/` — images, icons and résumé
