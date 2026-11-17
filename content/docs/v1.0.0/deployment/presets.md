---
title: Presets
description: Build for Node, Bun, Docker, Cloudflare or GitHub Pages with one command.
---

# Deploy Presets

Pick the target with `build.preset` in the config or `noofpi build --preset <name>`. The flag
wins. Every build starts from an empty `.output/`.

| Preset              | Output                                                                                       | Run or deploy                                     |
| ------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `node` (default)    | `public/` and `server/` (`index.mjs`, standalone `start.mjs`)                                | `noofpi start` or `node .output/server/start.mjs` |
| `bun`               | same, `start.mjs` serves with `Bun.serve`                                                    | `bun .output/server/start.mjs`                    |
| `docker`            | the `node` output plus `.output/Dockerfile` (`oven/bun` image if `bun.lock` or `bun.lockb` exists) | `docker build -f .output/Dockerfile -t my-app .`  |
| `cloudflare-worker` | `public/` (static assets), one bundled Worker `server/index.mjs` and `wrangler.json`         | `wrangler deploy -c .output/wrangler.json`        |
| `cloudflare-pages`  | `public/` with a bundled `_worker.js` and `_routes.json`                                     | `wrangler pages deploy .output/public`            |
| `github-pages`      | static client-only SPA in `public/` (`index.html`, `404.html` fallback, `.nojekyll`), no server | publish `.output/public`                       |

```ts [noofpi.config.ts]
export default defineNoofpiConfig({
  build: { preset: "node" },
});
```

## Node, Bun and Docker

`PORT` and `HOST` configure the `node`, `bun` and `docker` servers. Defaults are `devServer.port`
and `0.0.0.0`.

The Dockerfile installs the project's dependencies, so keep them (and a lock file) next to
`package.json`.

## Cloudflare

The Cloudflare presets bundle all dependencies into the Worker and set the `nodejs_compat` flag.
Bindings reach your doofpi server as `env` (`doofpi.fetch(request, env)`). To add them, copy the
generated `wrangler.json` into your own wrangler config. To type `env`, see
[Server env and context](/docs/doofpi/typed-routes#server-env-and-context).

For Pages, set the `nodejs_compat` compatibility flag in the project settings.

## GitHub Pages

`github-pages` is always a client-only SPA (`ssr` is forced to `false`), because GitHub Pages only
serves files.

::Callout{type="warning" title="Static hosting limits"}
There is no server, so `doofpi.fetch` must be `dfetch`. `lfetch`, `pfetch` and `sfetch` are not
allowed, also in `routeRules`. `security` headers and `csp` are not sent.
::

Unknown paths are served `404.html` (a copy of `index.html`), so deep links reach the client
router. For a project site (`user.github.io/<repo>/`) set the base path. The router uses it too.

```ts [noofpi.config.ts]
export default defineNoofpiConfig({
  build: { preset: "github-pages" },
  doofpi: { fetch: "dfetch", url: "https://api.example.com" },
  vite: { base: "/<repo>/" },
});
```

### GitHub Actions

```yaml [.github/workflows/deploy.yml]
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build --preset github-pages
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .output/public

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
