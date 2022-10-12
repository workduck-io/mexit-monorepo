import { PriorityType, PriorityDataType, Priority } from '@mexit/core'
import { MexIcon, TodoActionButton, TodoActionWrapper } from '@mexit/shared'
import Tippy from '@tippyjs/react'
import React from 'react'
import { useContextMenu } from 'react-contexify'
import PriorityMenu from './PriorityMenu'

interface PriorityMenuSelect {
  id: string
  value: PriorityType
  onPriorityChange: (priority: PriorityDataType) => void
  withLabel?: boolean
}

const PrioritySelect = ({ id, value, onPriorityChange, withLabel = false }: PriorityMenuSelect) => {
  const menuId = `${id}-priority-menu`
  const { show, hideAll } = useContextMenu({ id: menuId })
  const onPriorityChangeHide = (priority: PriorityDataType) => {
    onPriorityChange(priority)
    hideAll()
  }
  return (
    <>
      <TodoActionWrapper onClick={show}>
        <Tippy
          delay={100}
          interactiveDebounce={100}
          placement="bottom"
          appendTo={() => document.body}
          theme="mex"
          content={Priority[value]?.title}
        >
          <TodoActionButton>
            <MexIcon onClick={show} icon={Priority[value]?.icon} fontSize={20} cursor="pointer" />
            {withLabel && <span>{Priority[value]?.title}</span>}
          </TodoActionButton>
        </Tippy>
      </TodoActionWrapper>
      <PriorityMenu id={menuId} onClick={onPriorityChangeHide} />
    </>
  )
}

export default PrioritySelect
