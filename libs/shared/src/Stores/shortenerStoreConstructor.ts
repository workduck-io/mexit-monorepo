import { LinkCapture } from '..'

export const shortenerStoreConstructor = (set, get) => ({
  linkCaptures: new Array<LinkCapture>(),
  setLinkCaptures: (l: LinkCapture[]) => {
    set(l)
  },
  addLinkCapture: (l: LinkCapture) => {
    const captures = get().linkCaptures
    set({ linkCaptures: [...captures, l] })
  }
})
