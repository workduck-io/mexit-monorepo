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

export interface LinkStore {
  links: Link[]
  setLinks: (links: Link[]) => void
  addLink: (link: Link) => void
}

export const linkStoreConstructor = (set, get) => ({
  links: [],
  setLinks: (links) => set({ links }),
  addLink: (link) => {
    const oldLinks = get().links

    set({ links: [...oldLinks, link] })
  }
})
