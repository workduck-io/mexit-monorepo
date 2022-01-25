import React, { useEffect } from 'react'
import { Plate, usePlateEditorRef, selectEditor } from '@udecode/plate'
import styled from 'styled-components'
import { NodeEditorContent } from '../Types/Editor'
import { useEditorChange } from '../Hooks/useEditorActions'

const EditorWrapper = styled.div`
  margin: 1rem;
`

function Editor({ nodeId, content, onChange }: { nodeId: string; content: NodeEditorContent; onChange }) {
  const initialValue = [
    {
      children: content
    }
  ]
  const editorRef = usePlateEditorRef()

  useEditorChange(nodeId, content)

  return (
    <EditorWrapper>
      <Plate id={nodeId} value={initialValue} />
    </EditorWrapper>
  )
}

export default Editor
