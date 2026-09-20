# oxzoo-react-yarn

ox deploy example: a React 18 SPA (Vite 5) with an Express 4 API deployed onto one Ubuntu VPS by [ox](https://github.com/saurav-codes/ox-dev), driven entirely by the `ox.toml` at the repo root. nginx serves the built SPA with an index.html fallback, and only the `/api` and `/health` prefixes proxy to the Node process, so one env var powers both halves of the demo.

## Stack

| Layer          | Tool             | Version                          |
| -------------- | ---------------- | -------------------------------- |
| Frontend       | React            | 18                               |
| Bundler        | Vite             | 5                                |
| API            | Express          | 4                                |
| Package mgr    | yarn classic     | 1.22.22 (pinned via packageManager) |
| Runtime        | Node.js          | 22 (NodeSource apt repo)         |
| Static hosting | nginx            | via ox, `spa = true`             |

## Environment flow

One variable, `GREETING_TAG`, reaches the app through two different paths:

1. **Runtime (API):** `server/index.js` reads `process.env.GREETING_TAG` on every request to `GET /api/greeting`, which returns `hello world oxzoo-react-yarn_{GREETING_TAG}` as `text/plain`. Nothing is baked in; change the env var and the API answer changes on the next request.
2. **Build time (SPA):** `vite.config.js` sets `envPrefix: ["GREETING_", "VITE_"]`, so `client/src/App.jsx` reads `import.meta.env.GREETING_TAG` and Vite bakes the value into `dist/` as `frontend: hello world oxzoo-react-yarn_{GREETING_TAG}`. Changing the var requires a rebuild to reach the SPA.

Set `GREETING_TAG` in the ox Environment editor for the project **before the first deploy**. The build step needs it, so a deploy without it bakes an empty tag into the SPA. See `.env.example` for the placeholder; never commit a real `.env`.

## Deploy with ox

1. In the ox dashboard, create a project with the clone URL:

   ```
   git@github.com:saurav-codes/oxzoo-react-yarn.git
   ```

2. In the project's Environment editor, set `GREETING_TAG` (any tag you like, e.g. `prod-1`).
3. Press Deploy. ox adds the NodeSource repo, installs Node.js, runs `corepack yarn install --frozen-lockfile` and `corepack yarn run build`, starts `node server/index.js` on `127.0.0.1:9106`, then nginx serves `dist/` and proxies `/api` and `/health`.

yarn classic is pinned by the `"packageManager": "yarn@1.22.22"` field in `package.json`. ox runs yarn through corepack, so the server uses exactly 1.22.22 regardless of what yarn (if any) is installed system-wide. `yarn.lock` is committed and install runs with `--frozen-lockfile`.

## Expected output

With `GREETING_TAG` set, the page shows:

```
oxzoo-react-yarn

frontend: hello world oxzoo-react-yarn_<GREETING_TAG>
backend: hello world oxzoo-react-yarn_<GREETING_TAG>
```

Both lines carry the same tag through different paths: the frontend line was baked in at build time, the backend line was read at runtime.

## Local development

```
GREETING_TAG=localtest npx -y yarn@1.22.22 install
GREETING_TAG=localtest npx -y yarn@1.22.22 run build
GREETING_TAG=localtest PORT=9106 node server/index.js
```

Serve `dist/` behind any static server that proxies `/api` to the Node process, or open the built `dist/index.html` to check the baked frontend line (the backend line shows its error state until `/api/greeting` is reachable).
