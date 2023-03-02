import { NodeContent, NodeProperties } from '../Types/Editor';
import { StoreIdentifier } from '../Types/Store';
import { defaultContent } from '../Utils/helpers';
import { createStore } from '../Utils/storeCreator'
import { getInitialNode } from '../Utils/treeUtils';

import { ComboTriggerType } from './combobox.store';
import { useContentStore } from './content.store';

export function getContent(nodeid: string): NodeContent {
  // create a hashmap with id vs content
  // load the content from hashmap

  const { contents } = useContentStore.getState()

  if (contents[nodeid]) {
    return contents[nodeid]
  }
  return defaultContent
}

const TRIGGER: ComboTriggerType | undefined = undefined
export const editorStoreConfig = (set, get) => ({
      node: getInitialNode(),
      content: defaultContent,
      readOnly: false,
      isBannerVisible: false,
      fetchingContent: false,
      activeUsers: [],
      isEditing: false,
      loadingNodeid: null,

      notifyWithBanner: (showBanner: boolean) => set({ isBannerVisible: showBanner }),
      trigger: TRIGGER,
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
        set({
          node: getInitialNode(),
          content: defaultContent,
          readOnly: false,
          isBannerVisible: false,
          fetchingContent: false,
          activeUsers: [],
          isEditing: false,
          loadingNodeid: null
        })
      }
    })
//     ,
//     { name: 'mex-editor', partialize: (s) => ({ node: s.node }) }
//   )
// )

export const useEditorStore = createStore(editorStoreConfig, StoreIdentifier.EDITOR , true)