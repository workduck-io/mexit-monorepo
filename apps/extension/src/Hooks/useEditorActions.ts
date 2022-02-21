import { usePlateEditorRef } from '@udecode/plate'
import { useEffect } from 'react'
import { NodeEditorContent } from '../Types/Editor'

export const useEditorChange = (editorId: string, content: NodeEditorContent) => {
  const editor = usePlateEditorRef(editorId)
  useEffect(() => {
    if (editor && content) {
      editor.children = content
    }
  }, [editorId, content])
}
