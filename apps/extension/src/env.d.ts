/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
  readonly NX_MIXPANEL_TOKEN_EXTENSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
