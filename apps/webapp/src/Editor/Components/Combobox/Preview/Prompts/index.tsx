import { ComboSeperator, PreviewMeta } from '@mexit/shared'

import usePrompts from '../../../../../Hooks/usePrompts'
import { usePromptStore } from '../../../../../Stores/usePromptStore'

import Prompt from './Prompt'
import PromptResult from './PromptResult'

type PromptPreviewProps = {
  promptId: string
}

const PromptPreview: React.FC<PromptPreviewProps> = ({ promptId }) => {
  const { allPrompts } = usePrompts()

  const results = usePromptStore((s) => s.results[promptId]?.at(-1))
  const prompt = allPrompts.find((prompt) => prompt.entityId === promptId)

  const metadata = {
    updatedAt: prompt?.updatedAt
  }

  return (
    <ComboSeperator fixedWidth>
      <section>{!results ? <Prompt prompt={prompt} /> : <PromptResult promptId={promptId} />}</section>
      {metadata && <PreviewMeta meta={metadata} />}
    </ComboSeperator>
  )
}

export default PromptPreview
