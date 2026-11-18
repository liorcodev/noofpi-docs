---
title: Data Fetching
description: useAsyncData, useDoofpiFetch, route loaders and shared state.
---

# Data Fetching

## useAsyncData

```vue
<script setup lang="ts">
import { useAsyncData, useDoofpi } from "noofpi/runtime";

const client = useDoofpi();
const { data, error, pending, refresh } = useAsyncData("hello", () => client.hello.read());
</script>
```

- On the server the handler runs while rendering and its result is embedded in the HTML
  (`#__noofpi_payload__`). The browser hydrates from it **without fetching again**.
- Client-side navigation runs the handler in the browser. `refresh()` always runs it again.
- `key` must be unique per piece of data. Results must be JSON-serializable. Errors become
  `{ message, status? }`.
- `{ server: false }` skips the server fetch and fetches in the browser only.

### Errors on the server

An error thrown while rendering on the server ends up in the HTML, so only messages that are meant
for the user are kept:

- an error made with `createError()`
- an error from the doofpi API (`DoofpiClientError`), for example `401 Invalid credentials`. Its
  message is what your API's `onError` returned

Any other error (a bug, a network failure, a library error) becomes `Internal Server Error` and its
real message stays on the server. The `status` is kept either way. In the browser every message is
kept.

## useDoofpiFetch

`useAsyncData` with the doofpi client handed to your handler, so you skip `useDoofpi()`. Same
options and return value.

```vue
<script setup lang="ts">
// the client is typed by the `routes` export of server/doofpi.ts
const { data, error, pending, refresh } = useDoofpiFetch(
  "hello",
  (client) => client.hello.read(),
  { server: true },
);
</script>
```

## Route Loaders

A loader runs before the page renders. It is a module export in a plain `<script>` block next to
`<script setup>`.

```vue [app/pages/users/[id].vue]
<script lang="ts">
export const page = definePage({
  loader: async ({ params }) => {
    const client = useDoofpi(); // call it before the first `await`
    return client.users.get.read({ id: params.id });
  },
});
</script>

<script setup lang="ts">
const { data, error, pending, refresh } = useLoaderData(page); // `data` is typed by the loader
</script>
```

- The loader runs after the route middleware (a redirected or aborted navigation never runs it)
  and before the page is shown. On the first load it runs on the server and its result is
  embedded in the HTML. The browser hydrates from it **without running it again**.
  Client-side navigation runs it in the browser and waits for it.
- It receives `{ route, params, query }` of the page it loads. `useDoofpi()` works at its start
  and uses the fetch mode of that page. After an `await`, use the client you already have.
- Results must be JSON-serializable. A thrown error becomes `error` (`{ message, status? }`)
  instead of failing the navigation, with the same [server-side message rules](#errors-on-the-server)
  as `useAsyncData`. `refresh()` runs the loader again.
- Pass the `page` that the same file exports. In dev, `useLoaderData()` warns when it does not
  belong to the current route. Changing a loader in dev needs a page reload.

### Prefetch

Hovering, focusing or touching a link to a page (`<NoofpiLink>` or a plain `<a>`) loads the page
and runs its loader ahead of the click. The navigation reuses that result for 30 seconds.

::Callout{type="tip" title="Keep loaders side-effect free"}
Because of prefetch, loaders should have no side effects. Add `data-no-prefetch` to a link to
opt out. Nothing is prefetched in data saver mode.
::

## Shared State

```ts
const counter = useState("counter", () => 0); // Ref<number>
counter.value++;
```

- Every caller that uses the same `key` shares one reactive `ref`, kept for the lifetime of the
  app.
- It is created **per request** on the server, so unlike a module-level `ref` nothing leaks
  between users. The value is embedded in the HTML and the browser starts from it, so
  hydration matches.
- It works anywhere, not only in `setup()`: route middleware, `app/composables` and `app/utils`
  functions, event handlers, and after an `await`. It throws only when no request is being
  rendered and it is not running in the browser.
- `init` only runs when there is no value yet. Without `init` the `ref` is `undefined` until you
  set it.
- Values must be JSON-serializable (`undefined` is not transferred).
