import { IconButton } from '@workduck-io/mex-components'

import { FloatingElementType, useFloatingStore } from '@mexit/core'
import { DefaultMIcons, Group, IconDisplay, Menu, MenuItem, Text } from '@mexit/shared'

import { useCreateNewMenu } from '../../Hooks/useCreateNewMenu'

import { AIContainerFooter, AIContainerHeader, AIContainerSection, AIMenuSelector, StyledAIContainer } from './styled'

const AIBlockPopover = () => {
  const floatingElement = useFloatingStore((s) => s.floatingElement)
  const floatElementState = useFloatingStore((s) => s.state[FloatingElementType.AI_TOOLTIP])

  const { getAIMenuItems } = useCreateNewMenu()

  if (!floatElementState) {
    return null
  }

  return (
    <StyledAIContainer>
      <AIContainerHeader>
        <Menu
          noHover
          noBackground
          values={
            <AIMenuSelector>
              <IconDisplay icon={DefaultMIcons.AI} />
              <Text>{floatElementState.label ?? 'Summarize'}</Text>
            </AIMenuSelector>
          }
        >
          {getAIMenuItems().map((menuItem) => {
            return (
              <MenuItem key={menuItem.id} icon={menuItem.icon} onClick={menuItem.onSelect} label={menuItem.label} />
            )
          })}
        </Menu>
        <Group>
          <IconButton title="Insert" size={12} icon={DefaultMIcons.INSERT.value} />
          <IconButton title="Embed" size={12} icon={DefaultMIcons.EMBED.value} />
        </Group>
      </AIContainerHeader>
      <AIContainerSection></AIContainerSection>
      <AIContainerFooter>
        <IconButton title="History" size={12} icon="ri:time-line" />
      </AIContainerFooter>
    </StyledAIContainer>
  )
}

export default AIBlockPopover
