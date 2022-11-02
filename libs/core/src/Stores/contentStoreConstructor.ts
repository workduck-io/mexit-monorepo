import { Contents, NodeContent, NodeEditorContent, NodeMetadata } from '../Types/Editor'
import { mog } from '../Utils/mog'

export interface ContentStoreState {
  contents: Contents
  saved: boolean
  setSaved: (saved: boolean) => void
  removeContent: (nodeid: string) => void
  getContent: (nodeid: string) => NodeContent
  getContentFromLink: (url: string) => NodeContent[]
  setContent: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  getAllMetadata: () => Record<string, NodeMetadata>
  getMetadata: (nodeid: string) => NodeMetadata
  setMetadata: (nodeid: string, metadata: NodeMetadata) => void
  updateMetadata: (nodeid: string, metadata: Partial<NodeMetadata>) => void
  initContents: (contents: Contents) => void

  _hasHydrated: boolean
  setHasHydrated: (state) => void
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
  getMetadata: (nodeid) => {
    const contents = get().contents
    return contents[nodeid] && contents[nodeid].metadata ? contents[nodeid].metadata : {}
  },
  updateMetadata: (nodeid: string, partialMetadata: Partial<NodeMetadata>) => {
    const oldMetadata = get().getMetadata(nodeid)
    const newMetadata = { ...oldMetadata, ...partialMetadata }
    // mog('updateMetadata', { nodeid, oldMetadata, partialMetadata, newMetadata })
    set((state) => {
      state.contents[nodeid].metadata = newMetadata
    })
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
    return Object.values(contents).filter((item) => item?.metadata?.elementMetadata?.sourceUrl === url)
  },
  removeContent: (nodeid) => {
    const oldContent = get().contents
    delete oldContent[nodeid]
  },
  initContents: (contents) => {
    set({
      contents
    })
  },
  _hasHydrated: false,
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state
    })
  }
})
