import { NodeEditorContent } from '../Types/Editor'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const bufferStoreConfig = (set, get) => ({
  buffer: {} as Record<string, NodeEditorContent>,
  add: (nodeId: string, val: NodeEditorContent) => set({ buffer: { ...get().buffer, [nodeId]: val } }),
  getBuffer: (nodeId: string): NodeEditorContent | undefined => {
    const bufferVal: NodeEditorContent = get().buffer?.[nodeId]
    return bufferVal
  },
  remove: (nodeId: string) => {
    const newBuffer = get().buffer
    if (newBuffer[nodeId]) delete newBuffer[nodeId]
    set({ buffer: newBuffer })
  },
  clear: () => set({ buffer: {} })
})

export const useBufferStore = createStore(bufferStoreConfig, StoreIdentifier.BUFFER, true)
