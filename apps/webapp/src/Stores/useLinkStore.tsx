import create from 'zustand'

export interface Link {
  url: string
  title: string

  /**
   * If the link is shortend it has an alias
   */
  alias?: string
  tags?: string[]

  createdAt?: number
  updatedAt?: number
}

interface LinkStore {
  links: Link[]
  setLinks: (links: Link[]) => void
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  setLinks: (links) => set({ links })
}))
