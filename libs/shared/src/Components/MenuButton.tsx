import React, { useState } from 'react'

import styled from 'styled-components'

import { Group } from '../Style/Layouts'

import { IconDisplay } from './IconDisplay'
import { DefaultMIcons } from './Icons'
import { InsertMenu } from './InsertMenu'

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.tokens.text.default};
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[4]};
`

const ButtonContainer = styled.span`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  :hover {
    background: ${({ theme }) => theme.tokens.surfaces.s[4]};
  }
`

export const MenuButton = ({ items, defaultValue, onClick }) => {
  const [selected, setSelected] = useState(defaultValue ?? 'Publish')

  return (
    <ButtonGroup>
      <ButtonContainer onClick={onClick}>
        <Group>
          <IconDisplay icon={DefaultMIcons.PUBLIC} />
          <span>{selected}</span>
        </Group>
      </ButtonContainer>
      {selected && items && <InsertMenu items={items} allowSearch={false} isMenu icon={DefaultMIcons.DOWN_ARROW} />}
    </ButtonGroup>
  )
}
