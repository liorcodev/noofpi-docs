---
title: Introduction
description: noofpi is a minimal Vue + Vite full-stack framework built around doofpi.
---

# Introduction

noofpi is a minimal Vue + Vite full-stack framework built around [doofpi](https://www.npmjs.com/package/doofpi). It gives you file-based pages, SSR or SPA rendering, a built-in doofpi server (the Nitro equivalent) and a doofpi client with four fetch modes.

noofpi is inspired by [Nuxt](https://nuxt.com). It keeps the folder layout, the auto-imports and most composable names, and rebuilds the core around one typed fetch handler with a built-in doofpi server. See the [comparison with Nuxt](/docs/comparison).

## How it works

You write a doofpi server and Vue pages. noofpi wires them together, so the page can call your endpoints with full type safety and no HTTP boilerplate.

```ts [server/doofpi.ts]
import Doofpi from "doofpi";

const d = new Doofpi({ root: "/doofpi" });

export const routes = d.routes({
  hello: d.endpointBuilder.read(() => "hi"),
});

d.register(routes);

export default d;
```

```vue [app/pages/index.vue]
<script setup lang="ts">
useHead({ title: "Home" });

const { data, pending } = useDoofpiFetch("hello", (client) =>
  client.hello.read(),
);
</script>

<template>
  <p v-if="pending">Loading...</p>
  <p v-else>{{ data }}</p>
</template>
```

- `server/doofpi.ts` default-exports your doofpi instance. noofpi serves it at `doofpi.root`.
- Every file in `app/pages` becomes a route.
- The `routes` export types `useDoofpi()` and `useDoofpiFetch()`, and no import is needed for them thanks to auto-imports.
- On the server, `useDoofpiFetch` runs while the page renders and its result is embedded in the HTML. The browser hydrates from it without fetching again.

## What's included

| Feature             | Description                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------- |
| File-based routing  | Pages in `app/pages`, with dynamic (`[id]`) and catch-all (`[...slug]`) routes           |
| SSR or SPA          | Server-render everything, or ship a client-only SPA, with per-route rules                |
| Built-in server     | Your doofpi instance in `server/doofpi.ts`, plus optional server middleware              |
| Four fetch modes    | `dfetch`, `pfetch`, `lfetch` and `sfetch`, chosen globally or per route                  |
| Typed routes        | Typed doofpi clients and typed `navigateTo()` generated from your code                   |
| Data fetching       | `useAsyncData`, `useDoofpiFetch`, route loaders with prefetch and `useState`             |
| Forms               | `useDoofpiForm` with one Zod schema shared by the browser and the server                 |
| Layouts and head    | Layouts, `useHead` and a default `head` in the config                                    |
| Error pages         | `app/error.vue`, `createError`, `showError`, `clearError`                                |
| Auto-imports        | Vue, vue-router, noofpi composables, components, `app/composables` and `app/utils`       |
| Middleware          | Route middleware and server middleware                                                   |
| Cookies             | Server cookie jar and `useCookie` for the app                                            |
| i18n                | Typed messages, locale detection and `<html lang dir>`                                   |
| Security            | CSP with nonces, security headers, CSRF protection, body limit, allowed hosts            |
| Fonts and images    | Self-hosted Google and local fonts, AVIF and WebP image pipeline                         |
| Tailwind CSS v4     | Built in, enabled with `tailwind: true`                                                  |
| Deploy presets      | `node`, `bun`, `docker`, `cloudflare-worker`, `cloudflare-pages`, `github-pages`         |
| Devtools            | Dev-only overlay for routes, middleware, fetch mode, doofpi requests and CSP violations  |

## Explore the docs

- [Quick Start](/docs/quick-start) - scaffold a project and run it
- [Project Structure](/docs/project-structure) - what each folder and file is for
- [CLI](/docs/cli) - `noofpi dev`, `build` and `start`
- [Configuration](/docs/core-concepts/configuration) - every `noofpi.config.ts` option
- [Rendering](/docs/core-concepts/rendering) - SSR, SPA and route rules
- [Fetch Modes](/docs/doofpi/fetch-modes) - how the browser and the server reach your API
- [Data Fetching](/docs/doofpi/data-fetching) - `useAsyncData`, loaders and shared state
- [Forms](/docs/doofpi/forms) - validate once with a shared Zod schema
- [Deploy Presets](/docs/deployment/presets) - build for Node, Bun, Docker, Cloudflare or GitHub Pages
- [Comparison with Nuxt](/docs/comparison) - what noofpi borrows from Nuxt and where it differs
