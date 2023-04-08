import { SupportedAIEventTypes, useHistoryStore } from '@mexit/core'

import { StyledAIHistory, StyledAIHistoryContainer } from './styled'

const DEFAULT_HISTORY_LENGTH = 20

const AIHistory = ({ onClick }) => {
  const aiHistory = useHistoryStore((store) => store.ai)

  return (
    <StyledAIHistoryContainer>
      {aiHistory?.slice(-DEFAULT_HISTORY_LENGTH)?.map((event, i) => {
        const type = !event?.at(-1) ? undefined : event?.at(-1)?.type ?? SupportedAIEventTypes.PROMPT

        return (
          <StyledAIHistory key={i} onClick={() => onClick(i)} type={type}>
            <span />
          </StyledAIHistory>
        )
      })}
    </StyledAIHistoryContainer>
  )
}

export default AIHistory
