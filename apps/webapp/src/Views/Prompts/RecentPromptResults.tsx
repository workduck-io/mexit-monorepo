import { deserializeMd, getPlateEditorRef } from '@udecode/plate'

import { Heading } from '@mexit/shared'

import { usePromptStore } from '../../Stores/usePromptStore'

import PromptResultPreview from './PromptResultPreview'
import { RecentPromptResultsContainer, ResultsContainer } from './styled'

type RecentPromptResults = {
  promptId: string
}

const RecentPromptResults: React.FC<RecentPromptResults> = ({ promptId }) => {
  const results = usePromptStore((store) => store.results[promptId])

  if (!results) return

  return (
    <RecentPromptResultsContainer>
      <Heading>Recently Generated Results</Heading>
      <ResultsContainer>
        {results.reduce((prev, current) => {
          const editor = getPlateEditorRef()
          return [
            ...prev,
            ...current.map((res) => {
              const content = deserializeMd(editor, res)
              return <PromptResultPreview content={content} id={res} />
            })
          ]
        }, [])}
      </ResultsContainer>
    </RecentPromptResultsContainer>
  )
}

export default RecentPromptResults
