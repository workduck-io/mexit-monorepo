import { Plate, usePlateEditorRef, createPlugins, createPlateUI } from '@udecode/plate'
import React, { useState } from 'react'
import styled from 'styled-components'
import { nanoid } from 'nanoid'

import generatePlugins from './plugins'
import { activityNode } from '../../Utils/activity'

type NodeEditorContent = any[]

const EditorWrapper = styled.div`
  margin: 1rem;
`

const initialValue = [
  {
    children: activityNode.content
  }
]

const Editor = () => {
  const nodeId = `NODE_${nanoid()}`
  const plugins = createPlugins(generatePlugins(), { components: createPlateUI() })

  return (
    <EditorWrapper>
      <Plate id={nodeId} initialValue={initialValue} plugins={plugins} />
    </EditorWrapper>
  )
}

export default Editor
