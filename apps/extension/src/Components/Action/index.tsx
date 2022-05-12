import { Icon } from '@iconify/react'
import { MexitAction } from '@mexit/core'
import React from 'react'
import styled, { css, useTheme } from 'styled-components'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { DisplayShortcut } from './Shortcuts'
import {
  StyledAction,
  Container,
  Content,
  Title,
  Description,
  ShortcutContainer,
  ShortcutText,
  ItemIcon
} from './styled'

interface ActionProps {
  action: MexitAction
  active?: boolean
}

const Action: React.FC<ActionProps> = ({ action, active }) => {
  const theme = useTheme()
  return (
    <StyledAction active={active}>
      <Container>
        <ItemIcon as={Icon} color={theme.colors.primary} height={20} width={20} icon={action?.icon} />
        <Content>
          <Title> {action.title}</Title>
          {action.description && <Description>{action.description}</Description>}
        </Content>
      </Container>
      {active && action.shortcut && (
        <ShortcutContainer>
          {Object.entries(action.shortcut).map(([key, shortcut]) => {
            // if (action.type === QuickLinkType.backlink && key === 'save') {
            //   if (!selection) return <span key={key}></span>
            // }

            return (
              <ShortcutText key={shortcut.title}>
                <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
              </ShortcutText>
            )
          })}
        </ShortcutContainer>
      )}
    </StyledAction>
  )
}

export default Action
