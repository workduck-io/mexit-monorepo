import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

import { Tag } from '@mexit/core'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

interface TagStore extends State {
  tags: Tag[]
  addTags: (tag: Tag | Tag[]) => void
  removeTag: (tag: Tag) => void
}

export const useTagStore = create<TagStore>(
  persist(
    (set, get) => ({
      tags: new Array<Tag>(),
      addTags: (data) => {
        if (Array.isArray(data)) set({ tags: [...get().tags, ...data] })
        else set({ tags: [...get().tags, data] })

        console.log('Global Tags: ', get().tags)
      },
      removeTag: (tag: Tag) => {
        const tags = get().tags
        const idx = tags.map((e) => e.id).indexOf(tag.id)
        tags.splice(idx, 1)
        set({ tags: tags })
      }
    }),
    { name: 'mexit-tags', getStorage: () => asyncLocalStorage }
  )
)
