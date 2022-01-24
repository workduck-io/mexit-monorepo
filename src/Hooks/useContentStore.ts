import { Content, Contents, NodeEditorContent } from '../Types/Editor'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import HighlightSource from 'web-highlighter/dist/model/source'
import { storageAdapter } from '../Utils/asyncStorage'

export interface ContentStoreState extends State {
  contents: Contents
  getContent: (url: string) => Content
  removeContent: (url: string) => void
  setContent: (url: string, content: NodeEditorContent, saveableRange: Partial<HighlightSource>) => void
}

export const useContentStore = create<ContentStoreState>(
  persist(
    (set, get) => ({
      contents: {},
      setContent: (url, content, saveableRange) => {
        const oldContent = get()?.contents

        // TODO: this most probably doesn't work properly after highlighting multiple times
        set({
          contents: {
            [url]: {
              content: content,
              range: saveableRange
            },
            ...oldContent
          }
        })
      },
      getContent: (url) => {
        return get().contents[url]
      },
      removeContent: (url) => {
        const oldContent = get()?.contents
        delete oldContent[url]
      }
    }),
    {
      name: 'mexit-content',
      ...storageAdapter
    }
  )
)
