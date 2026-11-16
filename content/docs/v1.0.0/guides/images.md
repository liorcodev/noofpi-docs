---
title: Images
description: Optimized, layout-shift-free images with the ?image import and NoofpiImage.
---

# Images

Import an image with the `?image` query and pass it to `<NoofpiImage>`.

```vue [app/pages/about.vue]
<script setup lang="ts">
import hero from "../assets/hero.jpg?image";
</script>

<template>
  <NoofpiImage
    :src="hero"
    alt="Our team"
    sizes="(min-width: 768px) 50vw, 100vw"
    priority
  />
</template>
```

- `width` and `height` come from the file, so the browser reserves the space (no layout shift).
- `noofpi build` writes AVIF and WebP copies at several widths into `assets/` and renders them
  as `<picture>` sources. The original stays the fallback `<img>`. In dev only the original is
  served.
- Images are lazy by default. `priority` loads them right away with high priority, use it for
  the main image of a page.
- `class` and other attributes go on the `<img>`.
- A plain URL string works too, without variants:
  `<NoofpiImage src="/logo.png" :width="64" :height="64" />`.
- Supported inputs: JPEG, PNG, WebP and AVIF. Encoding uses [sharp](https://sharp.pixelplumbing.com).

## Configuration

```ts [noofpi.config.ts]
export default defineNoofpiConfig({
  images: { formats: ["avif", "webp"], widths: [640, 1024, 1920], quality: 75 },
});
```

| Option    | Default              | Description                                          |
| --------- | -------------------- | ---------------------------------------------------- |
| `formats` | `avif`, `webp`       | Formats written at build time                        |
| `widths`  | `640, 1024, 1920`    | Variant widths, never larger than the original       |
| `quality` | `75`                 | Encoder quality                                      |

Add `noofpi/client` to your tsconfig `types` so `?image` imports are typed, see
[Auto-imports](/docs/core-concepts/auto-imports).
