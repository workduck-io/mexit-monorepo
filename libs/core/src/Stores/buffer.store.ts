import { NodeEditorContent } from '../Types/Editor'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const bufferStoreConfig = (set, get) => ({
  buffer: {},
  add: (nodeid: string, val: NodeEditorContent) => set({ buffer: { ...get().buffer, [nodeid]: val } }),
  getBuffer: (nodeId: string) => {
    const bufferVal: NodeEditorContent = get().buffer?.[nodeId]
    return bufferVal
  },
  remove: (nodeid: string) => {
    const newBuffer = get().buffer
    if (newBuffer[nodeid]) delete newBuffer[nodeid]
    set({ buffer: newBuffer })
  },
  clear: () => set({ buffer: {} })
})

export const useBufferStore = createStore(bufferStoreConfig, StoreIdentifier.BUFFER, false)
