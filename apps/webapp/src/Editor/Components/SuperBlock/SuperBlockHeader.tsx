import { useFocused, useSelected } from 'slate-react'
import { useTheme } from 'styled-components'

import { FadeText, Group, RelativeTime } from '@mexit/shared'

import { BlockInfo } from '../../../Components/Editor/BlockInfo/BlockInfo.index'

import { Dot, Section } from './SuperBlock.styled'

const SuperBlockHeader = ({ element, LeftHeaderRenderer }) => {
  const theme = useTheme()

  const updatedAt = element?.metadata?.updatedAt
  const isSelected = useSelected()
  const isFocused = useFocused()

  const isActive = isSelected && isFocused

  return (
    <>
      <Section margin={`0 0 ${theme.spacing.medium}`} contentEditable={false}>
        <Group>
          <FadeText>{LeftHeaderRenderer && <LeftHeaderRenderer />}</FadeText>
          <Dot />
          {updatedAt && (
            <Group>
              <FadeText>
                <RelativeTime dateNum={updatedAt} />
              </FadeText>
            </Group>
          )}
        </Group>
        <BlockInfo element={element} />
      </Section>
    </>
  )
}

export default SuperBlockHeader
