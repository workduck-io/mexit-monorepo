import React from 'react'
import { useContextMenu } from 'react-contexify'

import {Priority, PriorityDataType, PriorityType } from '@mexit/core'
import { MexIcon, TodoActionButton, TodoActionWrapper } from '@mexit/shared'

import PriorityMenu from './PriorityMenu'
import Tippy from '@tippyjs/react'

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

  const onPriorityChangeHide = (priority: PriorityDataType) => {
    onPriorityChange(priority)
    hideAll()
  }
  return (
    <>
      <TodoActionWrapper
        onClick={
          readOnly
            ? () => {
                /*empty*/
              }
            : show
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
              onClick={
                readOnly
                  ? () => {
                      /*empty*/
                    }
                  : show
              }
              icon={Priority[value]?.icon}
              fontSize={20}
              cursor="pointer"
            />
            {withLabel && <span>{Priority[value]?.title}</span>}
          </TodoActionButton>
        </Tippy>
      </TodoActionWrapper>
      <PriorityMenu id={menuId} onClick={onPriorityChangeHide} />
    </>
  )
}

export default PrioritySelect
