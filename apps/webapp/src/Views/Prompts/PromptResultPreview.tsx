import fileAddLine from '@iconify/icons-ri/file-add-line'
import generateName from 'project-name-generator'

import { IconButton } from '@workduck-io/mex-components'

import { DefaultMIcons, DRAFT_NODE, generateSnippetId, NodeEditorContent } from '@mexit/core'

import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useSnippets } from '../../Hooks/useSnippets'
import { useSnippetStore } from '../../Stores/useSnippetStore'

import { ResultEditorWrapper, ResultPreviewContainer } from './styled'

type PromptResultPreview = {
  id: string
  content: NodeEditorContent
}

const PromptResultPreview = ({ content, id }) => {
  const { addSnippet } = useSnippets()
  const { goTo } = useRouting()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const onSave = (generateTitle = false) => {
    const snippetId = generateSnippetId()
    const snippetName = generateTitle ? generateName().dashed : DRAFT_NODE

    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: DefaultMIcons.SNIPPET,
      content
    })

    loadSnippet(snippetId)

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  return (
    <ResultPreviewContainer>
      <span>
        <IconButton title="Save as Snippet" size="20px" icon={fileAddLine} onClick={onSave} />
      </span>
      <ResultEditorWrapper>
        <EditorPreviewRenderer readOnly content={content} editorId={`${id}_Snippet_Preview_Editor`} />
      </ResultEditorWrapper>
    </ResultPreviewContainer>
  )
}

export default PromptResultPreview
