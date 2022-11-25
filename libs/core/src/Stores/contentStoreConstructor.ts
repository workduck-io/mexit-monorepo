import { Contents, NodeContent, NodeEditorContent, NodeMetadata } from '../Types/Editor'

export interface ContentStoreState {
  internalUpdate: boolean
  setInternalUpdate: (value: boolean) => void
  contents: Contents
  saved: boolean
  setSaved: (saved: boolean) => void
  removeContent: (nodeid: string) => void
  getContent: (nodeid: string) => NodeContent
  // getContentFromLink: (url: string) => NodeContent[]
  setContent: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata, internalUpdate?: boolean) => void
  getAllMetadata: () => Record<string, NodeMetadata>
  getMetadata: (nodeid: string) => NodeMetadata
  setMetadata: (nodeid: string, metadata: NodeMetadata) => void
  updateMetadata: (nodeid: string, metadata: Partial<NodeMetadata>) => void
  initContents: (contents: Contents) => void

  _hasHydrated: boolean
  setHasHydrated: (state) => void
}

export const contentStoreConstructor = (set, get) => ({
  internalUpdate: false,
  setInternalUpdate: (value: boolean) => {
    set({ internalUpdate: value })
  },
  contents: {},
  saved: false,
  setSaved: (saved) => set(() => ({ saved })),
  setContent: (nodeid, content, metadata, internalUpdate) => {
    const oldContent = get().contents

    const oldMetadata = oldContent[nodeid]?.metadata ?? {}
    delete oldContent[nodeid]
    const nmetadata = metadata ? { ...oldMetadata, ...metadata } : oldMetadata
    set({
      contents: { [nodeid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
    })

    if (internalUpdate) get().setInternalUpdate(true)
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
  // getContentFromLink: (url) => {
  //   const contents: Contents = get().contents
  //   return Object.values(contents).filter((item) => item?.metadata?.elementMetadata?.sourceUrl === url)
  // },
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
