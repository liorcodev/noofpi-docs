---
title: Configuration
description: Every noofpi.config.ts option, with defaults.
---

# Configuration

Configure noofpi in `noofpi.config.ts` at the project root with `defineNoofpiConfig`.

```ts [noofpi.config.ts]
import { defineNoofpiConfig } from "noofpi";

export default defineNoofpiConfig({
  ssr: true,
  routeRules: { "/admin/**": { ssr: false } },
  head: { title: "%s | My site" },
  tailwind: true,
  autoImports: true,
  css: [],
  fonts: { families: [] },
  images: { formats: ["avif", "webp"], widths: [640, 1024, 1920], quality: 75 },
  security: { csp: { directives: { "script-src": ["'self'", "'nonce'"] } } },
  i18n: { locales: ["en", "he"], defaultLocale: "en" },
  doofpi: {
    fetch: "lfetch",
    url: "https://api.example.com",
    root: "/doofpi",
  },
  devServer: { port: 3000, host: "localhost" },
  build: { preset: "node" },
  devtools: true,
  vite: {},
});
```

## Options

| Option               | Default                  | Description                                                                              |
| -------------------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| `ssr`                | `true`                   | Render pages on the server. `false` ships a client-only SPA                               |
| `routeRules`         | `{}`                     | Per-route overrides, see [Rendering](/docs/core-concepts/rendering)                      |
| `head`               | `{}`                     | Default `<head>` of every page, see [Head](/docs/core-concepts/head)                     |
| `tailwind`           | `false`                  | Built-in Tailwind CSS v4. Creates the CSS entry if you have none                         |
| `autoImports`        | `true`                   | Nuxt-style auto-imports, see [Auto-imports](/docs/core-concepts/auto-imports)            |
| `css`                | `app/assets/main.css`    | CSS files relative to the project root. Default applies when the file exists             |
| `fonts`              | none                     | Google and local fonts, see [Fonts](/docs/guides/fonts)                                  |
| `images`             | see example above        | Image pipeline, see [Images](/docs/guides/images)                                        |
| `security`           | on by default            | CSP, headers, CSRF, body limit, allowed hosts, see [Security](/docs/guides/security)     |
| `i18n`               | off                      | Typed messages and locale detection, see [i18n](/docs/guides/i18n)                       |
| `doofpi.fetch`       | `lfetch`                 | `dfetch`, `pfetch`, `lfetch` or `sfetch`, see [Fetch Modes](/docs/doofpi/fetch-modes)    |
| `doofpi.url`         | none                     | Remote API origin. Required for any mode other than `lfetch`                             |
| `doofpi.root`        | `/doofpi`                | Root path of the API. Must start with a slash and not end with one                       |
| `devServer.port`     | `3000`                   | Dev server port                                                                          |
| `devServer.host`     | `localhost`              | Dev server host                                                                          |
| `build.preset`       | `node`                   | Deploy target, see [Presets](/docs/deployment/presets)                                   |
| `devtools`           | `true`                   | Dev-only overlay, see [Devtools](/docs/guides/devtools)                                  |
| `vite`               | `{}`                     | Extra Vite options, merged into the generated config                                     |

## Validation

noofpi checks the config at startup and fails with a clear message when:

- `doofpi.fetch` is not one of the four modes
- `sfetch` is used with `ssr: false`
- `doofpi.url` is missing while a mode other than `lfetch` is used, by default or in a route rule
- `doofpi.url` is not an absolute http or https URL
- `doofpi.root` does not start with a slash or ends with one

## Public Config

Only a subset of the config reaches the browser: `ssr`, `routeRules`, `head`, `doofpi` and
`devtools`. `doofpi.url` is only sent when `dfetch` is used somewhere. Security options are
server-only.
