---
title: Quick Start
description: Scaffold a noofpi app, add a doofpi endpoint and a page, then build and start it.
---

# Quick Start

Get a noofpi app with a doofpi endpoint and a server-rendered page running in a few minutes.

## Scaffold a project

```bash
bun create noofpi my-app
cd my-app
bun install
bun dev
```

Use `.` as the name to write into the current directory.

## Add to an existing project

::InstallTabs{package="noofpi vue doofpi"}
::

Then add the scripts to your `package.json`:

```json [package.json]
{
  "type": "module",
  "scripts": {
    "dev": "noofpi dev",
    "build": "noofpi build",
    "start": "noofpi start"
  }
}
```

Create `noofpi.config.ts` in the project root:

```ts [noofpi.config.ts]
import { defineNoofpiConfig } from "noofpi";

export default defineNoofpiConfig({
  ssr: true,
  tailwind: true,
  head: { title: "%s | My app" },
  doofpi: { fetch: "lfetch", root: "/doofpi" },
});
```

## Step 1: Create the doofpi server

`server/doofpi.ts` default-exports your doofpi instance. Export `routes` too, so the clients are typed.

```ts [server/doofpi.ts]
import Doofpi from "doofpi";
import { z } from "zod";

const d = new Doofpi({ root: "/doofpi" });

export const routes = d.routes({
  hello: d.endpointBuilder
    .model({ output: z.object({ message: z.string() }) })
    .read(() => ({ message: "Hello from doofpi" })),
});

d.register(routes);

export default d;
```

::Callout{type="note"}
`new Doofpi({ root })` must use the same value as `doofpi.root` in the config (default `/doofpi`) when you use `lfetch`. The scaffold already includes `zod`; add it with `bun add zod` if you set up the project by hand.
::

## Step 2: Create a page

Every file in `app/pages` is a route. `useDoofpiFetch` and `useHead` are auto-imported.

```vue [app/pages/index.vue]
<script setup lang="ts">
useHead({ title: "Home" });

const { data, error, pending, refresh } = useDoofpiFetch("hello", (client) =>
  client.hello.read(),
);
</script>

<template>
  <main>
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">{{ error.message }}</p>
    <p v-else>{{ data?.message }}</p>
    <button @click="refresh()">Reload</button>
  </main>
</template>
```

On the server the endpoint is called in-process while the page renders, and the result is embedded in the HTML. The browser hydrates without fetching again.

## Step 3: Build and start

```bash
bun run build
bun run start
```

`noofpi build` writes `.output/` (`public/` and `server/`). `noofpi start` runs it, reading `PORT` and `HOST` from the environment or `--port` and `--host` from the command line.

## What's Next?

- [Project Structure](/docs/project-structure) - where everything goes
- [CLI](/docs/cli) - all commands and options
- [Configuration](/docs/core-concepts/configuration) - the full config reference
- [Fetch Modes](/docs/doofpi/fetch-modes) - `dfetch`, `pfetch`, `lfetch` and `sfetch`
- [Data Fetching](/docs/doofpi/data-fetching) - loaders, `useAsyncData` and `useState`
- [Deploy Presets](/docs/deployment/presets) - choose a deploy target
