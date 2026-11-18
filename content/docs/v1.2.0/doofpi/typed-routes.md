---
title: Typed Routes
description: Typed doofpi clients and typed navigation, generated from your code.
---

# Typed Routes

::Callout{type="note" title="New in 1.2.0"}
`Register` has separate `localRoutes` and `remoteRoutes` keys, and the clients are typed with the
routes of their fetch mode. Before 1.2.0 there was one global `routes` key.

Upgrading from 1.1.x:

- `.noofpi/doofpi.d.ts` now registers `localRoutes` (and `defaultFetch`) instead of `routes`.
  Rerun `dev` or `build` to regenerate it.
- If your `env.d.ts` registers the routes of a remote API as `routes`, rename the key to
  `remoteRoutes`. A `routes` key still works as the fallback for every mode, so nothing breaks, but
  with a `server/doofpi.ts` it no longer clashes with the generated file.
- `useDoofpi<OtherRoutes>()` and `useDoofpiFetch<T, OtherRoutes>()` work as before.
::
## doofpi Routes

Export your routes from `server/doofpi.ts` as `routes`. noofpi generates `.noofpi/doofpi.d.ts` (on
`dev` and `build`, included by the `.noofpi/*.d.ts` tsconfig entry) that registers them as the
`localRoutes` of `Register` in `noofpi/runtime`. `lfetch` clients, which call `server/doofpi.ts`,
are typed with it.

```ts [server/doofpi.ts]
export const routes = d.routes({ hello: d.endpointBuilder.read(() => "hi") });
```

Without a `routes` export the clients are untyped (`any`). Pass a routes type to override:
`useDoofpi<OtherRoutes>()`.

## Routes of a Remote API

With `pfetch`, `dfetch` or `sfetch` the client calls a remote API, so there is no `routes` export
in `server/doofpi.ts` to generate the types from. Register the routes type of the API yourself as
`remoteRoutes`, by augmenting `Register` in `noofpi/runtime`:

```ts [env.d.ts]
import type { AppRoute } from "../my-api/app/routes/appRoute";

declare module "noofpi/runtime" {
  interface Register {
    remoteRoutes: AppRoute;
  }
}
```

`AppRoute` is `typeof` the value returned by `d.routes({ ... })` in the API project. Include
`env.d.ts` in `tsconfig.json`.

## Typing by Fetch Mode

`Register` has one routes type per kind of client. The client is typed with the one of its mode:

| `Register` key | Filled in by             | Used by                              |
| -------------- | ------------------------ | ------------------------------------ |
| `localRoutes`  | `.noofpi/doofpi.d.ts`    | `lfetch`                             |
| `remoteRoutes` | you                      | `dfetch`, `pfetch`, `sfetch`         |
| `routes`       | you (optional)           | any mode without its own key above   |
| `defaultFetch` | `.noofpi/doofpi.d.ts`    | the mode of a call without `{ mode }` |

```vue [app/pages/index.vue]
<script setup lang="ts">
// typed with localRoutes
const { data } = useDoofpiFetch("hello", (c) => c.hello.read(), { mode: "lfetch" });
// typed with remoteRoutes
const client = useDoofpi({ mode: "pfetch" });
</script>
```

A key that is not registered falls back to `routes`, and to `any` when there is none, so a project
that only registers `routes` keeps working. Registered routes are never widened to `any`: calling an
endpoint the routes of the mode do not have is a type error.

`defaultFetch` is the `doofpi.fetch` of the config. A call without `{ mode }` is typed for it, so
with `fetch: "pfetch"` the routes are `remoteRoutes`.

::Callout{type="warning" title="routeRules are not visible to the types"}
The types know the `doofpi.fetch` of the config and the `{ mode }` of the call, but not the
`routeRules[...].fetch` of the page. On a page whose rule differs from the global mode, a call
without `{ mode }` is typed for the global mode while it runs with the mode of the rule. Pass
`{ mode }` in the call on those pages, with the mode of the rule.
::

### Typing a Call with Another Routes Type

To type a call with routes that are not registered, pass the routes type in the call. Annotate the
`client` parameter of `useDoofpiFetch()`. Its routes type is inferred from it:

```vue [app/pages/index.vue]
<script setup lang="ts">
import type { DoofpiClient } from "noofpi/runtime";
import type { OtherRoutes } from "../../other";

const { data } = useDoofpiFetch("hello", (client: DoofpiClient<OtherRoutes>) =>
  client.hello.read(),
);
</script>
```

With `useDoofpi()` pass it as the generic: `useDoofpi<OtherRoutes>()`. With `useDoofpiFetch()` the
first generic is the result type, so annotate the client instead.

The type override and the runtime mode are separate: neither one changes the other.

## Server env and context

Handlers receive `env` (the platform environment, for example Cloudflare bindings) and `ctx`.
Both are typed `object` until you declare them:

- `defineEnv<Env>()` types `env`.
- `createContext(fn)` builds `ctx` once per request from `{ req, url, path, env, extra }`. Its
  return value types `ctx`.

Call `defineEnv` first so `createContext` sees the typed `env`.

```ts [server/doofpi.ts]
const d = new Doofpi({ root: "/doofpi" })
  .defineEnv<Env>()
  .createContext(({ env }) => ({ r2: env.R2 }));

export const routes = d.routes({
  files: d.endpointBuilder.read(async ({ ctx, env }) => {
    const list = await ctx.r2.list(); // same bucket as env.R2
    return { keys: list.objects.map((o) => o.key) };
  }),
});
```

`env` and `ctx` are also available in `onRequest`, `onResponse`, `onError` and endpoint
`middleware`. Server middleware (`server/middleware/*.ts`) gets `env` as `unknown`, so cast it.

### Cloudflare bindings

`wrangler types` reads `wrangler.json` and writes a global `Env` with your bindings and vars to
`worker-configuration.d.ts`. Include that file in `tsconfig.json` and use `Env` as above, with no
hand-written binding types. Rerun it after you change `wrangler.json`. Projects created with the
Cloudflare presets have this set up, including a `types` script.

```json [tsconfig.json]
{ "include": ["app", "server", ".noofpi/*.d.ts", "worker-configuration.d.ts"] }
```

## Typed Navigation

noofpi also generates `.noofpi/routes.d.ts` from `app/pages` (on `dev` and `build`). New or
removed pages are picked up while `dev` runs. `navigateTo()` then checks the path against your
pages and requires its params.

```ts
navigateTo("/users/:id", { params: { id: user.id } }); // -> /users/5
navigateTo("/docs/:slug(.*)*", {
  params: { slug: ["a", "b"] },
  query: { q: "x" },
}); // -> /docs/a/b?q=x
navigateTo("/users/:id"); // type error: params are required
navigateTo("/users/5", { replace: true }); // any concrete path or router location also works
```

Paths are the route patterns of your page files: `users/[id].vue` becomes `/users/:id` and
`docs/[...slug].vue` becomes `/docs/:slug(.*)*`.

Call `navigateTo` in `setup()`, an event handler or any browser code. In route middleware,
return the location instead (`return "/login"`). Without the generated file, it is an untyped
`router.push`.
