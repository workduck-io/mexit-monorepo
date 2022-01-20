import React, { useEffect } from 'react'
import { Plate } from '@udecode/plate'
import styled from 'styled-components'
import { NodeEditorContent } from '../Types/Editor'
import { useEditorChange } from '../Hooks/useEditorActions'

const EditorWrapper = styled.div`
  margin: 1rem;
`

function Editor({ nodeId, content }: { nodeId: string; content: NodeEditorContent }) {
  const initialValue = [
    {
      children: content
    }
  ]

  useEditorChange(nodeId, content)

  return (
    <EditorWrapper>
      <Plate id={nodeId} value={initialValue} />
    </EditorWrapper>
  )
}

export default Editor
