import { Contents, NodeContent, NodeEditorContent, NodeMetadata } from '../Types/Editor'
import { createX } from '../Utils/storeCreator'

export type ContentStoreState = {
  internalUpdate: boolean
  setInternalUpdate: (value: boolean) => void
  contents: Contents
  saved: boolean
  setSaved: (saved: boolean) => void
  removeContent: (nodeid: string) => void
  getContent: (nodeid: string) => NodeContent
  setContents: (contents: Record<string, NodeEditorContent>) => void
  appendContent: (nodeId: string, blocksToAppend: NodeEditorContent, internalUpdate?: boolean) => void
  setContent: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata, internalUpdate?: boolean) => void
  initContents: (contents: Contents) => void
  getAllMetadata: () => any
  getMetadata: (nodeId: string) => NodeMetadata
  updateMetadata: (nodeId: string, metadata: Partial<NodeMetadata>) => void
  setMetadata: (nodeid: string, metadata: NodeMetadata) => void
}

export const contentStoreConstructor = (set, get): ContentStoreState => ({
  internalUpdate: false,
  setInternalUpdate: (value: boolean) => {
    set({ internalUpdate: value })
  },
  contents: {},
  saved: false,
  setSaved: (saved) => set(() => ({ saved })),
  setContents: (contents) => {
    const existingContents = get().contents
    set({ contents: { ...existingContents, ...contents } })
  },
  setContent: (nodeid, content, metadata, internalUpdate) => {
    const oldContent = get().contents

    set({
      contents: { ...oldContent, [nodeid]: { type: 'editor', content } }
    })

    if (internalUpdate) get().setInternalUpdate(true)
  },
  appendContent: (nodeid, blocksToAppend, internalUpdate) => {
    const contents = get().contents
    const newNoteContent = [...(contents?.[nodeid]?.content ?? []), ...blocksToAppend]
    set({ contents: { ...contents, [nodeid]: { type: 'editor', content: newNoteContent } } })
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

const useContentStore = createX(contentStoreConstructor, 'contents', 'true')

export { useContentStore }
