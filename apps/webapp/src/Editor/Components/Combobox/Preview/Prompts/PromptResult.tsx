import { deserializeMd, usePlateEditorRef } from '@udecode/plate'

import { usePromptStore } from '../../../../../Stores/usePromptStore'
import EditorPreviewRenderer from '../../../../EditorPreviewRenderer'

type PromptResultProps = {
  promptId: string
}

const PromptResult = ({ promptId }) => {
  const result = usePromptStore((s) => s.results[promptId])
    ?.at(-1)
    ?.at(0)

  const editor = usePlateEditorRef(promptId)

  if (!promptId) return

  const content = deserializeMd(editor, result)

  return (
    <EditorPreviewRenderer noMouseEvents content={content} readOnly draftView editorId={`${result}_Preview_Block`} />
  )
}

export default PromptResult
