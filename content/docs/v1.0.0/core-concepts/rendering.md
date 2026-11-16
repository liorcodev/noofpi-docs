---
title: Rendering & Route Rules
description: SSR or SPA, per-route overrides with routeRules, and client-only components.
---

# Rendering & Route Rules

noofpi server-renders pages by default. Set `ssr: false` for a client-only SPA, or opt out for
specific routes with `routeRules`.

```ts [noofpi.config.ts]
export default defineNoofpiConfig({
  ssr: true,
  routeRules: {
    "/admin/**": { ssr: false }, // the path itself and everything below it
    "/shop/*": { ssr: false }, // exactly one segment
    "/about": { ssr: false }, // exact
  },
});
```

## How Rules Match

| Pattern     | Matches                              |
| ----------- | ------------------------------------ |
| `/about`    | exactly `/about`                     |
| `/shop/*`   | exactly one segment below `/shop`    |
| `/admin/**` | `/admin` and everything below it     |

Patterns match the URL path. When several match, the longest one wins. Rules can only turn SSR
off: `ssr: true` in a rule needs `ssr: true` globally.

`ssr: false` serves the empty HTML shell (with the config `head`) and the browser renders the
page. The rest of the app is still server-rendered.

::Callout{type="warning" title="Guard sensitive pages on the server"}
Pages with `ssr: false` are not rendered by the server, so their route middleware only runs in
the browser. Protect anything sensitive with server middleware or in the API itself.
::

## Per-route Security

A rule can override the global [security](/docs/guides/security) options for the paths it
matches.

```ts [noofpi.config.ts]
routeRules: {
  "/embed/**": { security: { csp: false, headers: { "X-Frame-Options": false } } },
  "/doofpi/webhooks/**": { security: { csrf: false } },
  "/doofpi/uploads/**": { security: { bodyLimit: 100 * 1024 * 1024 } },
  "/admin/**": { security: { csp: { directives: { "default-src": ["'self'"] } } } },
},
```

| Option      | Effect                                                                           |
| ----------- | -------------------------------------------------------------------------------- |
| `csp`       | Replaces the global CSP for matching pages. `false` sends none                   |
| `headers`   | Applied on top of the global headers. A `false` value removes one                |
| `csrf`      | Replaces the global CSRF check for matching API and proxy paths. `false` turns it off |
| `bodyLimit` | Replaces the global body limit in bytes. `false` turns it off                    |

When several rules match, each option comes from the longest matching pattern. Invalid options
fail at startup.

## Per-route Fetch Mode

A rule can also set `fetch`, see [Fetch Modes](/docs/doofpi/fetch-modes#per-route-fetch-mode).

## ClientOnly

Wrap browser-only content (anything using `window`, `localStorage`, a chart library) in
`<ClientOnly>`. Its slot is skipped on the server and rendered after the app mounts, so
hydration still matches. Until then it shows the `fallback` slot, a `fallback` text (in a
`fallbackTag` element, `span` by default), or nothing.

```vue
<ClientOnly fallback="Loading chart...">
  <Chart :data="data" />
</ClientOnly>

<ClientOnly>
  <Chart :data="data" />
  <template #fallback><Skeleton /></template>
</ClientOnly>
```
