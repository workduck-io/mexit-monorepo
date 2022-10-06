import React, { useMemo } from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import { Icon } from '@iconify/react'

import { Button, IconButton } from '@workduck-io/mex-components'

import { InfobarFull, InfobarTools } from '@mexit/shared'
import { Title } from '@mexit/shared'
import { ReminderGroupWrapper, ReminderInfobar, RemindersWrapper, ReminderUI } from '@mexit/shared'

import { useReminders } from '../../Hooks/useReminders'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import useToggleElements from '../../Hooks/useToggleElements'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useReminderStore } from '../../Stores/useReminderStore'
import { useTodoStore } from '../../Stores/useTodoStore'
import { useCreateReminderModal } from './CreateReminderModal'

const RemindersInfobar = () => {
  const infobar = useLayoutStore((s) => s.infobar)
  const { toggleReminder } = useToggleElements()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const remindersAll = useReminderStore((store) => store.reminders)
  const armedReminders = useReminderStore((store) => store.armedReminders)
  const { getNodeReminders, clearNodeReminders, getReminderControls } = useReminders()
  const nodeid = useEditorStore((store) => store.node.nodeid)
  const openModal = useCreateReminderModal((state) => state.openModal)
  const todos = useTodoStore((store) => store.todos)

  const { goTo } = useRouting()

  const reminderGroups = useMemo(() => {
    // mog('RemindersInfobar', { reminderGroups, remindersAll })
    const nodeReminders = getNodeReminders(nodeid)
    return nodeReminders
  }, [remindersAll, nodeid, armedReminders, todos])

  return (
    <InfobarFull>
      <InfobarTools>
        <IconButton
          size={24}
          icon={timerFlashLine}
          shortcut={shortcuts?.showReminder?.keystrokes}
          title="Reminders"
          highlight={infobar.mode === 'reminders'}
          onClick={toggleReminder}
        />
        <IconButton
          size={24}
          icon="ri-discuss-line"
          onClick={() => {
            goTo(ROUTE_PATHS.reminders, NavigationType.push)
          }}
          title="All Reminders"
        />
        <label htmlFor="reminders">Reminders</label>
        <IconButton
          size={24}
          icon={deleteBin6Line}
          onClick={() => clearNodeReminders(nodeid)}
          title="Delete All Finished Reminders"
        />
      </InfobarTools>

      <ReminderInfobar>
        <Title>Reminders</Title>
        <Button large primary onClick={() => openModal({ nodeid: nodeid })}>
          <Icon icon={addCircleLine} />
          Create Reminder
        </Button>
        {reminderGroups.map(
          (
            reminderGroup // const con = contents[suggestion.id]
          ) => (
            // const path = getPathFromNodeid(suggestion.id)
            // const content = con ? con.content : defaultContent.content
            // mog('SuggestionInfoBar', { content, con, path, suggestion })
            <ReminderGroupWrapper key={`ReminderGroup_${nodeid}_${reminderGroup.type}`}>
              <Title>{reminderGroup.label}</Title>
              <RemindersWrapper>
                {reminderGroup.reminders.map((reminder) => (
                  <ReminderUI
                    controls={getReminderControls(reminder)}
                    key={`ReminderFo_${reminder.id}`}
                    oid={`ReminderUI_for_${reminder.id}_infobar`}
                    reminder={reminder}
                  />
                ))}
              </RemindersWrapper>
            </ReminderGroupWrapper>
          )
        )}
      </ReminderInfobar>
    </InfobarFull>
  )
}

export default RemindersInfobar
