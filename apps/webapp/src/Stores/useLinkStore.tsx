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

// const sampleLinks = [
//   {
//     url: 'https://www.google.com',
//     shortend: 'goog',
//     title: 'Google',
//     tags: ['google', 'search']
//   },
//   {
//     url: 'https://www.github.com',
//     title: 'Github',
//     tags: ['github', 'code']
//   },
//   {
//     url: 'https://www.wikipedia.com',
//     shortend: 'wiki',
//     title: 'Wikipedia',
//     tags: ['wikipedia', 'search']
//   },
//   {
//     url: 'https://www.youtube.com',
//     title: 'Youtube',
//     tags: ['youtube', 'video']
//   },
//   {
//     url: 'https://www.facebook.com',
//     title: 'Facebook',
//     tags: ['facebook', 'social']
//   }
// ]

interface LinkStore {
  links: Link[]
  setLinks: (links: Link[]) => void
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  setLinks: (links) => set({ links })
}))
