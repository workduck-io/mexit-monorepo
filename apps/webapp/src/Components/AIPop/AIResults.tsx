import { AIResult, StyledAIResults } from './styled'

type AIResultsProps = {
  results: Array<string>
}

const AIResults: React.FC<AIResultsProps> = ({ results }) => {
  return (
    <StyledAIResults>
      {results?.map((result) => {
        return <AIResult>{result}</AIResult>
      })}
    </StyledAIResults>
  )
}

export default AIResults
