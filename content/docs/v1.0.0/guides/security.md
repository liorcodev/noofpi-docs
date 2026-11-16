---
title: Security
description: Built-in security headers, CSRF and body limits, plus CSP with nonces, allowed hosts and per-route overrides.
---

# Security

noofpi protects your app by default and lets you tune everything under `security` in the config.

## Configuration

```ts [noofpi.config.ts]
import { defineNoofpiConfig } from "noofpi";

export default defineNoofpiConfig({
  security: {
    csp: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'nonce'"],
        "style-src": ["'self'", "'nonce'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "frame-ancestors": ["'self'"],
        "upgrade-insecure-requests": true, // true = bare directive, false = omitted
      },
      reportOnly: false, // true sends Content-Security-Policy-Report-Only
    },
    headers: { "Cross-Origin-Opener-Policy": "same-origin" }, // add / override; `false` value removes, `false` alone disables all
    csrf: {
      allowedOrigins: ["https://admin.example.com"],
      publicOrigin: "https://app.example.com",
    }, // `false` turns it off; `publicOrigin` makes the check compare scheme too
    bodyLimit: 10 * 1024 * 1024, // max request body in bytes (default 10 MiB), `false` turns it off
    allowedHosts: ["app.example.com", "*.example.com"], // other `Host` values get a 400 (default: any host)
  },
});
```

| Option         | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `csp`          | Content Security Policy directives and `reportOnly`                         |
| `headers`      | Add or override response headers. A `false` value removes one; `false` alone disables all |
| `csrf`         | `allowedOrigins` and `publicOrigin`; `false` turns the check off            |
| `bodyLimit`    | Maximum request body in bytes (default 10 MiB); `false` turns it off        |
| `allowedHosts` | Accepted `Host` values; any other gets a `400` (default: any host)          |

## Default protections

These are on with no config:

| Protection       | What it does |
| ---------------- | ------------ |
| Security headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` (skipped when the CSP has `frame-ancestors`), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation off) and, over https only, `Strict-Transport-Security: max-age=15552000`. Added to every response that does not already set them, so your own server middleware and API can override. Static files get `nosniff`. |
| CSRF             | A `POST`, `PUT`, `PATCH` or `DELETE` to the doofpi API or the pfetch proxy from another site gets a `403`. It checks `Origin` (host only by default, so a TLS-terminating proxy does not break it) and falls back to `Sec-Fetch-Site`. Requests with neither header (curl, mobile apps, server-to-server) are not browsers and pass. |
| Body limit       | Request bodies (doofpi API, pfetch proxy, server middleware) over `bodyLimit` (default 10 MiB) get a `413`. It checks `Content-Length` and also counts the streamed bytes, so chunked uploads cannot skip it. |
| Head hardening   | Attribute names from `useHead` or config `head` that could break out of a tag, and `on*` event-handler attributes, are dropped. Titles, attribute values and the SSR payload JSON are already escaped. |

### CSRF origins

Add cross-site front ends you trust to `allowedOrigins`. Set `publicOrigin` to compare the full origin, scheme included, instead of the host only.

### Body limits

Raise the limit per path with `routeRules` for uploads, see [per-route overrides](#per-route-overrides).

## Content Security Policy

No CSP is sent unless you configure `csp`. When you do, it goes out as a `Content-Security-Policy` header with every HTML page, SSR pages and the SPA shell alike. Set `reportOnly: true` to send `Content-Security-Policy-Report-Only` instead.

- Directive names are lowercase kebab-case.
- Sources cannot contain `;`, `,` or control characters.
- A directive set to `true` renders bare, and `false` omits it.

### Nonces

`'nonce'` is a placeholder. Each request gets a fresh random nonce, written to the header as `'nonce-<value>'` and added as `nonce="<value>"` to every `<script>`, `<style>` and stylesheet or preload `<link>` of the page shell, including the ones Vite injects. A `<meta property="csp-nonce">` is added too, so Vite applies the nonce to the styles and preloads it creates at runtime.

::Callout{type="warning" title="Nonces and caching"}
Only the shell is nonced. Markup produced while rendering your pages is never touched, so injected content cannot pick up a trusted nonce. Because the nonce changes on every request, do not cache the HTML at a CDN when you use it.
::

::Callout{type="note" title="Dev server"}
The dev server needs `connect-src` to allow its HMR websocket. `'self'` covers `ws://localhost:<port>` in current browsers.
::

## Allowed hosts

`allowedHosts` restricts the `Host` header. Exact names and wildcards such as `*.example.com` are accepted; any other host gets a `400`. By default any host is accepted.

## Per-route overrides

A route rule can override the global `security` for the URL paths it matches:

```ts [noofpi.config.ts]
routeRules: {
  "/embed/**": { security: { csp: false, headers: { "X-Frame-Options": false } } }, // embeddable pages
  "/doofpi/webhooks/**": { security: { csrf: false } }, // API paths work too
  "/doofpi/uploads/**": { security: { bodyLimit: 100 * 1024 * 1024 } }, // bigger uploads here
  "/admin/**": { security: { csp: { directives: { "default-src": ["'self'"] } } } },
},
```

| Option      | Effect for matching paths                                                      |
| ----------- | ------------------------------------------------------------------------------ |
| `csp`       | Replaces the global CSP for matching pages; `false` sends none                 |
| `headers`   | Applied on top of the global headers; a `false` value removes one, `false` alone removes them all |
| `csrf`      | Replaces the global CSRF check for matching API and proxy paths; `false` turns it off |
| `bodyLimit` | Replaces the global body limit in bytes; `false` turns it off                  |

- When several rules match, each option comes from the longest matching pattern.
- Invalid options fail at startup.
- Security options are server-only and are not included in the config sent to the browser.

::Callout{type="tip" title="X-Frame-Options"}
The default `X-Frame-Options` is only dropped for you when the global CSP has `frame-ancestors`. Set it to `false` yourself when a rule's CSP has one.
::

## Cookies

noofpi does not set cookies on its own. The server jar defaults to `HttpOnly; SameSite=Lax`, plus `Secure` over https. See [Cookies](/docs/guides/cookies).

## Related

- [Middleware](/docs/guides/middleware) to add custom checks in front of every request.
- [Devtools](/docs/guides/devtools) lists CSP violations reported by the browser during development.
- [Presets](/docs/deployment/presets): the `github-pages` preset does not send `security` headers or `csp`.
