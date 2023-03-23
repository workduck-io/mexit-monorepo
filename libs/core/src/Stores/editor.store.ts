import { NodeContent, NodeProperties } from '../Types/Editor'
import { StoreIdentifier } from '../Types/Store'
import { defaultContent, getDefaultContent } from '../Utils/helpers'
import { createStore } from '../Utils/storeCreator'
import { getInitialNode } from '../Utils/treeUtils'

import { ComboTriggerType } from './combobox.store'
import { useContentStore } from './content.store'

export function getContent(nodeId: string): NodeContent {
  const contents = useContentStore.getState().contents

  if (contents[nodeId]) {
    return contents[nodeId]
  }

  return {
    ...defaultContent,
    content: [getDefaultContent()]
  }
}

const getInitialEditorStoreState = () => ({
  node: getInitialNode(),
  content: [getDefaultContent()],
  readOnly: false,
  isBannerVisible: false,
  fetchingContent: false,
  activeUsers: [] as Array<string>,
  isEditing: false,
  loadingNodeid: null as string | null,
  trigger: undefined as ComboTriggerType | undefined
})

export const editorStoreConfig = (set, get) => ({
  ...getInitialEditorStoreState(),
  notifyWithBanner: (showBanner: boolean) => set({ isBannerVisible: showBanner }),
  setTrigger: (trigger) => set({ trigger }),
  setActiveUsers: (users) => {
    set({ activeUsers: users, isBannerVisible: users.length !== 0 })
  },
  addUser: (userId) => {
    const s = get().activeUsers
    set({ activeUsers: [...s, userId], isBannerVisible: true })
  },
  removeUser: (userId) => {
    const userToRemoveAtIndex = get().activeUsers.findIndex((id) => id === userId)

    if (userToRemoveAtIndex >= 0) {
      const newUsers = get().activeUsers
      newUsers.splice(userToRemoveAtIndex, 1)

      set({ activeUsers: newUsers, isBannerVisible: newUsers.length !== 0 })
    }
  },

  setReadOnly: (isReadOnly: boolean) => {
    set({ readOnly: isReadOnly })
  },

  setUid: (nodeid) => {
    const node = get().node
    node.nodeid = nodeid
    set({ node })
  },

  setIsEditing: (isEditing: boolean) => {
    if (get().isEditing === isEditing) return
    set({ isEditing })
  },

  setNode: (node: NodeProperties) => set({ node }),

  setFetchingContent: (value) =>
    set({
      fetchingContent: value
    }),

  setLoadingNodeid: (nodeid) =>
    set({
      loadingNodeid: nodeid
    }),
  clearLoadingNodeid: () =>
    set({
      loadingNodeid: null
    }),

  loadNode: (node: NodeProperties) => {
    const content = getContent(node.nodeid)
    set({
      node,
      content
    })
  },

  loadNodeAndReplaceContent: (node, content) => {
    set({ node, content })
  },
  reset: () => {
    const initialState = getInitialEditorStoreState()
    set(initialState)
  }
})

export const useEditorStore = createStore(editorStoreConfig, StoreIdentifier.EDITOR, true, {
  storage: {
    web: localStorage
  }
})
