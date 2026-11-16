---
title: Cookies
description: Read and write cookies on the server with a request-scoped jar, typed codecs and the useCookie composable.
---

# Cookies

noofpi gives you a cookie jar on the server and a `useCookie` composable in the app. Values are strings by default; typed codecs wrap them in your own type.

noofpi does not set cookies on its own, except `noofpi-locale` when you call `setLocale()` with [i18n](/docs/guides/i18n).

## Server jar

Every request gets a cookie jar that reads the request's `Cookie` header and collects the `Set-Cookie` headers for the response. This also works when a middleware short-circuits and on redirects.

```ts [server/middleware/01-session.ts]
import { defineServerMiddleware } from "noofpi/server";

export default defineServerMiddleware(async ({ cookies }, next) => {
  const sid = cookies.get("sid"); // string | undefined
  cookies.set("seen", "1", { maxAge: 3600 });
  cookies.remove("old"); // pass the same `path` / `domain` the cookie was set with
  return next();
});
```

| Method                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `get(name)`             | The value, or `undefined`                  |
| `set(name, value, opts)` | Queue a `Set-Cookie` header               |
| `remove(name, opts)`    | Expire the cookie                          |
| `getAll()`              | All cookies of the request                 |
| `has(name)`             | Whether the cookie is set                  |

A cookie you set or remove is visible to later `get` calls of the same request.

### Doofpi endpoints

A doofpi endpoint gets the same jar from the request it is given, through `getRequestCookies`:

```ts [server/doofpi.ts]
import { getRequestCookies } from "noofpi/server";

.write(({ req }) => {
  getRequestCookies(req).set("session", token, { maxAge: 60 * 60 * 24 });
})
```

`getRequestCookies(req)` needs the original `Request`: the `req` of a doofpi endpoint or the `request` of a middleware.

### Defaults and options

Cookies are set with `Path=/`, `HttpOnly`, `SameSite=Lax`, and `Secure` over https. Every option can be overridden per call:

`maxAge`, `expires`, `domain`, `path`, `secure`, `httpOnly`, `sameSite`, `partitioned`

`SameSite=None`, `Partitioned` and `__Secure-` or `__Host-` names always get `Secure`.

### Validation

Names, `path` and `domain` are validated, so headers and attributes cannot be injected. A cookie over 4096 bytes throws.

## Typed values

A **codec** (`{ encode, decode }`) wraps the string value in your own type. `decode` throws on a value it does not accept, and the cookie then counts as not set.

| Codec              | Type                |
| ------------------ | ------------------- |
| `stringCodec`      | `string` (default)  |
| `numberCodec`      | `number`            |
| `booleanCodec`     | `boolean`           |
| `jsonCodec<T>()`   | `T`                 |
| `enumCodec([...])` | a union of literals |

```ts
import { numberCodec } from "noofpi/server"; // also from "noofpi/runtime"

cookies.set("n", 5, { codec: numberCodec });
cookies.get("n", numberCodec); // number | undefined
```

### Custom codecs

Any object with `encode` and `decode` works:

```ts
type UserId = string & { readonly brand: "UserId" };

const userId = {
  encode: (id: UserId) => `u-${id}`,
  decode: (raw: string) => {
    if (!raw.startsWith("u-")) throw new Error("not a user id");
    return raw.slice(2) as UserId;
  },
};
```

### defineCookie

`defineCookie` keeps the name, codec and options in one place, shared by the server and the app:

```ts [app/utils/cookies.ts]
import { defineCookie, enumCodec } from "noofpi/runtime"; // also from "noofpi/server"

export const theme = defineCookie("theme", {
  codec: enumCodec(["light", "dark"]),
  maxAge: 60 * 60 * 24 * 365,
});
```

```ts
cookies.get(theme); // "light" | "dark" | undefined
cookies.set(theme, "dark");
```

## App cookies

`useCookie` returns a ref bound to a cookie. It is auto-imported and also exported from `noofpi/runtime`.

```vue [app/pages/index.vue]
<script setup lang="ts">
const theme = useCookie("theme", {
  codec: enumCodec(["light", "dark"]),
  default: () => "light", // used while the cookie is not set; not written until you assign
  maxAge: 60 * 60 * 24 * 365,
});
const prefs = useCookie(prefsCookie); // a defineCookie() definition
</script>

<template>
  <button @click="theme = theme === 'dark' ? 'light' : 'dark'">
    {{ theme }}
  </button>
</template>
```

- Assigning writes the cookie. Assigning `undefined` or `null` removes it.
- Assign a new value instead of mutating an object in place.
- During SSR it reads the request's cookies, and a cookie you set goes out as `Set-Cookie` with the page, so the server HTML and hydration agree.
- In the browser it reads and writes `document.cookie`.

`useCookies()` returns the jar itself (`get`, `set`, `remove`, `getAll`) for imperative code, for example in [route middleware](/docs/guides/middleware).

::Callout{type="warning" title="HttpOnly and caching"}
Cookies written by `useCookie` are readable by scripts: `HttpOnly` is off by default, and browsers cannot create HttpOnly cookies. HttpOnly cookies set on the server are not visible to the app in the browser. Pages whose render depends on a cookie should not be cached at a CDN.
::
