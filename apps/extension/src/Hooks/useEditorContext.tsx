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
import React, { createContext, useContext, useState } from 'react'

type EditorContextType = {
  node: NodeProperties
  setNode: (node: NodeProperties) => void
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  previewMode: boolean
  setPreviewMode: (val: boolean) => void
}

const EditorContext = createContext<EditorContextType>(undefined!)
export const useEditorContext = () => useContext(EditorContext)

export const EditorProvider: React.FC = ({ children }: any) => {
  const [node, setNode] = useState(createNodeWithUid(getNewDraftKey()))
  const [nodeContent, setNodeContent] = useState(defaultContent.content)
  const [previewMode, setPreviewMode] = useState(true)

  const value = {
    node,
    setNode,
    nodeContent,
    setNodeContent,
    previewMode,
    setPreviewMode
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
