import { getPlateId, platesStore } from '@udecode/plate'
import toast from 'react-hot-toast'

import { NodeProperties } from '@mexit/core'
import { useDataSaverFromContent } from './useSave'
import { useEditorStore } from '../Stores/useEditorStore'
import { useNodes } from './useNodes'

export const useSaver = () => {
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()
  const { isSharedNode } = useNodes()

  /**
   * Should be run on explicit save as it saves the current editor state
   * and everything else in the api and file system
   */
  const onSave = (
    node?: NodeProperties,
    writeToFile?: boolean, // Saved to file unless explicitly set to false
    notification?: boolean, // Shown notification unless explicitly set to false
    content?: any[] //  Replace content with given content instead of fetching from plate value
  ) => {
    const state = platesStore.get.state()

    const defaultNode = useEditorStore.getState().node
    const cnode = node || defaultNode

    // * Editor Id is different from nodeId
    const editorId = getPlateId()
    const hasState = !!state[editorId]
    const isShared = isSharedNode(cnode.nodeid)

    if (hasState || content) {
      const editorState = content ?? state[editorId].get.value()
      saveEditorValueAndUpdateStores(cnode.nodeid, editorState, { isShared })
    }

    if (notification !== false) toast('Saved!', { duration: 1000 })
  }

  return { onSave, saveEditorValueAndUpdateStores }
}
