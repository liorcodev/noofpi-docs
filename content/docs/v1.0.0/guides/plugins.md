---
title: Plugins
description: Register Vue plugins and Vite plugins.
---

# Plugins

noofpi has no module system. There are two ways to extend it.

| Kind        | Where                   | Use for                                   |
| ----------- | ----------------------- | ----------------------------------------- |
| App plugin  | `app/plugins/`          | Vue plugins (Pinia, directives, globals)  |
| Vite plugin | `vite` in the config    | Build-time features                       |

## App plugins

Place files directly in `app/plugins/` (top-level files only). The default export runs once per app, and once per request on the server, after noofpi's own setup.

```ts [app/plugins/pinia.ts]
import { createPinia } from "pinia";

export default defineNoofpiPlugin(({ app }) => {
  app.use(createPinia());
});
```

The context is `{ app, router, server }`. `server` is `true` while rendering on the server.

- Plugins run in file-name order. Prefix files with `01.`, `02.` to control it.
- `name.client.ts` runs only in the browser, `name.server.ts` only on the server.
- Plugins are synchronous.

## Custom plugin

A plugin is a plain function, so you can write your own. This one adds a `v-focus` directive, a global `$formatPrice` helper, and a navigation logger that runs only in the browser.

```ts [app/plugins/01.helpers.ts]
export default defineNoofpiPlugin(({ app }) => {
  app.directive("focus", {
    mounted: (el: HTMLElement) => el.focus(),
  });

  app.config.globalProperties.$formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
});
```

```ts [app/plugins/02.analytics.client.ts]
export default defineNoofpiPlugin(({ router }) => {
  router.afterEach((to) => {
    console.log("page view", to.fullPath);
  });
});
```

```vue [app/pages/index.vue]
<template>
  <input v-focus />
  <p>{{ $formatPrice(19.9) }}</p>
</template>
```

Use `app.provide` to share a value with `inject`:

```ts [app/plugins/theme.ts]
export default defineNoofpiPlugin(({ app }) => {
  app.provide("theme", "dark");
});
```

## Vite plugins

```ts [noofpi.config.ts]
import { defineNoofpiConfig } from "noofpi";
import somePlugin from "some-vite-plugin";

export default defineNoofpiConfig({
  vite: { plugins: [somePlugin()] },
});
```
