import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { selectEditor, usePlateEditorRef } from '@udecode/plate'
import styled from 'styled-components'

import { defaultContent, DefaultMIcons } from '@mexit/core'
import { EditorHeader, EditorWrapper, Group, NodeInfo, StyledEditor, Title } from '@mexit/shared'

import Metadata from '../EditorInfobar/Metadata'
import IconPicker from '../IconPicker/IconPicker'
import PublicNoteFooter from '../PublicNoteFooter'

import Editor from './Editor'

const NoteIcon = ({ icon }) => {
  return <IconPicker size={32} allowPicker={false} value={icon} />
}

const PublicNoteWrapper = styled.article`
  max-width: 860px;
  margin: 0 1rem;
  width: 100%;
`

const PublicStyledEditor = styled(StyledEditor)`
  height: 100vh;
  overflow: auto;
`

const PublicNodeEditor = ({ nodeId, node, namespaceId }) => {
  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  const noteIcon = useMemo(() => {
    if (node?.metadata?.icon) return node?.metadata?.icon

    return DefaultMIcons.NOTE
  }, [node])

  return (
    <PublicNoteWrapper>
      <EditorHeader>
        <NodeInfo>
          <Group>
            <NoteIcon key={`${nodeId}_${noteIcon.value}`} icon={noteIcon} />

            <Title>
              <Link to={'/'}>{node?.title}</Link>
            </Title>
          </Group>
        </NodeInfo>
        {node && <Metadata namespaceId={namespaceId} nodeId={nodeId} publicMetadata={node?.metadata} />}
      </EditorHeader>
      <PublicStyledEditor className="mex_editor">
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
      {node && <PublicNoteFooter nodeId={nodeId} />}
    </PublicNoteWrapper>
  )
}

export default PublicNodeEditor
