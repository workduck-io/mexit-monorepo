import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlateEditorRef, selectEditor } from '@udecode/plate'

import { defaultContent, mog } from '@mexit/core'

import Editor from './Editor'
import { usePublicNodeStore, PublicNode } from '../../Stores/usePublicNodes'
import { StyledEditor, EditorWrapper, Title } from '@mexit/shared'
import PublicNodeMetadata from '../EditorInfobar/PublicNodeMetadata'
import { useApi } from '../../Hooks/API/useNodeAPI'
import PublicDataInfobar from '../Infobar/PublicNodeInfobar'

const PublicNodeEditor = ({ nodeId, node }) => {
  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  return (
    <StyledEditor showGraph={false} className="mex_editor">
      <Title>
        <Link to={'/'}>Mexit</Link>
      </Title>
      {node?.metadata && <PublicNodeMetadata metadata={node.metadata} />}

      <EditorWrapper onClick={onFocusClick}>
        <Editor
          readOnly={true}
          nodeUID={nodeId}
          nodePath={node?.title ?? ''}
          content={node?.content ?? defaultContent.content}
          onChange={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
        />
      </EditorWrapper>
    </StyledEditor>
  )
}

export default PublicNodeEditor
