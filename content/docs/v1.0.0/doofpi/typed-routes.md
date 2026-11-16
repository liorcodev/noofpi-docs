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
