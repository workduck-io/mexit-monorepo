import { Plate, usePlateEditorRef, createPlugins, createPlateUI } from '@udecode/plate'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useEditorChange } from '../Hooks/useEditorActions'
import { NodeEditorContent } from '../Types/Editor'
import generatePlugins from '../Utils/plugins'

const EditorWrapper = styled.div`
  margin: 1rem;
`

function Editor({ nodeId, content, onChange }: { nodeId: string; content: NodeEditorContent; onChange }) {
  const initialValue = [
    {
      children: content
    }
  ]

  const plugins = createPlugins(generatePlugins(), { components: createPlateUI() })

  useEditorChange(nodeId, content)

  return (
    <EditorWrapper>
      <Plate id={nodeId} value={initialValue} plugins={plugins} />
    </EditorWrapper>
  )
}

export default Editor
