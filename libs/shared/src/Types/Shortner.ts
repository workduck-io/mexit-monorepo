import { State } from 'zustand'

export interface LinkCapture {
  short: string
  long: string
  namespace: string
  metadata?: any
  shortenedURL: string
}

export interface LinkCaptureStore extends State {
  linkCaptures: LinkCapture[]
  setLinkCaptures: (l: LinkCapture[]) => void
  addLinkCapture: (l: LinkCapture) => void
}
