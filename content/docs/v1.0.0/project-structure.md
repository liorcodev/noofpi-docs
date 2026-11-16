---
title: Project Structure
description: The folders and files of a noofpi project and what each one does.
---

# Project Structure

A noofpi project is a config file, an `app/` folder for the Vue side and a `server/` folder for the doofpi side.

```text
my-app/
  noofpi.config.ts
  app/
    app.vue            optional root component (default: the page inside its layout)
    error.vue          optional custom error page (404, thrown errors)
    layouts/           default.vue, admin.vue, ...
    pages/             file routes: index.vue, about.vue, users/[id].vue, docs/[...slug].vue
    middleware/        route middleware: auth.ts (named), log.global.ts (global)
    assets/main.css    loaded automatically if it exists
    components/        auto-imported components: Hint.vue, base/Button.vue -> <BaseButton>
    composables/       auto-imported exports (useFoo.ts, ...)
    utils/             auto-imported exports
  server/
    doofpi.ts          default export: your Doofpi instance (served at doofpi.root)
    proxy.ts           optional pfetch hook
    middleware/        optional server middleware, run in file-name order
```

## Files and folders

| Path                          | Purpose                                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `noofpi.config.ts`            | Project configuration, written with `defineNoofpiConfig`. See [Configuration](/docs/core-concepts/configuration).           |
| `app/app.vue`                 | Optional root component. Without it noofpi renders `<NoofpiLayout />` for you.                                               |
| `app/error.vue`               | Optional custom error page for 404s and thrown errors. See [Error Pages](/docs/core-concepts/error-pages).                   |
| `app/layouts/`                | Layout components with a `<slot />`. `default.vue` is used by every page that does not choose one.                           |
| `app/pages/`                  | File-based routes.                                                                                                           |
| `app/middleware/`             | Route middleware. Top-level files only. `name.global.ts` runs on every navigation. See [Middleware](/docs/guides/middleware). |
| `app/plugins/`                | Vue plugins. Top-level files only. `name.client.ts` and `name.server.ts` run on one side. See [Plugins](/docs/guides/plugins). |
| `app/assets/main.css`         | Loaded automatically if it exists (or set `css` in the config).                                                              |
| `app/components/`             | Auto-imported components. The folder path is the name prefix: `base/Button.vue` becomes `<BaseButton />`.                     |
| `app/composables/`            | Auto-imported exports (top-level files and the `index.ts` of sub-folders).                                                   |
| `app/utils/`                  | Auto-imported exports, same rules as composables.                                                                            |
| `app/locales/`                | One file per locale when `i18n` is set. See [i18n](/docs/guides/i18n).                                                       |
| `server/doofpi.ts`            | Default export is your Doofpi instance, served at `doofpi.root`. Export `routes` for typed clients.                           |
| `server/proxy.ts`             | Optional hook for the pfetch proxy. See [Fetch Modes](/docs/doofpi/fetch-modes).                                             |
| `server/middleware/`          | Optional server middleware, run in file-name order (`01-auth.ts`, `02-log.ts`).                                              |
| `.noofpi/`                    | Generated files. Do not edit and do not commit.                                                                              |
| `.output/`                    | Production build written by `noofpi build`.                                                                                  |

## Page routes

The path of a file in `app/pages` decides its URL.

| File                       | Route                |
| -------------------------- | -------------------- |
| `pages/index.vue`          | `/`                  |
| `pages/about.vue`          | `/about`             |
| `pages/users/[id].vue`     | `/users/:id`         |
| `pages/docs/[...slug].vue` | `/docs/:slug(.*)*`   |

These patterns are also what typed `navigateTo()` accepts. See [Typed Routes](/docs/doofpi/typed-routes).

## Generated files

noofpi writes these into `.noofpi/` on `noofpi dev` and `noofpi build`:

| File                            | Content                                                              |
| ------------------------------- | -------------------------------------------------------------------- |
| `.noofpi/auto-imports.d.ts`     | Types for auto-imported APIs and your composables and utils          |
| `.noofpi/components.d.ts`       | Types for auto-imported components                                   |
| `.noofpi/doofpi.d.ts`           | Types `useDoofpi()` and `useDoofpiFetch()` from the `routes` export  |
| `.noofpi/routes.d.ts`           | Page route patterns for typed `navigateTo()`                         |
| `.noofpi/i18n.d.ts`             | Typed message keys, when `i18n` is configured                        |
| `.noofpi/fonts.css`             | `@font-face` rules, when `fonts` is configured                       |

Include them in your `tsconfig.json` with `".noofpi/*.d.ts"`. See [Auto-imports](/docs/core-concepts/auto-imports).

::Callout{type="tip"}
Add `.noofpi` and `.output` to `.gitignore`. Both are regenerated by the CLI.
::
