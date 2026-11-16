# noofpi-docs

Documentation site for [noofpi](https://www.npmjs.com/package/noofpi), a minimal Vue + Vite full-stack framework built around [doofpi](https://www.npmjs.com/package/doofpi).

Live site: https://liorcodev.github.io/noofpi-docs/

Built with [Nuxt](https://nuxt.com) and [Nuxt Content](https://content.nuxt.com), and deployed to GitHub Pages.

## Development

```sh
bun install
bun run dev
```

## Scripts

```
bun run dev        Start the dev server
bun run build      Build the site
bun run generate   Generate the static site into .output/public
bun run preview    Preview the generated site under /noofpi-docs/
bun run format     Format with Prettier
```

## Structure

- `content/docs/`: documentation pages (Markdown)
- `app/`: Nuxt app (layouts, components, styles)
- `server/`: server routes
- `public/`: static assets

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which generates the site and publishes it to GitHub Pages.

## Related

- [noofpi](https://github.com/liorcodev/noofpi): the framework
- [noofpi-ui](https://github.com/liorcodev/noofpi-ui): the component library
