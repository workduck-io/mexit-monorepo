/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_MIXPANEL_TOKEN_WEBAPP: string
  readonly __DEV__: boolean
  readonly VITE_FORCE_DEV: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
