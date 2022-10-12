import create from 'zustand'
import { persist } from 'zustand/middleware'

import { Link } from '@mexit/core'

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
