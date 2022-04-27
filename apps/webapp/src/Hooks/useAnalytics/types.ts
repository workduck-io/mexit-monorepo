import { CustomEvents, Properties } from './events'

export type UserProperties = {
  [Properties.EMAIL]: string
  [Properties.ROLE]: string
  [Properties.NAME]: string
  [Properties.WORKSPACE_ID]?: string
}

export type EventProperties = {
  [CustomEvents.LOGGED_IN]: boolean
}

export type Heap = {
  track: (event: string, properties?: Record<string, any>) => void
  identify: (identity: string) => void
  resetIdentity: () => void
  addUserProperties: (properties: Record<string, any>) => void
  addEventProperties: (properties: Record<string, any>) => void
  removeEventProperty: (property: string) => void
  clearEventProperties: () => void
  appid: string
  userId: string
  identity: string | null
  config: any
  load: any
}

declare global {
  interface Window {
    heap: any
    Olvy: any
  }
}
