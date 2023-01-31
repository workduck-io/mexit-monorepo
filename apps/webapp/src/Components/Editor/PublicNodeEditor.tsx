import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { selectEditor, usePlateEditorRef } from '@udecode/plate'
import styled from 'styled-components'

import { defaultContent, DefaultMIcons } from '@mexit/core'
import { EditorWrapper, Group, StyledEditor, Title } from '@mexit/shared'

import Metadata from '../EditorInfobar/Metadata'
import IconPicker from '../IconPicker/IconPicker'
import PublicNoteFooter from '../PublicNoteFooter'

import Editor from './Editor'

const NoteIcon = ({ icon }) => {
  return <IconPicker size={32} allowPicker={false} value={icon} />
}

const PublicStyledEditor = styled(StyledEditor)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  max-width: 950px;

  /* padding: 0 2rem; */
  margin: 1rem;
  padding-bottom: ${({ theme }) => theme.spacing.large};

  && > div {
    width: 100%;
  }
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
    <PublicStyledEditor className="mex_editor">
      <Group>
        <NoteIcon key={`${nodeId}_${noteIcon.value}`} icon={noteIcon} />

        <Title>
          <Link to={'/'}>{node?.title}</Link>
        </Title>
      </Group>

      {node && <Metadata namespaceId={namespaceId} nodeId={nodeId} publicMetadata={node?.metadata} />}

      <EditorWrapper onClick={onFocusClick}>
        <Editor
          readOnly={true}
          nodeUID={nodeId}
          nodePath={node?.title ?? ''}
          content={node?.content ?? defaultContent.content}
          onChange={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
        />
        {node && <PublicNoteFooter nodeId={nodeId} />}
      </EditorWrapper>
    </PublicStyledEditor>
  )
}

export default PublicNodeEditor
