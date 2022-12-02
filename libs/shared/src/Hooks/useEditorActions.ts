import { useEffect } from 'react'

import { NodeEditorContent } from '@mexit/core'

import { usePlateEditorRef } from '@udecode/plate'

export const useEditorChange = (editorId: string, content: NodeEditorContent, onChange?: any) => {
  const editor = usePlateEditorRef(editorId)
  useEffect(() => {
    if (editor && content) {
      editor.children = content
      if (onChange) onChange(content)
    }
  }, [editorId, content])
}
