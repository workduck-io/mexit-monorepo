import { useMemo } from 'react'

import { deserializeMd, getPlateEditorRef } from '@udecode/plate'

import { usePromptStore } from '@mexit/core'

import EditorPreviewRenderer from '../../../../EditorPreviewRenderer'

type PromptResultProps = {
  promptId: string
}

const PromptResult: React.FC<PromptResultProps> = ({ promptId }) => {
  const index = usePromptStore((s) => s.resultIndexes[promptId])
  const results = usePromptStore((s) => s.results)

  if (!promptId) return

  const { content, result } = useMemo(() => {
    const editor = getPlateEditorRef(promptId)
    const result = usePromptStore.getState().results[promptId]?.at(index)?.at(0)
    const content = deserializeMd(editor, result)

    return {
      content,
      result
    }
  }, [promptId, index, results])

  return (
    <EditorPreviewRenderer
      noMouseEvents
      content={content}
      readOnly
      draftView
      editorId={`${promptId}_${result}_Preview_Block`}
    />
  )
}

export default PromptResult
