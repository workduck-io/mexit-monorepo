/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_MIXPANEL_TOKEN_WEBAPP: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
