import { storageAdapter } from '@mexit/shared'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

interface LinkCapture {
  short: string
  long: string
  namespace: string
  metadata?: any
  shortenedURL: string
}

interface LinkCaptureStore extends State {
  linkCaptures: LinkCapture[]
  addLinkCapture: (l: LinkCapture) => void
}

export const useShortenerStore = create<LinkCaptureStore>(
  persist(
    (set, get) => ({
      linkCaptures: new Array<LinkCapture>(),
      addLinkCapture: (l: LinkCapture) => {
        const captures = get().linkCaptures
        set({ linkCaptures: [...captures, l] })
      }
    }),
    { name: 'mexit-link-captures', ...storageAdapter }
  )
)
