import create from 'zustand'

export interface Link {
  id: string
  url: string
  title: string
  shortend?: string
  tags?: string[]
}

const sampleLinks = [
  {
    id: '1',
    url: 'https://www.google.com',
    shortend: 'goog',
    title: 'Google',
    tags: ['google', 'search']
  },
  {
    id: '2',
    url: 'https://www.github.com',
    title: 'Github',
    tags: ['github', 'code']
  },
  {
    id: '3',
    url: 'https://www.wikipedia.com',
    shortend: 'wiki',
    title: 'Wikipedia',
    tags: ['wikipedia', 'search']
  },
  {
    id: '4',
    url: 'https://www.youtube.com',
    title: 'Youtube',
    tags: ['youtube', 'video']
  },
  {
    id: '5',
    url: 'https://www.facebook.com',
    title: 'Facebook',
    tags: ['facebook', 'social']
  }
]

interface LinkStore {
  links: Link[]
  setLinks: (links: Link[]) => void
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: sampleLinks,
  setLinks: (links) => set({ links })
}))
