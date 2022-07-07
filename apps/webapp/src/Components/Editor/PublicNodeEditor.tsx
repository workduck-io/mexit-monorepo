import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlateEditorRef, selectEditor } from '@udecode/plate'

import { defaultContent, mog } from '@mexit/core'

import Editor from './Editor'
import { usePublicNodeStore, PublicNode } from '../../Stores/usePublicNodes'
import { StyledEditor, EditorWrapper, Title, FadeContainer } from '@mexit/shared'
import PublicNodeMetadata from '../EditorInfobar/PublicNodeMetadata'
import { useApi } from '../../Hooks/API/useNodeAPI'
import PublicDataInfobar from '../Infobar/PublicNodeInfobar'
import styled from 'styled-components'

const PublicStyledEditor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  max-width: 1000px;
  min-width: 400px;

  padding: 0 2rem;
  margin: 1rem 2rem;

  && > div {
    width: 100%;
    margin: 1rem;
  }

  ${Title} {
    margin: 0 2rem;
  }
`

const PublicNodeEditor = ({ nodeId, node }) => {
  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  return (
    <PublicStyledEditor className="mex_editor">
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
    </PublicStyledEditor>
  )
}

export default PublicNodeEditor
