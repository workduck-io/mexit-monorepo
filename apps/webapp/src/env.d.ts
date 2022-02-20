/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MIXPANEL_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
