import create from 'zustand'
import { persist } from 'zustand/middleware'

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
  addLink: (link: Link) => void
}

export const useLinkStore = create<LinkStore>(
  persist(
    (set, get) => ({
      links: [],
      setLinks: (links) => set({ links }),
      addLink: (link) => {
        const oldLinks = get().links

        set({ links: [...oldLinks, link] })
      }
    }),
    {
      name: 'mexit-link-store'
    }
  )
)
