import { Heading, PrimaryText } from '@mexit/shared'

type NoResultProps = {
  items: Array<any>
}

const NoResult: React.FC<NoResultProps> = ({ items }) => {
  return (
    items.length < 1 && (
      <div>
        <Heading>No Items Found</Heading>
        <p>
          Use <PrimaryText>Primary</PrimaryText> filter for better results.
        </p>
      </div>
    )
  )
}

export default NoResult
