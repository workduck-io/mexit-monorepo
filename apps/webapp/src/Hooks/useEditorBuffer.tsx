import create from 'zustand'

import { NodeEditorContent } from '@mexit/core'

import { getContent } from '../Stores/useEditorStore'
import { areEqual } from '../Utils/hash'
import { useSnippets } from './useSnippets'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useDataSaverFromContent } from './useSave'
import { persist } from 'zustand/middleware'

interface BufferStore {
  buffer: Record<string, NodeEditorContent>
  add: (nodeid: string, val: NodeEditorContent) => void
  remove: (nodeid: string) => void
  clear: () => void
}

export const useBufferStore = create<BufferStore>(
  (set, get) => ({
    buffer: {},
    add: (nodeid, val) => set({ buffer: { ...get().buffer, [nodeid]: val } }),
    remove: (nodeid) => {
      const newBuffer = get().buffer
      if (newBuffer[nodeid]) delete newBuffer[nodeid]
      set({ buffer: newBuffer })
    },
    clear: () => set({ buffer: {} })
  })
)

export const useEditorBuffer = () => {
  const add2Buffer = useBufferStore((s) => s.add)
  const clearBuffer = useBufferStore((s) => s.clear)

  const addOrUpdateValBuffer = (nodeid: string, val: NodeEditorContent) => {
    add2Buffer(nodeid, val)
  }

  const getBuffer = () => useBufferStore.getState().buffer
  const getBufferVal = (nodeid: string) => useBufferStore.getState().buffer[nodeid] ?? undefined

  const { saveEditorValueAndUpdateStores, saveDataToPersistentStorage } = useDataSaverFromContent()

  const saveAndClearBuffer = (explicitSave?: boolean) => {
    const buffer = useBufferStore.getState().buffer
    if (Object.keys(buffer).length > 0) {
      const saved = Object.entries(buffer)
        .map(([nodeid, val]) => {
          const content = getContent(nodeid)
          const res = areEqual(content.content, val)
          if (!res) {
            saveEditorValueAndUpdateStores(nodeid, val, true)
          }
          return !res
        })
        .reduce((acc, cur) => acc || cur, false)
      if (saved || explicitSave) {
        saveDataToPersistentStorage()
      }
      clearBuffer()
    }
  }

  return { addOrUpdateValBuffer, saveAndClearBuffer, getBuffer, getBufferVal, clearBuffer }
}

interface SnippetBufferStore {
  buffer: Record<string, { content: NodeEditorContent; title: string; isTemplate?: boolean }>
  add: (nodeid: string, val: NodeEditorContent) => void
  addTitle: (nodeid: string, title: string) => void
  toggleIsTemplate: (nodeid: string, isTemplate: boolean) => void
  addAll: (nodeid: string, val: NodeEditorContent, title: string) => void
  remove: (nodeid: string) => void
  clear: () => void
}

export const useSnippetBufferStore = create<SnippetBufferStore>((set, get) => ({
  buffer: {},
  add: (nodeid, val) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, content: val } } })
  },
  addTitle: (nodeid, title) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, title } } })
  },
  toggleIsTemplate: (nodeid: string, isTemplate: boolean) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, isTemplate } } })
  },
  addAll: (nodeid, val, title) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, content: val, title } } })
  },
  remove: (nodeid) => {
    const newBuffer = get().buffer
    if (newBuffer[nodeid]) delete newBuffer[nodeid]
    set({ buffer: newBuffer })
  },
  clear: () => set({ buffer: {} })
}))

export const useSnippetBuffer = () => {
  const add2Buffer = useSnippetBufferStore((s) => s.add)
  const clearBuffer = useSnippetBufferStore((s) => s.clear)
  const updateSnippetContent = useSnippetStore((s) => s.updateSnippetContentAndTitle)
  // const { saveData } = useSaveData()
  const { updateSnippet: updateSnippetIndex, getSnippet } = useSnippets()

  const addOrUpdateValBuffer = (snippetId: string, val: NodeEditorContent) => {
    add2Buffer(snippetId, val)
  }

  const getBuffer = () => useSnippetBufferStore.getState().buffer
  const getBufferVal = (nodeid: string) => useSnippetBufferStore.getState().buffer[nodeid] ?? undefined

  const saveAndClearBuffer = () => {
    const buffer = useSnippetBufferStore.getState().buffer
    if (Object.keys(buffer).length > 0) {
      const saved = Object.entries(buffer)
        .map(([snippetId, val]) => {
          updateSnippetContent(snippetId, val.content, val.title, val.isTemplate)
          const snippet = getSnippet(snippetId)
          // TODO: Switch snippet to template index
          if (snippet) updateSnippetIndex({ ...snippet, content: val.content, title: val.title })
          return true
        })
        .reduce((acc, cur) => acc || cur, false)
      if (saved) {
        // saveData()
      }
      clearBuffer()
    }
  }

  return { addOrUpdateValBuffer, saveAndClearBuffer, getBuffer, getBufferVal, clearBuffer }
}
