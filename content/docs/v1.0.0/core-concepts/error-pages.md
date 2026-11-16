---
title: Error Pages
description: Replace the app with your own error page and throw errors from pages and middleware.
---

# Error Pages

Add `app/error.vue` to replace the app with your own error page. It receives the error as an
`error` prop (`{ statusCode, statusMessage, message, url? }`) and is used, on the server and in
the browser, when:

- no page matches the URL (`404`, "Page not found: /url") or a route middleware aborts the
  navigation (`false`)
- a page, layout or route middleware throws an error made with `createError()`. Its
  `statusCode` becomes the response status
- anything else throws while the page renders on the server (`500`). The real error is logged
  and its message is not sent to the browser

```vue [app/error.vue]
<script setup lang="ts">
import type { NoofpiErrorData } from "noofpi/runtime";

defineProps<{ error: NoofpiErrorData }>();
</script>

<template>
  <h1>{{ error.statusCode }}</h1>
  <p>{{ error.message }}</p>
  <button @click="clearError({ redirect: '/' })">Back home</button>
</template>
```

The error page replaces the whole app, `app.vue` included, so add `<NoofpiLayout>` yourself if you
want a layout around it. Without `app/error.vue`, unmatched URLs render an empty page with a
`404` status.

## API

```ts
throw createError({ statusCode: 403, message: "Members only" }); // in a page's <script setup> or route middleware
showError({ statusCode: 503, message: "Down for maintenance" }); // in the browser, e.g. after a failed action
clearError({ redirect: "/" }); // hide the error page, optionally navigating somewhere
const error = useError(); // Ref<NoofpiErrorData | null>, in setup()
```

All four are auto-imported.

::Callout{type="note"}
`createError()` only takes error statuses (400-599). Any other `statusCode` becomes `500`. In the
browser the error page is hidden by the next successful navigation. Errors from `useAsyncData`
stay in that composable's `error` ref and do not show the error page.
::
