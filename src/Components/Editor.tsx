import { Plate, usePlateEditorRef } from '@udecode/plate'
import React from 'react'
import styled from 'styled-components'
import { useEditorChange } from '../Hooks/useEditorActions'
import { NodeEditorContent } from '../Types/Editor'

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
