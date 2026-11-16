---
title: Layouts
description: Wrap pages in layouts and control where the routed page renders.
---

# Layouts

```text
app/layouts/default.vue   used by every page that does not choose one
app/layouts/admin.vue     name = file name in kebab-case (AdminPanel.vue -> admin-panel)
```

A layout is a normal component with a `<slot />` where the page goes.

```vue [app/layouts/admin.vue]
<template>
  <div class="flex">
    <aside>Admin menu</aside>
    <main><slot /></main>
  </div>
</template>
```

## Choosing a Layout

A page picks its layout with `useLayout()` in `<script setup>`. Pass a layout name, or `false`
for no layout.

```vue [app/pages/admin/index.vue]
<script setup lang="ts">
import { useLayout } from "noofpi/runtime";

useLayout("admin");
</script>
```

::Callout{type="warning" title="Use a string literal"}
noofpi reads the argument at build time, because the layout has to be known before the page
renders (also on the server, so hydration matches). A variable or expression is not supported. In
dev, `useLayout()` warns when its call was not picked up.
::

Changing it while `noofpi dev` runs reloads the page. An unknown layout name warns and renders
the bare page. Nested layouts are not supported yet.

## app.vue

Without `app/app.vue` noofpi renders `<NoofpiLayout />` for you. With your own `app.vue`, render
it yourself. It shows the current page inside the page's layout, and `app.vue` stays the
outermost wrapper, so a global toast container can sit next to it.

```vue [app/app.vue]
<template>
  <NoofpiLayout />
</template>
```

## Controlling Where the Page Goes

Give `<NoofpiLayout>` a slot and put `<NoofpiPage />` (the routed page, like `<RouterView />`)
in it. Both come from `noofpi/runtime` and are auto-imported.

```vue [app/app.vue]
<template>
  <NoofpiLayout>
    <Transition name="fade" mode="out-in"><NoofpiPage /></Transition>
  </NoofpiLayout>
</template>
```
