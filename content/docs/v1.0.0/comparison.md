---
title: Comparison with Nuxt
description: What noofpi borrows from Nuxt, and why it is a lighter, more integrated full-stack framework.
---

# Comparison with Nuxt

noofpi is inspired by [Nuxt](https://nuxt.com). If you know Nuxt, the project layout, the
auto-imports and most composables will feel familiar. noofpi keeps that developer experience and
rebuilds the core around [doofpi](https://www.npmjs.com/package/doofpi): your whole app, pages and
API, runs as a single typed `(Request) => Response` function.

## What noofpi Borrows

| Nuxt                                  | noofpi                                          |
| ------------------------------------- | ----------------------------------------------- |
| `nuxt.config.ts`                      | `noofpi.config.ts` with `defineNoofpiConfig`    |
| `app/pages`, `layouts`, `middleware`  | the same folders and the same file-based routes |
| `app/components`, `composables`, `utils` | the same folders, auto-imported              |
| `app.vue` and `error.vue`             | `app/app.vue` and `app/error.vue`               |
| `[id].vue` and `[...slug].vue`        | the same dynamic and catch-all file names       |
| `useAsyncData`, `useState`, `useCookie`, `useHead` | the same names                     |
| `navigateTo`, `createError`, `showError`, `clearError`, `useError` | the same names     |
| `<NuxtLayout>`, `<NuxtPage>`, `<NuxtLink>` | `<NoofpiLayout>`, `<NoofpiPage>`, `<NoofpiLink>` |
| `<ClientOnly>`                        | `<ClientOnly>`                                  |
| `<NuxtImg>` (via `@nuxt/image`)       | `<NoofpiImage>`, built in                       |
| `routeRules`                          | `routeRules`, including per-route `ssr` and `security` |
| `defineNuxtRouteMiddleware`           | `defineRouteMiddleware`                         |
| `app/plugins` and `defineNuxtPlugin`  | `app/plugins` and `defineNoofpiPlugin`, see [Plugins](/docs/guides/plugins) |
| Nuxt modules                          | none; use `vite.plugins` and [app plugins](/docs/guides/plugins) |
| `definePageMeta({ layout })`          | `useLayout("name")`                             |
| `definePageMeta({ middleware })`      | `useMiddleware("name")`                         |
| `server/api` and Nitro routes         | `server/doofpi.ts`, a doofpi instance           |
| `server/middleware`                   | `server/middleware` with `defineServerMiddleware` |
| `useFetch`                            | `useDoofpiFetch`                                |
| Nitro presets                         | `build.preset`, see [Presets](/docs/deployment/presets) |
| Nuxt Devtools                         | the dev [devtools overlay](/docs/guides/devtools) |

## Built for doofpi

[doofpi](https://www.npmjs.com/package/doofpi) is the API framework. noofpi is the full-stack Vue
framework made to wear it like a glove: it serves your doofpi instance, gives your pages a typed
client for it, and deploys both together. In Nuxt, the server layer is Nitro. In noofpi, it is
doofpi.

| You write                          | noofpi does the rest                                                    |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `server/doofpi.ts` with your routes | serves it, and types `useDoofpi()` and `useDoofpiFetch()` from it      |
| a Zod schema on an endpoint        | validates it on the server and reuses it in `useDoofpiForm`             |
| a doofpi API hosted elsewhere      | reaches it with `dfetch`, `pfetch` or `sfetch`, see [Fetch Modes](/docs/doofpi/fetch-modes) |
| `bun run build`                    | bundles pages and API together for the target in [Presets](/docs/deployment/presets) |

## Why noofpi

### Your whole app is one fetch function

Pages, the typed API, the pfetch proxy, server middleware, cookies and security all run inside a
single web-standard `(Request) => Response` handler. Presets only wrap it. The Cloudflare Worker
entry is `export default { fetch: handler }`, and Node and Bun serve the same function.

- **One Worker:** the `cloudflare-worker` preset bundles SSR, the API and your dependencies into a
  single Worker, with static assets served alongside it
- **No adapter layer:** there is no server framework or runtime shim to learn between your code and
  the platform
- **Bindings reach everything:** the platform `env` is passed to your doofpi endpoints and your
  server middleware, so KV, D1 and R2 are available wherever you need them

See [Presets](/docs/deployment/presets).

### A backend-for-frontend, built in

Building a Vue app on top of an existing doofpi API is a first-class case. `dfetch`, `pfetch` and
`sfetch` decide how the browser and the server reach it.

- **`pfetch`:** the browser only talks to your noofpi server, which forwards to the API, keeps
  cookies, and runs your `server/proxy.ts` hook to inject an `Authorization` header or answer
  directly
- **`sfetch`:** only the server calls the API, and the browser is blocked from it
- **Origin hidden:** `doofpi.url` is only sent to the browser when `dfetch` is used

No hand-written proxy routes, and the same typed client works in every mode. See
[Fetch Modes](/docs/doofpi/fetch-modes).

### Typed from a single source

One `routes` export is the source of truth, and everything else follows from it.

- **API:** `useDoofpi()` and `useDoofpiFetch()` are typed by your `routes`, with optional Zod
  validation of inputs and outputs at runtime
- **Forms:** `useDoofpiForm` validates with the same Zod schema as the endpoint and maps server
  errors back onto the form fields
- **Navigation:** `navigateTo("/users/:id", { params })` is checked against your pages
- **i18n:** message keys and `{placeholders}` are typed from your default locale
- **Cookies:** typed values through codecs on both the server and the app

The types are generated by `dev` and `build`. There is no step to run and no schema file to keep in
sync. See [Typed Routes](/docs/doofpi/typed-routes) and [Forms](/docs/doofpi/forms).

### Secure by default

Security is enforced in the server handler itself, so it applies to every page and every API call.
Headers, CSRF and the body limit are on with no configuration.

- **Hosts:** opt in with `allowedHosts` to reject unknown `Host` values with a `400`
- **CSRF:** cross-site writes to the API and the proxy get a `403`
- **Body limit:** oversized requests get a `413`, counting streamed bytes as well as
  `Content-Length`
- **Headers:** `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and, over https,
  `Strict-Transport-Security`
- **CSP:** opt in with a per-request nonce, applied only to the page shell so rendered content never inherits
  trust

Every option can be overridden per route with `routeRules`. See [Security](/docs/guides/security).

### Batteries included, one version to track

Fonts, images, i18n, cookies, forms, security, Tailwind CSS v4 and six deploy presets ship in one
package and one config file. There are no modules to choose and no compatibility matrix to keep in
sync.

- **Fonts:** self-hosted Google or local fonts that become Tailwind theme fonts, see
  [Fonts](/docs/guides/fonts)
- **Images:** an AVIF and WebP pipeline behind `?image`, see [Images](/docs/guides/images)
- **i18n:** typed messages with locale detection, see [i18n](/docs/guides/i18n)

### Light to install

A fresh project with `noofpi`, `vue`, `doofpi` and `zod` installs about **105 packages** with Bun.
`nuxt`, `vue` and `vue-router` install about **500**. That is roughly five times fewer packages to
download, audit and update.

### See every request in dev

The devtools overlay lists every doofpi request, both the ones made while rendering on the server
and the ones made in the browser, with the fetch mode, the transport, the status and the timing.
It also shows the matched route, the middleware chain and CSP violations. See
[Devtools](/docs/guides/devtools).

## Choose noofpi When

- you are building with **doofpi** and want a Vue app that uses it natively, with the API served,
  typed and deployed together with your pages
- you already run a **doofpi API** and want a frontend with a built-in backend-for-frontend in
  front of it
- you want one codebase where the API, forms, navigation and translations stay in sync through
  **types**, with nothing to generate by hand
- you like **Nuxt's conventions** and want them on a lighter core, with security, fonts, images
  and i18n included

::Callout{type="tip" title="Migrating a Nuxt app"}
The folder structure and most composable names carry over. Move `server/api` handlers into doofpi
endpoints, replace `definePageMeta` with `useLayout` and `useMiddleware`, and replace `useFetch`
with `useDoofpiFetch`.
::
