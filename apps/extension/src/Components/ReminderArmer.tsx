import React, { useEffect } from 'react'

import { useReminderStore } from '@mexit/core'

import { useReminders } from '../Hooks/useReminders'

const ReminderArmer = () => {
  const reminders = useReminderStore((state) => state.reminders)
  const { getToArmReminders, armReminders, clearAllArmedReminders, armMissedReminders, getMissedReminders } =
    useReminders()

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
