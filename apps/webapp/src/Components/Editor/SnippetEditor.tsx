import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Editor from './Editor'
import { NodeInfo, NoteTitle, StyledEditor } from '../../Style/Editor'
import { Input } from '../../Style/Form'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { useSnippets } from '../../Hooks/useSnippets'

type Inputs = {
  title: string
}

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)

  const {
    register,
    formState: { errors }
  } = useForm<Inputs>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (snippet) {
      setContent(snippet.content)
    }
  }, [snippet])

  const { updateSnippet } = useSnippets()

  const onChangeSave = (val: any[]) => {
    if (val) {
      updateSnippet({ ...snippet, content: val })
    }
  }

  return (
    <StyledEditor className="snippets_editor">
      <NodeInfo>
        <NoteTitle>
          /snip. <Input defaultValue={snippet && snippet.title} {...register('title')} />
        </NoteTitle>
      </NodeInfo>

      <Editor onChange={onChangeSave} content={content} nodeUID={snippet.id} nodePath={snippet.title} />
    </StyledEditor>
  )
}

export default SnippetEditor
