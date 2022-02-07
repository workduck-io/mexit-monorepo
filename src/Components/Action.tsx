import React from 'react'
import { MexitAction } from '../Types/Actions'
import styled, { css } from 'styled-components'

const Wrapper = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 0.5rem 0.75rem;
  color: #111;
  border-left: 2px solid transparent;

  ${(props) =>
    props.active &&
    css`
       {
        background-color: rgba(0, 0, 0, 0.05);
        border-left: 2px solid rgb(28, 28, 29);
      }
    `}
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;

  img {
    height: 24px;
    aspect-ratio: 1/1;
  }
`

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-size: 1.1rem;
    font-weight: 400;
    margin: 0;
  }

  p {
    font-size: 0.85rem;
    margin: 0.25rem 0 0.5rem 0;
  }
`

const Shortcut = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem;
`

const Key = styled.span`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 0.25rem;
  padding: 0.25rem;
`

interface ActionProps {
  action: MexitAction
  active?: boolean
}

const Action: React.FC<ActionProps> = ({ action, active }) => {
  return (
    <Wrapper active={active}>
      <Container>
        <Icon>
          {action.data.icon && <img alt="Icon for Action" src={chrome.runtime.getURL(`/assets/${action.data.icon}`)} />}
        </Icon>
        <Desc>
          <h3> {action.title}</h3>
          {action.description && <p>{action.description}</p>}
        </Desc>
      </Container>
      <Shortcut>
        {action.shortcut && action.shortcut.map((shortcutKey, id) => <Key key={id}>{shortcutKey}</Key>)}
      </Shortcut>
    </Wrapper>
  )
}

export default Action
