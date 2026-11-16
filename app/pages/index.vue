<script setup lang="ts">
definePageMeta({ layout: 'default' });
useHead({ title: 'noofpi - Vue + Vite full-stack framework' });

const copied = ref(false);
function copyInstall() {
  navigator.clipboard.writeText('bun create noofpi my-app');
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

const serverCode = `\`\`\`ts
import Doofpi from "doofpi";
import { z } from "zod";

const d = new Doofpi({ root: "/doofpi" });

export const routes = d.routes({
  hello: d.endpointBuilder
    .model({ output: z.object({ message: z.string() }) })
    .read(() => ({ message: "Hello from doofpi" }))
});

d.register(routes);
export default d;
\`\`\``;

const pageCode = `\`\`\`vue
<script setup lang="ts">
// Typed by the \`routes\` export of server/doofpi.ts
const { data } = useDoofpiFetch("hello", client => client.hello.read());
<\/script>

<template>
  <h1>{{ data?.message }}</h1>
</template>
\`\`\``;

const configCode = `\`\`\`ts
import { defineNoofpiConfig } from "noofpi";

export default defineNoofpiConfig({
  ssr: true,
  tailwind: true,
  doofpi: { fetch: "lfetch", root: "/doofpi" },
  routeRules: { "/admin/**": { ssr: false } },
  build: { preset: "node" }
});
\`\`\``;

const features = [
  {
    icon: 'heroicons:document-duplicate',
    title: 'File-based Pages',
    desc: 'Drop a .vue file in app/pages and get a route. Dynamic params, catch-all routes, layouts and route middleware included.'
  },
  {
    icon: 'heroicons:server-stack',
    title: 'Built-in doofpi Server',
    desc: 'Your server/doofpi.ts is served for you - the Nitro equivalent. Server middleware, cookies and a proxy hook are built in.'
  },
  {
    icon: 'heroicons:arrows-right-left',
    title: 'Four Fetch Modes',
    desc: 'dfetch, pfetch, lfetch and sfetch decide how the browser and SSR reach your API. Pick one globally or per route.'
  },
  {
    icon: 'heroicons:cpu-chip',
    title: 'SSR or SPA',
    desc: 'Server-render by default, turn it off globally or per route with routeRules. Data is embedded in the HTML and hydrated without refetching.'
  },
  {
    icon: 'heroicons:shield-check',
    title: 'Secure by Default',
    desc: 'Security headers, CSRF checks and a request body limit are on out of the box, with nonce-based CSP when you want it.'
  },
  {
    icon: 'heroicons:sparkles',
    title: 'Auto-imports',
    desc: 'Vue, vue-router and noofpi APIs plus your own components and composables need no import statements.'
  },
  {
    icon: 'heroicons:language',
    title: 'Typed i18n',
    desc: 'One file per locale, typed keys and placeholders, locale detection from cookie and Accept-Language, and locales that load lazily in the browser.'
  },
  {
    icon: 'heroicons:photo',
    title: 'Fonts & Images',
    desc: 'Self-hosted Google or local fonts, plus an image pipeline that emits AVIF and WebP with no layout shift.'
  },
  {
    icon: 'heroicons:rocket-launch',
    title: 'Deploy Anywhere',
    desc: 'Node, Bun, Docker, Cloudflare Workers, Cloudflare Pages and GitHub Pages presets from one build command.'
  }
];

const nuxtAdvantages = [
  {
    icon: 'heroicons:bolt',
    title: 'One fetch function',
    desc: 'Pages, the typed API, the proxy and middleware run in a single (Request) => Response handler. Ship it as one Worker, one Node or one Bun process.'
  },
  {
    icon: 'heroicons:arrows-right-left',
    title: 'Built-in backend-for-frontend',
    desc: 'Put a Vue app in front of an existing doofpi API with dfetch, pfetch or sfetch. The proxy keeps cookies, injects auth and hides the API origin.'
  },
  {
    icon: 'heroicons:code-bracket-square',
    title: 'Typed from a single source',
    desc: 'One routes export types your API calls, forms, navigation, i18n keys and cookies. Zod validates inputs and outputs at runtime.'
  },
  {
    icon: 'heroicons:shield-check',
    title: 'Secure by default',
    desc: 'CSRF checks, security headers and a streamed body limit are enforced in the server handler, with nonce-based CSP and per-route overrides.'
  },
  {
    icon: 'heroicons:squares-plus',
    title: 'Batteries included',
    desc: 'Fonts, images, i18n, cookies, forms, Tailwind v4 and six deploy presets in one package, one config and one version to track.'
  },
  {
    icon: 'heroicons:archive-box',
    title: 'About 5x fewer packages',
    desc: 'A fresh noofpi project installs about 105 packages with Bun. Nuxt installs about 500.'
  }
];

const stats = [
  { value: '6', label: 'deploy presets' },
  { value: '4', label: 'fetch modes' },
  { value: '0', label: 'codegen steps you run' },
  { value: '1', label: 'config file' }
];
</script>

<template>
  <div class="relative overflow-x-hidden">
    <!-- Hero -->
    <section class="relative flex flex-col items-center justify-center px-4 pt-24 pb-28 sm:pt-32">
      <div class="grid-bg absolute inset-0" />
      <div
        class="absolute -top-24 left-1/2 -translate-x-1/2 w-[60rem] h-[28rem] rounded-full bg-brand-400/20 blur-3xl"
      />

      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <NuxtLink
          to="/docs/quick-start"
          class="animate-fade-up inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-xs font-semibold bg-surface border border-line-strong text-body hover:border-brand-400 transition-colors shadow-sm"
        >
          <span class="px-2 py-0.5 rounded-full bg-accent-soft text-accent">v1.0.0</span>
          Built on doofpi
          <Icon name="heroicons:arrow-right" class="text-accent" />
        </NuxtLink>

        <h1
          class="animate-fade-up mt-8 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-ink"
          style="animation-delay: 80ms"
        >
          The Vue framework for<br />
          <span class="gradient-text">full-stack TypeScript</span>
        </h1>

        <p
          class="animate-fade-up mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
          style="animation-delay: 160ms"
        >
          File-based pages, SSR or SPA, a built-in doofpi server and four fetch modes. Minimal
          surface, everything typed end to end.
        </p>

        <div
          class="animate-fade-up mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center"
          style="animation-delay: 240ms"
        >
          <NuxtLink
            to="/docs/introduction"
            class="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold"
          >
            Get Started
            <Icon name="heroicons:arrow-right" class="text-lg" />
          </NuxtLink>
          <button
            class="btn-secondary inline-flex items-center gap-3 px-5 py-3.5 rounded-xl font-mono text-sm"
            @click="copyInstall"
          >
            <span class="text-muted">$</span> bun create noofpi my-app
            <Icon
              :name="copied ? 'heroicons:check' : 'heroicons:clipboard-document'"
              class="text-base"
              :class="copied ? 'text-accent' : 'text-muted'"
            />
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div
        class="animate-fade-up relative z-10 mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl"
        style="animation-delay: 320ms"
      >
        <div v-for="s in stats" :key="s.label" class="card px-4 py-5 text-center">
          <p class="text-3xl font-extrabold text-ink">{{ s.value }}</p>
          <p class="mt-1 text-xs text-muted">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-24 px-4 bg-subtle border-y border-line">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-14 reveal">
          <span
            class="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent-soft text-accent border border-brand-200"
          >
            How it works
          </span>
          <h2 class="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
            Define on the server. <span class="gradient-text">Use in the page.</span>
          </h2>
          <p class="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Export your routes once. noofpi generates the types, so every call in your pages is
            checked by the compiler.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 reveal">
          <div class="card overflow-hidden min-w-0">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-line bg-canvas">
              <Icon name="heroicons:server-stack" class="text-accent" />
              <span class="text-sm font-mono font-semibold text-ink">server/doofpi.ts</span>
            </div>
            <div class="px-4 overflow-x-auto prose"><MDC :value="serverCode" /></div>
          </div>
          <div class="card overflow-hidden min-w-0">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-line bg-canvas">
              <Icon name="heroicons:document-text" class="text-accent" />
              <span class="text-sm font-mono font-semibold text-ink">app/pages/index.vue</span>
            </div>
            <div class="px-4 overflow-x-auto prose"><MDC :value="pageCode" /></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-24 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-14 reveal">
          <span
            class="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent-soft text-accent border border-brand-200"
          >
            Features
          </span>
          <h2 class="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
            Everything you need, <span class="gradient-text">nothing you don't</span>
          </h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="card card-hover p-6 reveal"
            :style="{ '--reveal-delay': `${(i % 3) * 80}ms` }"
          >
            <div
              class="w-11 h-11 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-600/25"
            >
              <Icon :name="f.icon" class="text-xl" />
            </div>
            <h3 class="mt-5 text-lg font-bold text-ink">{{ f.title }}</h3>
            <p class="mt-2 text-sm text-muted leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Inspired by Nuxt -->
    <section class="py-24 px-4 bg-subtle border-y border-line">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-14 reveal">
          <span
            class="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent-soft text-accent border border-brand-200"
          >
            Inspired by Nuxt
          </span>
          <h2 class="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
            Familiar conventions, <span class="gradient-text">a lighter core</span>
          </h2>
          <p class="mt-4 text-lg text-muted max-w-2xl mx-auto">
            If you know Nuxt, you already know the folders, the auto-imports and most composables.
            noofpi keeps them and wraps the whole app around doofpi.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(a, i) in nuxtAdvantages"
            :key="a.title"
            class="card card-hover p-6 reveal"
            :style="{ '--reveal-delay': `${(i % 3) * 80}ms` }"
          >
            <div
              class="w-11 h-11 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-600/25"
            >
              <Icon :name="a.icon" class="text-xl" />
            </div>
            <h3 class="mt-5 text-lg font-bold text-ink">{{ a.title }}</h3>
            <p class="mt-2 text-sm text-muted leading-relaxed">{{ a.desc }}</p>
          </div>
        </div>

        <div class="mt-10 text-center reveal">
          <NuxtLink
            to="/docs/comparison"
            class="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
          >
            Read the full comparison with Nuxt <Icon name="heroicons:arrow-right" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Config -->
    <section class="py-24 px-4">
      <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div class="reveal">
          <span
            class="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent-soft text-accent border border-brand-200"
          >
            Configuration
          </span>
          <h2 class="mt-5 text-4xl font-extrabold tracking-tight text-ink">
            One file. <span class="gradient-text">Sensible defaults.</span>
          </h2>
          <p class="mt-4 text-lg text-muted leading-relaxed">
            Everything lives in <code class="font-mono text-accent">noofpi.config.ts</code>. Turn
            SSR off per route, switch the fetch mode, add a CSP or change the deploy target without
            touching your app code.
          </p>
          <NuxtLink
            to="/docs/core-concepts/configuration"
            class="mt-6 inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
          >
            Configuration reference <Icon name="heroicons:arrow-right" />
          </NuxtLink>
        </div>
        <div class="card overflow-hidden min-w-0 reveal">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-line bg-canvas">
            <Icon name="heroicons:cog-6-tooth" class="text-accent" />
            <span class="text-sm font-mono font-semibold text-ink">noofpi.config.ts</span>
          </div>
          <div class="px-4 overflow-x-auto prose"><MDC :value="configCode" /></div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 px-4">
      <div
        class="reveal relative max-w-4xl mx-auto rounded-3xl overflow-hidden px-8 py-16 text-center text-white bg-linear-to-br from-brand-600 via-brand-700 to-brand-900 shadow-2xl shadow-brand-700/30"
      >
        <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div class="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-300/20 blur-2xl" />
        <div class="relative">
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to build?</h2>
          <p class="mt-3 text-brand-100 max-w-xl mx-auto">
            Scaffold a project and have a typed full-stack Vue app running in minutes.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              to="/docs/quick-start"
              class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-800 font-semibold hover:bg-brand-50 transition-colors"
            >
              Quick Start <Icon name="heroicons:arrow-right" />
            </NuxtLink>
            <a
              href="https://github.com/liorcodev/noofpi"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <Icon name="simple-icons:github" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
