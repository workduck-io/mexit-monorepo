import React from 'react'
import { MexitAction } from '@mexit/shared'
import styled, { css } from 'styled-components'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { StyledAction, Container, Content, Icon, Shortcut, Key, Title, Description } from './styled'

interface ActionProps {
  action: MexitAction
  active?: boolean
}

const Action: React.FC<ActionProps> = ({ action, active }) => {
  return (
    <StyledAction active={active}>
      <Container>
        <Icon>
          {action.data.icon && <img alt="Icon for Action" src={chrome.runtime.getURL(`/Assets/${action.data.icon}`)} />}
        </Icon>
        <Content>
          <Title> {action.title}</Title>
          {action.description && <Description>{action.description}</Description>}
        </Content>
      </Container>
      <Shortcut>
        {action.shortcut && action.shortcut.map((shortcutKey, id) => <Key key={id}>{shortcutKey}</Key>)}
      </Shortcut>
    </StyledAction>
  )
}

export default Action
