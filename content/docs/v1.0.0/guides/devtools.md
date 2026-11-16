---
title: Devtools
description: The dev-only overlay for routes, middleware, doofpi requests and CSP violations.
---

# Devtools

`noofpi dev` shows a small `noofpi` button in the corner of every page. It opens a panel with:

- the current route: matched pattern, layout, rendering mode and doofpi fetch mode
- the middleware chain: global first, then named. Unknown names are flagged
- the matched `routeRules`
- the doofpi requests (the request inspector)
- the CSP violations the browser reported

## Request Inspector

The inspector lists every doofpi request, the ones made while rendering on the server and the
ones made in the browser. Each entry shows the fetch mode, the transport, the status and the time
until the response arrived. The transport is `in-process` for SSR `lfetch` and `pfetch`, which
never touch the network, or `http`.

## Moving the Button

The `noofpi` button is draggable, so you can move it off anything it covers. Its position is
remembered in `localStorage` and the panel opens next to it.

## Turning It Off

The overlay is never part of production builds. Turn it off in development with:

```ts [noofpi.config.ts]
export default defineNoofpiConfig({
  devtools: false,
});
```
