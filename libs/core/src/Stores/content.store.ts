import { NodeMetadata } from '../Types/Editor'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const contentStoreConfig = (set, get) => ({
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
  setContent: (nodeid: string, content, metadata?, internalUpdate?: boolean) => {
    const oldContent = get().contents

    set({
      contents: { ...oldContent, [nodeid]: { type: 'editor', content } }
    })

    if (internalUpdate) get().setInternalUpdate(true)
  },
  appendContent: (nodeid: string, blocksToAppend?, internalUpdate?: boolean) => {
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
  getMetadata: (nodeid: string) => {
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
  getContent: (nodeid: string) => {
    return get().contents[nodeid]
  },
  removeContent: (nodeid: string) => {
    const oldContent = get().contents
    delete oldContent[nodeid]
  },
  initContents: (contents) => {
    set({
      contents
    })
  }
})

const useContentStore = createStore(contentStoreConfig, StoreIdentifier.CONTENTS, true)

export { useContentStore }
