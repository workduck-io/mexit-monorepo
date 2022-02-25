import HighlightSource from 'web-highlighter/dist/model/source'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { Content, Contents, NodeEditorContent } from '@mexit/shared'
import { storageAdapter } from '@mexit/shared'

export interface ContentStoreState extends State {
  contents: Contents
  getContent: (url: string) => Content[]
  removeContent: (url: string, highlighterId: string) => void
  setContent: (url: string, content: NodeEditorContent, saveableRange: Partial<HighlightSource>, id: string) => void
}

export const useContentStore = create<ContentStoreState>(
  persist(
    (set, get) => ({
      contents: {},
      setContent: (url, content, saveableRange, id) => {
        console.log('Setting Content: ', content)
        const oldContent = get()?.contents
        const urlContent = oldContent[url] || []
        delete oldContent[url]

        const contents = {
          ...oldContent,
          [url]: [
            ...urlContent,
            {
              id: id,
              highlighterId: saveableRange.id,
              content: content,
              range: saveableRange
            }
          ]
        }
        set({
          contents: contents
        })
      },
      getContent: (url) => {
        console.log('Getting Content for URL: ', url)
        return get().contents[url]
      },
      removeContent: (url, highlighterId) => {
        const oldContent = get()?.contents[url]
        const idx = oldContent.map((i) => i.highlighterId).indexOf(highlighterId)

        oldContent.splice(idx, 1)
        set({
          contents: {
            ...get().contents,
            [url]: oldContent
          }
        })
      }
    }),
    {
      name: 'mexit-content',
      ...storageAdapter
    }
  )
)
