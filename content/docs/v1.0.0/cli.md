---
title: CLI
description: The noofpi dev, build and start commands and their options.
---

# CLI

noofpi ships one binary with three commands.

```bash
noofpi dev     # vite dev server with live reload
noofpi build   # -> .output/ (public/ + server/)
noofpi start   # run the build
```

In a scaffolded project these are wired to `bun dev`, `bun run build` and `bun run start`.

## Commands

| Command        | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `noofpi dev`   | Start the dev server with live reload                               |
| `noofpi build` | Build for production into `.output/`                                |
| `noofpi start` | Run the production build (run `noofpi build` first)                 |

Run `noofpi` without a command to print the usage. An unknown command prints the usage and exits with an error.

## Options

| Option              | Applies to       | Description                                                                |
| ------------------- | ---------------- | -------------------------------------------------------------------------- |
| `--root <dir>`      | all commands     | Project root. Default: the current directory                               |
| `--port <port>`     | `dev`, `start`   | Server port                                                                |
| `--host <host>`     | `dev`, `start`   | Server host                                                                |
| `--preset <name>`   | `build`          | Build target. Default: `build.preset` from the config, or `node`           |

```bash
noofpi dev --port 4000
noofpi build --preset bun
noofpi start --root ./apps/web --host 127.0.0.1
```

## Environment variables

`noofpi start` reads `PORT` and `HOST`:

| Setting | Order of precedence                                              |
| ------- | ---------------------------------------------------------------- |
| Port    | `--port`, then `PORT`, then `devServer.port` (default `3000`)    |
| Host    | `--host`, then `HOST`, then `0.0.0.0`                            |

The standalone servers produced by the `node`, `bun` and `docker` presets also read `PORT` and `HOST`.

The CLI loads your `.env*` files into `process.env` before reading the config (using the `development` mode for `dev` and `production` otherwise). Variables already set in the shell win.

## Presets

`noofpi build --preset <name>` accepts `node`, `bun`, `docker`, `cloudflare-worker`, `cloudflare-pages` and `github-pages`. The flag wins over `build.preset`. See [Deploy Presets](/docs/deployment/presets).

::Callout{type="note"}
Every build starts from an empty `.output/` folder.
::
