import create from 'zustand'

import { useDataStore, useEditorStore } from '@mexit/core'

import { useEditorBuffer } from './useEditorBuffer'
import { useLinks } from './useLinks'
import useLoad from './useLoad'
import { useNamespaces } from './useNamespaces'

interface ErrorState {
  prevNode: string
  alreadyErrored: boolean
  setPrevNode: (prevNode: string) => void
  setAlreadyErrored: (alreadyErrored: boolean) => void
  setErrorState: (curNode: string, alreadyErrored: boolean) => void
}

export const useEditorErrorStore = create<ErrorState>((set, get) => ({
  prevNode: '',
  alreadyErrored: false,
  setPrevNode: (prevNode: string) => set({ prevNode }),
  setAlreadyErrored: (alreadyErrored: boolean) => set({ alreadyErrored }),
  setErrorState: (prevNode: string, alreadyErrored: boolean) => set({ prevNode, alreadyErrored })
}))

const useEditorActions = () => {
  const { loadNode } = useLoad()
  const node = useEditorStore((s) => s.node)
  const { clearBuffer } = useEditorBuffer()
  const baseNodePath = useDataStore((s) => s.baseNodeId)
  const prevNode = useEditorErrorStore((s) => s.prevNode)
  const alreadyErrored = useEditorErrorStore((s) => s.alreadyErrored)
  const setErrorState = useEditorErrorStore((s) => s.setErrorState)
  const { getNodeidFromPath } = useLinks()
  const { getDefaultNamespace } = useNamespaces()

  const resetEditor = () => {
    let nodeIdToLoad = node.nodeid
    const defaultNamespace = getDefaultNamespace()
    const basenode_nodeId = getNodeidFromPath(baseNodePath, defaultNamespace.id)
    const loadNodeL = (nodeIdToLoad: string) => {
      clearBuffer()
      loadNode(nodeIdToLoad, { fetch: false, savePrev: false })
    }

    if (alreadyErrored) {
      if (prevNode === basenode_nodeId) {
        // What if the baseNode is bad?
        loadNodeL(basenode_nodeId)
        setErrorState(node.nodeid, true)
      } else if (prevNode === node.nodeid) {
        nodeIdToLoad = basenode_nodeId
        loadNodeL(basenode_nodeId)
        setErrorState(node.nodeid, false)
      }
    } else {
      nodeIdToLoad = node.nodeid
      loadNodeL(nodeIdToLoad)
      setErrorState(node.nodeid, true)
    }
  }

  return {
    resetEditor
  }
}

export default useEditorActions
