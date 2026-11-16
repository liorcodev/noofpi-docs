---
title: Fetch Modes
description: Choose how the browser and SSR reach your doofpi API - dfetch, pfetch, lfetch or sfetch.
---

# Fetch Modes

| Mode     | Browser calls                                      | During SSR                                    |
| -------- | -------------------------------------------------- | --------------------------------------------- |
| `dfetch` | remote API directly                                | remote API directly                           |
| `pfetch` | noofpi server `/_noofpi/proxy/*` to the remote API | same proxy, called in-process (cookies kept)  |
| `lfetch` | noofpi's own `server/doofpi.ts` at `doofpi.root`   | in-process call, no HTTP                      |
| `sfetch` | blocked (rejects with an error)                    | remote API directly                           |

`sfetch` requires `ssr: true`. `lfetch` requires `new Doofpi({ root })` to use the same
`doofpi.root` as the config.

```vue
<script setup lang="ts">
const client = useDoofpi(); // auto-imported, call inside setup()
</script>
```

## Per-route Fetch Mode

`doofpi.fetch` is the default. A route rule can pick another mode for the pages it matches.

```ts [noofpi.config.ts]
export default defineNoofpiConfig({
  doofpi: { fetch: "lfetch", url: "https://api.example.com" },
  routeRules: {
    "/admin/**": { fetch: "sfetch" }, // the browser never reaches the API for admin pages
    "/status": { fetch: "dfetch" },
  },
});
```

- `useDoofpi()` and `useDoofpiFetch()` use the mode of the page they are called on, including in
  route middleware (the page being navigated to). Layouts and `app.vue` are set up once, so call
  them in the page itself.
- Rules follow the usual matching, the longest pattern wins. `doofpi.url` is required as soon as
  any mode other than `lfetch` is used, by default or in a rule.
- The pfetch proxy is mounted when any rule uses `pfetch`. The browser only receives
  `doofpi.url` when `dfetch` is used somewhere.
- `fetch: "sfetch"` needs a server-rendered page. It is rejected with `ssr: false`.

## Explicit Mode

doofpi calls (`client.hello.read()`) always use the transport of their client, so the mode is
chosen when you get the client.

```ts
const client = useDoofpi(); // the current page's mode
const server = useDoofpi({ mode: "sfetch" }); // an explicit mode
const { data } = useDoofpiFetch("secret", (c) => c.secret.read(), {
  mode: "sfetch",
});
```

The mode has to be enabled in the config (`doofpi.fetch` or some `routeRules[...].fetch`),
because that decides the proxy, the browser's `doofpi.url` and the `doofpi.url` check. Otherwise
it throws. `lfetch` is always allowed.

## Proxy Hook

With `pfetch`, add auth or short-circuit requests in `server/proxy.ts`.

```ts [server/proxy.ts]
import type { ProxyHook } from "noofpi/server";

// add auth, or return a Response to short-circuit
export default (({ request, headers }) => {
  headers.set("authorization", "Bearer ...");
}) satisfies ProxyHook;
```

`ProxyHook` types `request`, `headers` and `target` (the URL on the remote API). Without it, strict TypeScript reports implicit `any` parameters.

The proxy only forwards to `doofpi.url` below `doofpi.root`.

::Callout{type="warning" title="sfetch and the browser"}
With `sfetch` there is no browser fetch, so data only works on the first, server-rendered page
load. Use `lfetch` or `pfetch` if the page can also be reached by client-side navigation.
::
