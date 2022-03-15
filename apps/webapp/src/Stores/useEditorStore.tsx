import React from 'react'
import create from 'zustand'

import { NodeContent } from '../Types/Data'
import useContentStore from './useContentStore'

const ELEMENT_PARAGRAPH = 'p'

export function getContent(nodeid: string): NodeContent {
  // create a hashmap with id vs content
  // load the content from hashmap

  const { contents } = useContentStore.getState()

  // mog('getContent', { nodeid, contents, nodeidCon: contents[nodeid] })
  if (contents[nodeid]) {
    return contents[nodeid]
  }
  return defaultContent
}

export const getInitialNode = (): NodeProperties => ({
  title: '@',
  id: '@',
  path: '@',
  nodeid: '__null__'
})

export const defaultContent: NodeContent = {
  type: 'init',
  content: [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
  version: -1
}

export interface NodeProperties {
  title: string
  id: string
  nodeid: string
  path: string
}

export type EditorContextType = {
  // State

  // Data of the current node
  node: NodeProperties
  // Contents of the current node
  // These are loaded internally from ID
  content: NodeContent
  readOnly: boolean

  setUid: (nodeid: string) => void

  fetchingContent: boolean

  // State transformations

  // Load a node and its contents in the editor
  loadNode: (node: NodeProperties) => void

  setFetchingContent: (value: boolean) => void

  loadNodeAndReplaceContent: (node: NodeProperties, content: NodeContent) => void

  setReadOnly: (isReadOnly: boolean) => void
}

const useEditorStore = create<EditorContextType>((set, get) => ({
  node: getInitialNode(),
  content: defaultContent,
  readOnly: false,
  fetchingContent: false,

  setReadOnly: (isReadOnly: boolean) => {
    set({ readOnly: isReadOnly })
  },

  setUid: (nodeid) => {
    const node = get().node
    node.nodeid = nodeid
    set({ node })
  },

  setFetchingContent: (value) =>
    set({
      fetchingContent: value
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
  }
}))

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withNodeOps = (Component: any) => {
  return function C2(props: any) {
    const loadNode = useEditorStore((state) => state.loadNode)
    const currentNode = useEditorStore((state) => state.node)

    return <Component loadNode={loadNode} currentNode={currentNode} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}

export default useEditorStore
