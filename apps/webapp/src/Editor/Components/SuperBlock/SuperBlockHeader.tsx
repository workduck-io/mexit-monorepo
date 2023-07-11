import { useTheme } from 'styled-components'

import { FadeText, Group, RelativeTime } from '@mexit/shared'

import { BlockInfo } from '../../../Components/Editor/BlockInfo/BlockInfo.index'

import { Dot, Section } from './SuperBlock.styled'
import { MetadataFields, PropertiyFields } from './SuperBlock.types'

interface ISuperBlockHeaderProps {
  id: string
  parent: string

  isSelected?: boolean
  isFocused?: boolean

  value?: PropertiyFields
  metadata: MetadataFields
  LeftHeaderRenderer: any
}

const SuperBlockHeader: React.FC<ISuperBlockHeaderProps> = (props) => {
  const { value, metadata, LeftHeaderRenderer, ...blockInfo } = props

  const updatedAt = metadata?.updatedAt

  const theme = useTheme()

  return (
    <Section margin={`0 0 ${theme.spacing.medium}`} contentEditable={false}>
      <Group>
        <FadeText>{LeftHeaderRenderer && LeftHeaderRenderer}</FadeText>

        {updatedAt && (
          <>
            <Dot />
            <FadeText>
              <RelativeTime dateNum={updatedAt} />
            </FadeText>
          </>
        )}
      </Group>
      {blockInfo.id && blockInfo.parent && <BlockInfo {...blockInfo} />}
    </Section>
  )
}

export default SuperBlockHeader
