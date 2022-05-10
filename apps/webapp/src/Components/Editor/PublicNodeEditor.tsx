import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlateEditorRef, selectEditor } from '@udecode/plate'

import { defaultContent, mog } from '@mexit/core'

import Editor from './Editor'
import { usePublicNodeStore, PublicNode } from '../../Stores/usePublicNodes'
import { StyledEditor, EditorWrapper } from '../../Style/Editor'
import PublicNodeMetadata from '../EditorInfobar/PublicNodeMetadata'
import { useApi } from '../../Hooks/useApi'
import PublicDataInfobar from '../Infobar/PublicNodeInfobar'

const PublicNodeEditor = ({ nodeId }) => {
  const getPublicNode = usePublicNodeStore((store) => store.getPublicNode)
  const { getPublicNodeAPI } = useApi()
  const navigate = useNavigate()

  const [node, setNode] = useState<PublicNode>(getPublicNode(nodeId))

  useEffect(() => {
    async function getPublicNodeContent() {
      try {
        const node = await getPublicNodeAPI(nodeId)
        setNode(node)
      } catch (error) {
        navigate('/404')
      }
    }
    getPublicNodeContent()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  return (
    <StyledEditor showGraph={false} className="mex_editor">
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
      <PublicDataInfobar nodeId={nodeId} content={node?.content ?? defaultContent.content} />
    </StyledEditor>
  )
}

export default PublicNodeEditor
