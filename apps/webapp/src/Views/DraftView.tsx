import deleteBin6Line from '@iconify-icons/ri/delete-bin-6-line'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import React from 'react'
import genereateName from 'project-name-generator'
import { Wrapper, IconButton } from '@mexit/shared'
import { generateSnippetId } from '@workduck-io/mex-editor'
import { Editor } from 'slate'
import { useRouting, ROUTE_PATHS, NavigationType } from '../Hooks/useRouting'
import { SnippetCommandPrefix } from '../Hooks/useSnippets'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { Title } from '../Style/Elements'
import {
  SSnippets,
  CreateSnippet,
  SSnippet,
  SnippetHeader,
  SnippetCommand,
  StyledSnippetPreview
} from '../Style/Snippets'
import EditorPreviewRenderer from '../Components/EditorPreviewRenderer'
import { useRecentsStore } from '../Stores/useRecentsStore'
import useContentStore from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { defaultContent } from '@mexit/core'

function DraftView() {
  const { getContent, contents } = useContentStore()
  const { ilinks } = useDataStore()

  const { goTo } = useRouting()

  const onOpen = (id: string) => {
    goTo(ROUTE_PATHS.editor, NavigationType.push, id)
  }

  return (
    <Wrapper>
      <Title>Notes</Title>
      <SSnippets>
        {ilinks.map((s) => (
          <SSnippet key={`NODE_${s.nodeid}`}>
            <SnippetHeader>
              <SnippetCommand onClick={() => onOpen(s.nodeid)}>{s.path}</SnippetCommand>
            </SnippetHeader>

            <StyledSnippetPreview
              onClick={() => {
                onOpen(s.nodeid)
              }}
            >
              <EditorPreviewRenderer
                content={contents[s.nodeid] ? contents[s.nodeid].content : defaultContent.content}
                editorId={`Editor_Embed_${s.nodeid}`}
              />
            </StyledSnippetPreview>
          </SSnippet>
        ))}
      </SSnippets>
    </Wrapper>
  )
}

export default DraftView
