---
title: Fonts
description: Self-host Google and local fonts with automatic @font-face rules and Tailwind integration.
---

# Fonts

noofpi self-hosts fonts for you. Declare families in the config and noofpi generates the `@font-face` rules, bundles the files and serves them from your own origin.

## Configuration

```ts [noofpi.config.ts]
import { defineNoofpiConfig } from "noofpi";

export default defineNoofpiConfig({
  tailwind: true,
  fonts: {
    families: [
      {
        provider: "google", // downloaded once, then self-hosted from your own origin
        name: "Inter",
        weight: "100 900", // 400 | [400, 700] | "100 900" (variable). Default: 400
        style: "normal", // "normal" | "italic" | both. Default: normal
        subsets: ["latin", "hebrew"], // default: all (the browser only downloads the ones the page uses)
        alias: "sans", // font-sans / --font-sans (default: kebab-case name -> font-inter)
        fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
        display: "swap", // default
      },
      {
        provider: "local", // woff2, woff, ttf, otf from your project
        name: "Brand",
        src: [
          { src: "app/assets/fonts/Brand-Regular.woff2" },
          { src: "app/assets/fonts/Brand-Bold.woff2", weight: 700 },
        ], // or a single path (uses the family `weight` / `style`)
      },
    ],
  },
});
```

## Providers

| Provider | Source                                      | Notes                                              |
| -------- | ------------------------------------------- | -------------------------------------------------- |
| `google` | Google Fonts                                | Downloaded once, then self-hosted from your origin |
| `local`  | `woff2`, `woff`, `ttf` or `otf` in your project | `src` is a path, or a list of paths with their own `weight` / `style` |

### Family options

| Option     | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| `name`     | Font family name                                                           |
| `weight`   | `400`, `[400, 700]` or `"100 900"` for a variable font. Default: `400`     |
| `style`    | `"normal"`, `"italic"` or both. Default: `"normal"`                        |
| `subsets`  | Google subsets. Default: all; the browser only downloads the ones the page uses |
| `alias`    | Name used for the theme font and CSS variable. Default: kebab-case name, for example `font-inter` |
| `fallback` | Fallback font stack                                                        |
| `display`  | `font-display` value. Default: `"swap"`                                    |
| `src`      | Local provider only: a path or a list of `{ src, weight?, style? }` entries |

## How it works

noofpi writes the `@font-face` rules to `.noofpi/fonts.css`. It is loaded before your own CSS and linked in the head, so SSR does not flash. Vite bundles and hashes the font files.

## Tailwind

With `tailwind: true`, every family becomes a theme font, so `class="font-brand"` works with no extra CSS. noofpi adds the `@theme` block to each stylesheet that has `@import "tailwindcss"`.

```vue
<template>
  <h1 class="font-sans">Inter, as the sans font</h1>
  <p class="font-brand">Brand</p>
</template>
```

::Callout{type="tip" title="Overriding the default stack"}
A user alias of `sans`, `serif` or `mono` replaces Tailwind's default stack, so add `fallback`.
::

Without Tailwind, the stack is available as the CSS variable `var(--font-<alias>)`.

```css [app/assets/main.css]
body {
  font-family: var(--font-sans);
}
```

## Caching

Google responses and font files are cached in `.noofpi/fonts`, so only the first run needs network. Delete that folder to refresh them.

## Custom providers

Providers live in `src/fonts/providers` (`google` and `local`) in the noofpi source. A new one implements `FontProvider` and is registered in `providers/index.ts`.
