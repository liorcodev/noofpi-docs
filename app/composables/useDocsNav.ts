export interface DocsNavItem {
  title: string;
  slug: string;
}

export interface DocsNavGroup {
  group: string;
  items: DocsNavItem[];
}

export const DOCS_NAV: DocsNavGroup[] = [
  {
    group: 'Getting Started',
    items: [
      { title: 'Introduction', slug: 'introduction' },
      { title: 'Quick Start', slug: 'quick-start' },
      { title: 'Project Structure', slug: 'project-structure' },
      { title: 'CLI', slug: 'cli' }
    ]
  },
  {
    group: 'Core Concepts',
    items: [
      { title: 'Configuration', slug: 'core-concepts/configuration' },
      { title: 'Layouts', slug: 'core-concepts/layouts' },
      { title: 'Rendering & Route Rules', slug: 'core-concepts/rendering' },
      { title: 'Auto-imports', slug: 'core-concepts/auto-imports' },
      { title: 'Head', slug: 'core-concepts/head' },
      { title: 'Error Pages', slug: 'core-concepts/error-pages' }
    ]
  },
  {
    group: 'doofpi',
    items: [
      { title: 'Fetch Modes', slug: 'doofpi/fetch-modes' },
      { title: 'Typed Routes', slug: 'doofpi/typed-routes' },
      { title: 'Data Fetching', slug: 'doofpi/data-fetching' },
      { title: 'Forms', slug: 'doofpi/forms' }
    ]
  },
  {
    group: 'Guides',
    items: [
      { title: 'Middleware', slug: 'guides/middleware' },
      { title: 'Plugins', slug: 'guides/plugins' },
      { title: 'Cookies', slug: 'guides/cookies' },
      { title: 'i18n', slug: 'guides/i18n' },
      { title: 'Security', slug: 'guides/security' },
      { title: 'Fonts', slug: 'guides/fonts' },
      { title: 'Images', slug: 'guides/images' },
      { title: 'Devtools', slug: 'guides/devtools' }
    ]
  },
  {
    group: 'Deployment',
    items: [{ title: 'Presets', slug: 'deployment/presets' }]
  },
  {
    group: 'More',
    items: [{ title: 'Comparison with Nuxt', slug: 'comparison' }]
  }
];
