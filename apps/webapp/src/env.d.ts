/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MEXIT_APP_TITLE: string
  readonly MEXIT_MIXPANEL_TOKEN_WEBAPP: string
  readonly __DEV__: boolean
  readonly MEXIT_FORCE_DEV: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
