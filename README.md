# Mexit

## Adding a New Theme or Shortcut

When adding a new theme or shortcut, ensure to bump the version in the `apps/webapp/src/Stores/useThemeStore.ts` and `/libs/core/src/Stores/help.store.ts` files respectively

## Run - Dev

- `nx dev webapp`
- `nx dev extension`
  - Also see [Extension Readme](apps/extension/README.md)
  - When changing files inside libs, restart the server as it doesn't watch for any files except `.ts(x)` inside extension.

- In [middleware](https://github.com/workduck-io/mexit-backend) `yarn dev`

  Do set the environment variables as necessary:

  ```
  PORT=5000
  MEILISEARCH_API_KEY=XXX
  MEILISEARCH_HOST=http://XXXX
  client_id=xxx
  client_secret=xxx
  MEXIT_BACKEND_USER_ID=xxx
  AWS_ACCESS_KEY_ID=xxx
  AWS_SECRET_ACCESS_KEY=xxx
  MEXIT_BACKEND_REFRESH_TOKEN=xxx
  MEXIT_BACKEND_CLIENT_ID=xxx
  MEXIT_BACKEND_WORKSPACE_ID=xxx
  ```
