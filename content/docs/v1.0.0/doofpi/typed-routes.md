---
title: Typed Routes
description: Typed doofpi clients and typed navigation, generated from your code.
---

# Typed Routes

## doofpi Routes

Export your routes from `server/doofpi.ts` as `routes`. noofpi generates `.noofpi/doofpi.d.ts` (on
`dev` and `build`, included by the `.noofpi/*.d.ts` tsconfig entry) that types `useDoofpi()` and
`useDoofpiFetch()` with them.

```ts [server/doofpi.ts]
export const routes = d.routes({ hello: d.endpointBuilder.read(() => "hi") });
```

Without a `routes` export the clients are untyped (`any`). Pass a routes type to override:
`useDoofpi<OtherRoutes>()`.

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
