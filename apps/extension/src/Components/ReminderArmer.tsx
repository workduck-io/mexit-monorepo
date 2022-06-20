import { IpcAction, mog, ReminderActionIpcData } from '@mexit/core'
import React, { useEffect } from 'react'
import { useReminders } from '../Hooks/useReminders'
import { useReminderStore } from '../Stores/useReminderStore'

const ReminderArmer = () => {
  const reminders = useReminderStore((state) => state.reminders)
  const {
    getToArmReminders,
    armReminders,
    clearAllArmedReminders,
    armMissedReminders,
    actOnReminder,
    getMissedReminders
  } = useReminders()

  // Set reminder action listner
  useEffect(() => {
    // ipcRenderer.on(IpcAction.ACTION_REMINDER, (_event, arg: ReminderActionIpcData) => {
    //   // goTo(ROUTE_PATHS.node, NavigationType.push, appleNotesUID)
    //   // mog('ReminderArmer: IpcAction.ACTION_REMINDER', { arg })
    //   const { action, reminder } = arg
    //   actOnReminder(action, reminder)
    // })
    console.log('something nothing', {})
  }, [])

  useEffect(() => {
    const toArmRems = getToArmReminders()
    // mog('ReminderArmer: useEffect', { reminders, toArmRems })

    if (toArmRems.length > 0) {
      toArmRems.forEach((rems) => armReminders(rems.reminders, rems.time))
    } else {
      // mog('ReminderArmer: Arming missed reminders', { reminders })
      // armMissedReminders()
    }

    const intervalId = setInterval(() => {
      const missedRems = getMissedReminders()
      // mog('ReminderArmer: Arming missed reminders', { reminders, missedRems })
      if (missedRems.length > 0) {
        armMissedReminders()
      }
    }, 1000 * 60 * 1) // one minutes

    return () => {
      // mog('ReminderArmer: unArming reminders', { reminders })
      clearInterval(intervalId)
      clearAllArmedReminders()
    }
  }, [reminders])

  return <></>
}

export default ReminderArmer
