---
title: Auto-imports
description: Use Vue, vue-router, noofpi APIs and your own code without import statements.
---

# Auto-imports

Like Nuxt, these need no `import`:

- Vue (`ref`, `computed`, `watch`, ...) and vue-router (`useRoute`, `useRouter`, ...) APIs
- noofpi APIs: `useAsyncData`, `useState`, `useCookie`, `useCookies`, `useDoofpi`,
  `useDoofpiFetch`, `useDoofpiForm`, `useHead`, `useLayout`, `definePage`, `useLoaderData`,
  `useMiddleware`, `defineRouteMiddleware`, `navigateTo`, `createError`, `showError`,
  `clearError`, `useError`
- Components: `<NoofpiLayout>`, `<NoofpiPage />`, `<NoofpiLink>`, `<ClientOnly>`, `<NoofpiImage>`
- Exports of `app/composables/*` and `app/utils/*` (top-level files, and `index.ts` of
  sub-folders)
- Components in `app/components`. The folder path is the name prefix, so
  `components/base/Button.vue` becomes `<BaseButton />`

Explicit imports keep working. Types are not auto-imported.

## Type Declarations

noofpi generates `.noofpi/auto-imports.d.ts` and `.noofpi/components.d.ts` the first time you run
`noofpi dev` or `noofpi build`. Include them in `tsconfig.json` for editor and type-check support:

```json [tsconfig.json]
{
  "compilerOptions": { "types": ["vite/client", "noofpi/client"] },
  "include": ["app", "server", ".noofpi/*.d.ts"]
}
```

`noofpi/client` declares the `?image` imports, `*.vue` modules and noofpi's `virtual:` modules.

## Disabling

Turn everything off with `autoImports: false` in the config.

```ts [noofpi.config.ts]
export default defineNoofpiConfig({
  autoImports: false,
});
```
