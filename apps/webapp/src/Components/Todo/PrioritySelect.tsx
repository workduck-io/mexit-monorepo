import React from 'react'
import { useContextMenu } from 'react-contexify'

import Tippy from '@tippyjs/react'

import { Priority, PriorityDataType, PriorityType } from '@mexit/core'
import { MexIcon, Portal, TodoActionButton, TodoActionWrapper } from '@mexit/shared'

import PriorityMenu from './PriorityMenu'

interface PriorityMenuSelect {
  id: string
  value: PriorityType
  onPriorityChange: (priority: PriorityDataType) => void
  withLabel?: boolean
  readOnly?: boolean
}

const PrioritySelect = ({ id, readOnly, value, onPriorityChange, withLabel = false }: PriorityMenuSelect) => {
  const menuId = `${id}-priority-menu`

  const { show, hideAll } = useContextMenu({ id: menuId })
  // ref for span element

  const onPriorityChangeHide = (priority: PriorityDataType) => {
    onPriorityChange(priority)
    hideAll()
  }

  return (
    <>
      <TodoActionWrapper
        onClick={(e) =>
          readOnly
            ? () => {
                /*empty*/
              }
            : show(e, { position: { x: e.pageX, y: e.pageY } })
        }
      >
        <Tippy
          delay={100}
          interactiveDebounce={100}
          placement="bottom"
          appendTo={() => document.body}
          theme="mex"
          content={Priority[value]?.title}
        >
          <TodoActionButton>
            <MexIcon
              $noHover
              onClick={(e) =>
                readOnly
                  ? () => {
                      /*empty*/
                    }
                  : show(e, { position: { x: e.pageX, y: e.pageY } })
              }
              icon={Priority[value]?.icon}
              fontSize={20}
              cursor="pointer"
            />
            {withLabel && <span>{Priority[value]?.title}</span>}
          </TodoActionButton>
        </Tippy>
      </TodoActionWrapper>
      <Portal id="priority-select">
        <PriorityMenu id={menuId} onClick={onPriorityChangeHide} />
      </Portal>
    </>
  )
}

export default PrioritySelect
