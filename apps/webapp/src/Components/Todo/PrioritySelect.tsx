import React, { useState } from 'react'

import { useTheme } from 'styled-components'

import { getMenuItem, Priority, PriorityDataType, PriorityType } from '@mexit/core'
import { getMIcon, InsertMenu, MexIcon, TodoActionButton } from '@mexit/shared'

interface PriorityMenuSelect {
  value: PriorityType
  onPriorityChange: (priority: Partial<PriorityDataType>) => void
  withLabel?: boolean
  readOnly?: boolean
  isVisible?: boolean
  name?: string
  shortcut?: string
}

const PriorityMenuButton = ({ color, value, selected, withLabel }) => {
  return (
    <TodoActionButton selected={selected}>
      <MexIcon
        color={color}
        $noHover
        icon={Priority[value]?.icon ?? Priority.noPriority.icon}
        fontSize={20}
        cursor="pointer"
      />
      {withLabel && <span>{Priority[value]?.title}</span>}
    </TodoActionButton>
  )
}

const PrioritySelect = ({
  readOnly,
  isVisible,
  name,
  value,
  shortcut,
  onPriorityChange,
  withLabel = false
}: PriorityMenuSelect) => {
  const [selected, setSelected] = useState(false)

  const onPriorityChangeHide = (id: PriorityType) => {
    onPriorityChange({ type: id })
  }

  const theme = useTheme()
  const iconColor = theme.editor.elements.todo.controls.iconColor

  if (readOnly) {
    return <PriorityMenuButton selected={selected || isVisible} color={iconColor} value={value} withLabel={withLabel} />
  }

  return (
    <InsertMenu
      isMenu
      allowSearch
      placeholder="Set priority..."
      shortcut={shortcut}
      title="Priority"
      selected={value}
      onClick={onPriorityChangeHide}
      icon={getMIcon('ICON', Priority[value ?? 'noPriority'].icon)}
      items={Object.values(Priority).map((priority) =>
        getMenuItem(priority.title, undefined, false, getMIcon('ICON', priority.icon), undefined, priority.type)
      )}
    />
  )
}

export default PrioritySelect
