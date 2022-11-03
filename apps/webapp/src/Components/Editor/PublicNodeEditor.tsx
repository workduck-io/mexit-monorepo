import { usePlateEditorRef, selectEditor } from '@udecode/plate'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { defaultContent } from '@mexit/core'
import { StyledEditor, EditorWrapper, Title } from '@mexit/shared'

import Metadata from '../EditorInfobar/Metadata'
import PublicNoteFooter from '../PublicNoteFooter'
import Editor from './Editor'

const PublicStyledEditor = styled(StyledEditor)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  max-width: 950px;
  min-width: 400px;

  padding: 0 2rem;
  margin: 1rem;

  && > div {
    width: 100%;
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
        <Link to={'/'}>{node?.title}</Link>
      </Title>

      {node && <Metadata nodeId={nodeId} publicMetadata={node?.metadata} />}

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
