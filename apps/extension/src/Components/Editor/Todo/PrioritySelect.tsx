import React, { useState } from 'react'

import { useTheme } from 'styled-components'

import { Priority, PriorityDataType, PriorityType } from '@mexit/core'
import { getMIcon, Menu, MenuItem, MexIcon, TodoActionButton, TodoActionWrapper } from '@mexit/shared'

interface PriorityMenuSelect {
  value: PriorityType
  onPriorityChange: (priority: PriorityDataType) => void
  withLabel?: boolean
  readOnly?: boolean
  isVisible?: boolean
}

const PriorityMenuButton = ({ color, value, selected, withLabel }) => {
  return (
    <TodoActionButton selected={selected}>
      <MexIcon color={color} $noHover icon={Priority[value]?.icon} fontSize={20} cursor="pointer" />
      {withLabel && <span>{Priority[value]?.title}</span>}
    </TodoActionButton>
  )
}

const PrioritySelect = ({ readOnly, isVisible, value, onPriorityChange, withLabel = false }: PriorityMenuSelect) => {
  const [selected, setSelected] = useState(false)

  const onPriorityChangeHide = (priority: PriorityDataType) => {
    onPriorityChange(priority)
  }

  const theme = useTheme()
  const iconColor = theme.editor.elements.todo.controls.iconColor

  if (readOnly) {
    return <PriorityMenuButton selected={selected || isVisible} color={iconColor} value={value} withLabel={withLabel} />
  }

  return (
    <TodoActionWrapper>
      <Menu
        onMouseEnter={() => setSelected(true)}
        onMouseLeave={() => setSelected(false)}
        values={
          <PriorityMenuButton selected={isVisible || selected} color={iconColor} value={value} withLabel={withLabel} />
        }
      >
        {Object.values(Priority).map((priority) => {
          return (
            <MenuItem
              icon={getMIcon('ICON', priority.icon)}
              color={iconColor}
              onClick={() => onPriorityChangeHide(priority)}
              label={priority.title}
            />
          )
        })}
      </Menu>
    </TodoActionWrapper>
  )
}

export default PrioritySelect
