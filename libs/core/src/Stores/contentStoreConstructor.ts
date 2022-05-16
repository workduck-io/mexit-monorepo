import { Contents, NodeContent, NodeEditorContent, NodeMetadata } from '../Types/Editor'

export interface ContentStoreState {
  contents: Contents
  saved: boolean
  setSaved: (saved: boolean) => void
  removeContent: (nodeid: string) => void
  getContent: (nodeid: string) => NodeContent
  getContentFromLink: (url: string) => NodeContent[]
  setContent: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  getAllMetadata: () => Record<string, NodeMetadata>
  setMetadata: (nodeid: string, metadata: NodeMetadata) => void
  initContents: (contents: Contents) => void
}

export const contentStoreConstructor = (set, get) => ({
  contents: {},
  saved: false,
  setSaved: (saved) => set(() => ({ saved })),
  setContent: (nodeid, content, metadata) => {
    const oldContent = get().contents

    const oldMetadata = oldContent[nodeid] && oldContent[nodeid].metadata ? oldContent[nodeid].metadata : undefined
    delete oldContent[nodeid]
    const nmetadata = { ...oldMetadata, ...metadata }
    set({
      contents: { [nodeid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
    })
  },
  getAllMetadata: () => {
    const contents = get().contents
    const metadata = {}
    Object.keys(contents).forEach((key) => {
      if (contents[key].metadata) {
        metadata[key] = contents[key].metadata
      }
    })
    return metadata
  },
  setMetadata: (nodeid: string, metadata: NodeMetadata) => {
    const oldContent = get().contents
    const oldMetadata = oldContent[nodeid] && oldContent[nodeid].metadata ? oldContent[nodeid].metadata : undefined
    const content = oldContent[nodeid] && oldContent[nodeid].content ? oldContent[nodeid].content : undefined
    delete oldContent[nodeid]
    const nmetadata = { ...oldMetadata, ...metadata }
    set({
      contents: { [nodeid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
    })
  },
  getContent: (nodeid) => {
    return get().contents[nodeid]
  },
  getContentFromLink: (url) => {
    const contents: Contents = get().contents
    return Object.values(contents).filter((item) => item?.metadata?.url === url)
  },
  removeContent: (nodeid) => {
    const oldContent = get().contents
    delete oldContent[nodeid]
  },
  initContents: (contents) => {
    set({
      contents
    })
  }
})
