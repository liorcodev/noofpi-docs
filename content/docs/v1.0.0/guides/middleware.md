---
title: Middleware
description: Guard navigations with route middleware and wrap every request with server middleware.
---

# Middleware

noofpi has two kinds of middleware. Route middleware runs before a navigation, on the server (SSR) and in the browser. Server middleware wraps every request the noofpi server handles.

| Kind              | Folder               | Runs                          | Define with                |
| ----------------- | -------------------- | ----------------------------- | -------------------------- |
| Route middleware  | `app/middleware/`    | Before each navigation        | `defineRouteMiddleware`    |
| Server middleware | `server/middleware/` | Around every server request   | `defineServerMiddleware`   |

## Route middleware

Place files directly in `app/middleware/` (top-level files only). The default export is the middleware.

```ts [app/middleware/auth.ts]
export default defineRouteMiddleware(async (to, from) => {
  const client = useDoofpi(); // inject()-based composables work here
  if (!(await client.session.read()).user) return "/login";
});
```

A named middleware does nothing until a page opts in with `useMiddleware`:

```vue [app/pages/dashboard.vue]
<script setup lang="ts">
useMiddleware("auth"); // or useMiddleware(["auth", "admin"])
</script>
```

`defineRouteMiddleware` and `useMiddleware` are auto-imported and also exported from `noofpi/runtime`.

::Callout{type="warning" title="Use string literals"}
Pass string literals to `useMiddleware`. Like `useLayout`, noofpi reads them at build time because the middleware has to run before the page renders. In dev, `useMiddleware()` warns when its call was not picked up.
::

### Global middleware

Name the file `*.global.ts` to run it on every navigation. Global middleware runs in file-name order, before named ones.

```ts [app/middleware/log.global.ts]
export default defineRouteMiddleware((to) => {
  console.log("->", to.path);
});
```

### Return values

| Return                                   | Effect                      |
| ---------------------------------------- | --------------------------- |
| nothing or `true`                        | Continue to the next step   |
| `false`                                  | Abort the navigation        |
| a location such as `"/login"` or `{ name: "..." }` | Redirect to it    |

The first redirect or abort stops the chain.

### Server and browser behavior

- On the server a redirect becomes a real `302` and an abort becomes a `404`.
- In the browser it behaves like a normal navigation guard.
- An abort renders [`app/error.vue`](/docs/core-concepts/error-pages) when you have one.
- An unknown middleware name throws instead of being skipped, so a guard can never silently not run.
- A [route loader](/docs/doofpi/data-fetching) runs after the route middleware. A redirected or aborted navigation never runs it.

::Callout{type="warning" title="ssr: false pages"}
Pages with `ssr: false` are not rendered by the server, so their route middleware only runs in the browser. Guard anything sensitive with server middleware or in the API itself.
::

## Server middleware

Files in `server/middleware/` wrap every request the noofpi server handles: pages, the doofpi API and the pfetch proxy. Static assets and Vite modules are not included. SSR data fetches through `lfetch` and `pfetch` go through the same handler, so they pass through the middleware too.

Files run in file-name order, outermost first. Prefix names with `01-`, `02-` to control the order.

```ts [server/middleware/01-auth.ts]
import { defineServerMiddleware } from "noofpi/server";

export default defineServerMiddleware(
  async ({ request, url, env, cookies }, next) => {
    if (url.pathname.startsWith("/admin") && !request.headers.get("cookie"))
      return new Response("Unauthorized", { status: 401 }); // short-circuit
    const response = await next(); // continue; change the response if you like
    const headers = new Headers(response.headers);
    headers.set("x-frame-options", "DENY");
    return new Response(response.body, { status: response.status, headers });
  },
);
```

### Context

The first argument holds the request and the helpers for it:

| Field     | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `request` | The incoming `Request`                                                   |
| `url`     | The parsed `URL` of the request                                          |
| `env`     | Platform environment, for example Cloudflare bindings                    |
| `cookies` | The request's [cookie jar](/docs/guides/cookies), also applied when you return your own `Response` |

The second argument, `next()`, continues the chain and resolves to the downstream `Response`.

::Callout{type="note"}
Server middleware must return a `Response` (return `next()` to continue). Anything else fails the request with a 500.
::

## Related

- [Cookies](/docs/guides/cookies) for the jar available as `cookies`.
- [Security](/docs/guides/security) for built-in headers, CSRF and body limits.
- [Layouts](/docs/core-concepts/layouts) for `useLayout`, which also reads string literals at build time.
