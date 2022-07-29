import React, { createContext, PropsWithChildren, ReactNode, useContext, useState } from 'react'

import {
  CategoryType,
  createNodeWithUid,
  defaultContent,
  getNewDraftKey,
  MexitAction,
  NodeContent,
  NodeEditorContent,
  NodeProperties
} from '@mexit/core'

type EditorContextType = {
  node: NodeProperties
  setNode: (node: NodeProperties) => void
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  persistedContent: NodeEditorContent
  setPersistedContent: (content: NodeEditorContent) => void
  previewMode: boolean
  setPreviewMode: (val: boolean) => void
}

const EditorContext = createContext<EditorContextType>(undefined!)
export const useEditorContext = () => useContext(EditorContext)

export const EditorProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [node, setNode] = useState(createNodeWithUid(getNewDraftKey()))
  const [nodeContent, setNodeContent] = useState(defaultContent.content)
  const [previewMode, setPreviewMode] = useState(true)
  const [persistedContent, setPersistedContent] = useState(defaultContent.content)

  const value = {
    node,
    setNode,
    nodeContent,
    setNodeContent,
    persistedContent,
    setPersistedContent,
    previewMode,
    setPreviewMode
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
