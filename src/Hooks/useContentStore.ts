import HighlightSource from 'web-highlighter/dist/model/source'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { Content, Contents, NodeEditorContent } from '../Types/Editor'
import storageAdapter from '../Utils/chromeStorageAdapter'

export interface ContentStoreState extends State {
  contents: Contents
  getContent: (url: string) => Content[]
  removeContent: (url: string) => void
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
