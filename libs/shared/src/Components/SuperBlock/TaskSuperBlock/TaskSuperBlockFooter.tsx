import React, { useMemo } from 'react'

import { getPlateEditorRef, removeBlocksAndFocus } from '@udecode/plate'
import { useFocused, useSelected } from 'slate-react'

import { getMenuItem, PriorityDataType, TaskStatusType, useUserCacheStore } from '@mexit/core'

import { Group } from '../../../Style/Layouts'
import { DefaultMIcons, getMIcon } from '../../Icons'
import { InsertMenu } from '../../InsertMenu'

import PrioritySelect from './PrioritySelect'
import { StatusSelect } from './StatusSelect'

export const TaskSuperBlockFooter = ({ value, onChange }) => {
  const usersCache = useUserCacheStore((store) => store.cache)

  const isActive = useFocused()
  const isBlockSelected = useSelected()

  const showBlockItems = isActive && isBlockSelected

  const users = useMemo(() => {
    const userList = usersCache.map((user) =>
      getMenuItem(user.name, () => undefined, false, getMIcon('AVATAR', user.email), undefined, user.id)
    )

    userList.unshift(getMenuItem('No Assignee', () => undefined, false, DefaultMIcons.MENTION, undefined, undefined))

    return userList
  }, [usersCache])

  const removeNode = () => {
    const editor = getPlateEditorRef()
    removeBlocksAndFocus(editor, { block: true })
  }

  const onInsert = (itemId: string) => {
    onChange({
      assignee: itemId
    })
  }

  const onPriorityChange = (priority: Partial<PriorityDataType>) => {
    onChange({
      priority: priority.type
    })
  }

  const onStatusChange = (status) => {
    onChange(status)
  }

  return (
    <Group>
      <InsertMenu
        isMenu
        allowSearch
        name="assignee"
        type="modal"
        // shortcut="KeyA"
        placeholder="Assign to..."
        selected={value?.['assignee']}
        icon={DefaultMIcons.MENTION}
        onClick={onInsert}
        title="Assignee"
        items={users}
      />

      <StatusSelect
        name="status"
        value={value?.['status'] ?? TaskStatusType.todo}
        onChange={onStatusChange}
        // shortcut="KeyS"
      />

      <PrioritySelect
        name="priority"
        value={value?.['priority']}
        onPriorityChange={onPriorityChange}
        isVisible
        // shortcut="KeyP"
      />
      {/* {isBlockSelected && <IconButton title="Delete" icon={DefaultMIcons.DELETE.value} onClick={removeNode} />} */}
    </Group>
  )
}
