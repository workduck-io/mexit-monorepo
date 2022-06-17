import { Icon } from '@iconify/react'
import { PriorityDataType, Priority } from '@mexit/core'
import React from 'react'
import { Item } from 'react-contexify'
import styled from 'styled-components'
import { StyledContexifyMenu } from '@mexit/shared'

type PriorityMenuType = {
  id: string
  onClick: (priority: PriorityDataType) => void
}

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

const Text = styled.span`
  font-size: 0.8rem;
`

const PriorityMenu: React.FC<PriorityMenuType> = ({ onClick, id }) => {
  return (
    <StyledContexifyMenu contentEditable={false} id={id}>
      {Object.values(Priority).map((priority) => {
        return (
          <Item key={priority.title} id={priority.title} onClick={() => onClick(priority)}>
            <StyledItem>
              <Icon icon={priority.icon} fontSize={16} />
              <Text>{priority.title}</Text>
            </StyledItem>

            {/* <DisplayShortcut shortcut={priority.shortcut.keystrokes} /> */}
          </Item>
        )
      })}
    </StyledContexifyMenu>
  )
}

export default PriorityMenu
