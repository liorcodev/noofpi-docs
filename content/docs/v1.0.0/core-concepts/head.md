---
title: Head
description: Set the title and meta tags globally in the config and per page with useHead.
---

# Head

## Defaults in the Config

```ts [noofpi.config.ts]
export default defineNoofpiConfig({
  head: {
    title: "%s | My site", // %s is filled by the page
    meta: [{ name: "description", content: "..." }],
    link: [{ rel: "icon", href: "/favicon.ico" }],
    htmlAttrs: { lang: "en" }, // also bodyAttrs
  },
});
```

A title without `%s` is only the default.

## Per Page

```vue [app/pages/about.vue]
<script setup lang="ts">
useHead({
  title: "About", // -> "About | My site"
  meta: [{ name: "description", content: "About us" }], // replaces the default description
});

// reactive: pass a getter
useHead(() => ({ title: user.value.name }));
</script>
```

## Rules

- Pages without a title show the config title with `%s` removed (`"%s | My site"` becomes
  `"My site"`). With no config title it is `noofpi`.
- Tags with the same identity (`name`, `property`, `http-equiv`, canonical link, `rel` plus
  `href`) replace earlier ones. The last `title` wins.
- `true` renders a bare attribute. `false` and `undefined` leave it out.
- Call `useHead` in `setup()`. It is removed when the component unmounts.

## Rendering

The head is rendered on the server for SSR pages, resolved after rendering so titles from
`useAsyncData` work, and kept in sync in the browser on navigation.

Client-only pages (`ssr: false`) get the config defaults from the server and the page's
`useHead` once the browser renders it.

Attribute names that could break out of a tag, and `on*` event-handler attributes, are dropped.
