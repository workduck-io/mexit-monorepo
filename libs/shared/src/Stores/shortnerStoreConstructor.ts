import { LinkCapture } from '..'

export const shortnerStoreConstructor = (set, get) => ({
  linkCaptures: new Array<LinkCapture>(),
  addLinkCapture: (l: LinkCapture) => {
    const captures = get().linkCaptures
    set({ linkCaptures: [...captures, l] })
  }
})
