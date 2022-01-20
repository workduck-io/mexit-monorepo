import { Content, Contents, NodeEditorContent } from '../Types/Editor'
import create from 'zustand'

export interface ContentStoreState {
  contents: Contents
  getContent: (url: string) => Content
  removeContent: (url: string) => void
  setContent: (url: string, content: NodeEditorContent) => void
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  contents: {},
  setContent: (url, content) => {
    if (content?.length === 0) return
    const oldContent = get()?.contents

    set({
      contents: {
        [url]: {
          content: content
        }
      },
      ...oldContent
    })
  },
  getContent: (url) => {
    return get().contents[url]
  },
  removeContent: (url) => {
    const oldContent = get()?.contents
    delete oldContent[url]
  }
}))
