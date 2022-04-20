import { useEffect } from 'react'
import create from 'zustand'

import { useBufferStore, useEditorBuffer } from '../Hooks/useEditorBuffer'
import useEditorStore, { getContent } from './useEditorStore'
import { areEqual } from '../Utils/hash'
import { TodoType } from '../Types/Todo'
import useTodoStore from './useTodoStore'
import { checkIfUntitledDraftNode } from '../Utils/strings'

export interface OutlineItem {
  id: string
  title: string
  type: string
  level?: number
}

export interface NodeAnalysis {
  nodeid: string
  tags: string[]
  outline: OutlineItem[]
  editorTodos: TodoType[]
  title?: string
}

interface AnalysisStore {
  analysis: NodeAnalysis
  setAnalysis: (analysis: NodeAnalysis) => void
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  analysis: {
    nodeid: undefined,
    tags: [],
    outline: [],
    editorTodos: []
  },
  setAnalysis: (analysis: NodeAnalysis) => {
    set({ analysis })
  }
}))

export const useAnalysisTodoAutoUpdate = () => {
  // const { setTodo } = useEditorStore(state => state)
  const analysis = useAnalysisStore((state) => state.analysis)
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)
  const node = useEditorStore((state) => state.node)

  useEffect(() => {
    const { editorTodos, nodeid } = useAnalysisStore.getState().analysis
    updateNodeTodos(nodeid, editorTodos)
  }, [analysis, node])
}

// export const useAnalysisIPC = () => {
//   const setAnalysis = useAnalysisStore((s) => s.setAnalysis)
//   const node = useEditorStore((s) => s.node)

//   const setIpc = () => {
//     ipcRenderer.on(IpcAction.RECEIVE_ANALYSIS, (_event, analysis: any) => {
//       // mog('analysisRECEIVEd', { analysis })
//       if (analysis) setAnalysis(analysis)
//     })
//   }

//   return setIpc
// }

export const useAnalysis = () => {
  const node = useEditorStore((s) => s.node)
  const { getBufferVal } = useEditorBuffer()
  const buffer = useBufferStore((s) => s.buffer)

  // mog('Setting up IPC for Buffer', { node })
  useEffect(() => {
    const bufferContent = getBufferVal(node.nodeid)
    const content = getContent(node.nodeid)
    const metadata = content.metadata
    const options = {}

    const isUntitledDraftNode = checkIfUntitledDraftNode(node.path)
    const isNewDraftNode = metadata?.createdAt === metadata?.updatedAt

    // * New Draft node, get Title from its content
    if (isUntitledDraftNode && isNewDraftNode) {
      options['title'] = true
    }

    // mog('sending for calc', { node, buffer })
    if (bufferContent) {
      // mog('Buffer for calc', { bufferContent })
      if (!areEqual(bufferContent, content.content)) {
        console.log("Handle case when not equal")
        // ipcRenderer.send(IpcAction.ANALYSE_CONTENT, { content: bufferContent, nodeid: node.nodeid, options })
      }
    } else {
      // mog('Content for calc', { content })
      if (content && content.content) {
        console.log("Handle case when equal")
      }
      // ipcRenderer.send(IpcAction.ANALYSE_CONTENT, { content: content.content, nodeid: node.nodeid, options })
    }
  }, [node.nodeid, buffer])

  return {}
}
