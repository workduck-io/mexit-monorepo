import { useTheme } from 'styled-components'

import { DefaultMIcons, Description, FadeText, Group, IconDisplay, RelativeTime } from '@mexit/shared'

import { Section } from './SuperBlock.styled'

const SuperBlockHeader = ({ element }) => {
  const theme = useTheme()

  const updatedAt = element?.metadata?.updatedAt

  return (
    <>
      <Section margin={`0 0 ${theme.spacing.small}`} contentEditable={false}>
        <FadeText>
          <Group>
            <IconDisplay icon={DefaultMIcons.TASK} size={14} />
            <Description size="small">Task</Description>
          </Group>
        </FadeText>
        {updatedAt && (
          <Group>
            <FadeText>
              <RelativeTime dateNum={element?.metadata?.updatedAt} />
            </FadeText>
          </Group>
        )}
      </Section>
    </>
  )
}

export default SuperBlockHeader
