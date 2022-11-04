import React, { createContext, PropsWithChildren, useContext, useState } from 'react'

import { defaultContent, NodeEditorContent } from '@mexit/core'

type EditorContextType = {
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  previewMode: boolean
  setPreviewMode: (val: boolean) => void
}

const EditorContext = createContext<EditorContextType>(undefined!)
export const useEditorContext = () => useContext(EditorContext)

export const EditorProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [nodeContent, setNodeContent] = useState(defaultContent.content)
  const [previewMode, setPreviewMode] = useState(true)

  const value = {
    nodeContent,
    setNodeContent,
    previewMode,
    setPreviewMode
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
