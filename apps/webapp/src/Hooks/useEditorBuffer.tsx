import create from 'zustand'

import { getContent, mog, NodeEditorContent, useBufferStore, useSnippetStore } from '@mexit/core'

import { areEqual } from '../Utils/hash'

import { useApi } from './API/useNodeAPI'
import { useNamespaces } from './useNamespaces'
import { useNodes } from './useNodes'
import { useDataSaverFromContent } from './useSave'
import { useSnippets } from './useSnippets'

export { useBufferStore }

export const useEditorBuffer = () => {
  const add2Buffer = useBufferStore((s) => s.add)
  const clearBuffer = useBufferStore((s) => s.clear)
  const clearBufferById = useBufferStore((s) => s.remove)
  const { isSharedNode } = useNodes()
  const { getNamespaceOfNodeid } = useNamespaces()

  const addOrUpdateValBuffer = (nodeid: string, val: NodeEditorContent) => {
    add2Buffer(nodeid, val)
  }

  const getBuffer = () => useBufferStore.getState().buffer
  const getBufferVal = (nodeid: string) => useBufferStore.getState().buffer[nodeid] ?? undefined

  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()

  const saveAndClearBuffer = (explicitSave?: boolean) => {
    const buffer = useBufferStore.getState().buffer

    Object.entries(buffer)
      .map(([nodeid, val]) => {
        const content = getContent(nodeid)
        const isBufferSame = areEqual(content.content, val)

        const isShared = isSharedNode(nodeid)
        const namespace = getNamespaceOfNodeid(nodeid)

        if (!isBufferSame) {
          try {
            saveEditorValueAndUpdateStores(nodeid, namespace?.id, val, { saveApi: true, isShared })
            clearBufferById(nodeid)
          } catch (err) {
            console.error('Something went wrong in Buffer clear', err)
          }
        }

        return !isBufferSame
      })
      .reduce((acc, cur) => acc || cur, false)
  }

  const saveNoteBuffer = async (noteId: string): Promise<boolean> => {
    const buffer = useBufferStore.getState().buffer?.[noteId]
    const content = getContent(noteId)?.content

    if (content) {
      const res = areEqual(content, buffer)
      if (!res) {
        const namespace = getNamespaceOfNodeid(noteId)
        try {
          await saveEditorValueAndUpdateStores(noteId, namespace.id, buffer, { saveApi: true })
          return true
        } catch (err) {
          mog('Unable to save content', { err })
        }
      }
    }
  }

  return { addOrUpdateValBuffer, saveAndClearBuffer, getBuffer, getBufferVal, clearBuffer, saveNoteBuffer }
}

interface SnippetBufferStore {
  buffer: Record<string, { content: NodeEditorContent; title: string; template?: boolean }>
  add: (nodeid: string, val: NodeEditorContent) => void
  addTitle: (nodeid: string, title: string) => void
  toggleTemplate: (nodeid: string, template: boolean) => void
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
  toggleTemplate: (nodeid: string, template: boolean) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, template } } })
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
  const api = useApi()
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
          const snippet = getSnippet(snippetId)
          api.saveSnippetAPI({
            snippetId,
            snippetTitle: val.title ?? snippet.title,
            content: val?.content ?? snippet?.content,
            template: val?.template ?? snippet?.template ?? false
          })
          // mog('snipppet', { snippetId, val, buffer, snippet })
          if (snippet)
            updateSnippetIndex({
              ...snippet,
              content: val.content ?? snippet.content,
              template: val.template ?? snippet.template,
              title: val.title ?? snippet.title
            })
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
