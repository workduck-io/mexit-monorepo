import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export interface Link {
  url: string

  // Useful for having preview image and other metatags for the shortened link
  title: string
  description?: string
  imgSrc?: string

  /**
   * If the link is shortend it has an alias
   */
  alias?: string
  tags?: string[]

  createdAt?: number
  updatedAt?: number
}

export const linkStoreConstructor = (set, get) => ({
  links: [] as Link[],
  setLinks: (links: Link[]) => set({ links }),
  addLink: (link: Link) => {
    const oldLinks = get().links

    set({ links: [...oldLinks, link] })
  }
})

export const useLinkStore = createStore(linkStoreConstructor, StoreIdentifier.LINKS, true)