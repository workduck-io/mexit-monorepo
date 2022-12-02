import { add, sub } from 'date-fns'
import { uniqBy } from 'lodash'
import md5 from 'md5'

import {   DisplayReminder,
  DisplayReminderGroup,
getReminderState,   isInSameMinute,
mog,   NodeReminderGroup,
past,   Reminder,
  ReminderActions,
ReminderControls,   ReminderGroup,
  ReminderState,
SnoozeControl, upcoming } from '@mexit/core'

import { useReminderStore } from '../Stores/useReminderStore'
import { useTodoStore } from '../Stores/useTodoStore'

import { useReminderAPI } from './API/useReminderAPI'
import { useLinks } from './useLinks'

export const useReminders = () => {
  const reminders = useReminderStore((state) => state.reminders)
  const setReminders = useReminderStore((state) => state.setReminders)
  const addReminderStore = useReminderStore((state) => state.addReminder)
  const deleteReminderStore = useReminderStore((state) => state.deleteReminder)
  const updateReminder = useReminderStore((state) => state.updateReminder)
  const clearReminders = useReminderStore((state) => state.clearReminders)
  const getTodo = useTodoStore((state) => state.getTodoOfNodeWithoutCreating)

  // const setArmedReminders = useReminderStore((state) => state.setArmedReminders)
  const addArmReminder = useReminderStore((state) => state.addArmReminder)
  const clearArmedReminders = useReminderStore((state) => state.clearArmedReminders)

  const updatePriorityOfTodo = useTodoStore((store) => store.updatePriorityOfTodo)
  const updateStatusOfTodo = useTodoStore((store) => store.updateStatusOfTodo)

  const { saveReminder, deleteAllNode, deleteReminder: deleteReminderAPI } = useReminderAPI()

  const snoozeReminder = (reminder: Reminder, time: number) => {
    const newReminder = { ...reminder, state: { ...reminder.state, done: false, snooze: true }, time }
    saveReminder(newReminder).then((res) => {
      mog('Updated reminder state', res)
      updateReminder(newReminder)
    })
  }

  const updateReminderState = (reminder: Reminder, state: ReminderState) => {
    const newReminder = { ...reminder, state }
    saveReminder(newReminder).then((res) => {
      mog('Updated reminder state', res)
      updateReminder(newReminder)
    })
  }

  const deleteReminder = (id: string) => {
    deleteReminderAPI(id).then((res) => {
      mog('Deleted reminder', res)
      deleteReminderStore(id)
    })
  }

  // TODO: Figure out save data scenes
  // const { saveData } = useSaveData()
  const { getPathFromNodeid } = useLinks()

  const dismissReminder = (reminder: Reminder) => {
    const newReminderState: ReminderState = {
      ...reminder.state,
      done: true
    }
    updateReminderState(reminder, newReminderState)
  }

  const markUndone = (reminder: Reminder) => {
    const newReminderState: ReminderState = {
      ...reminder.state,
      done: false
    }
    updateReminderState(reminder, newReminderState)
  }

  // const getTodayReminders = (filter?: SearchFilter<Reminder>) => {
  //   const filteredReminders = filter ? getFilteredReminders(filter) : reminders
  //   filteredReminders.filter(today)
  // }

  // const getFilteredReminders = (filter: SearchFilter<Reminder>) => {
  //   return reminders.filter((reminder) => {
  //     return filter.filter(reminder)
  //   })
  // }

  const isArmed = (reminder: Reminder) => {
    return useReminderStore.getState().armedReminders.some((r) => r.reminderId === reminder.id)
  }

  /*
   * Wether to arm a reminder
   * @param {Reminder} reminder
   *
   */
  const toArm = (reminder: Reminder) => {
    if (isArmed(reminder)) return false
    if (reminder.state.done) return false
    if (next24(reminder) || prev24(reminder)) return true
    return false
  }

  /*
   * If reminder is in next 24 hour
   */
  const prev24 = (reminder: Reminder) => {
    const now = new Date()
    const prev24t = sub(now, { hours: 24 })
    if (now.getTime() > reminder.time && reminder.time >= prev24t.getTime()) {
      return true
    }
    return false
  }

  /*
   * If reminder is in next 24 hour
   */
  const next24 = (reminder: Reminder) => {
    const now = new Date()
    const next24t = add(now, { hours: 24 })
    if (now.getTime() <= reminder.time && next24t.getTime() >= reminder.time) {
      return true
    }
    return false
  }

  /*
   * Reminders that are missed
   * Filtered from the previous week
   * Includes snoozed reminders
   */
  const missed = (reminder: Reminder) => {
    if (reminder.state.done) return false
    const nowExact = new Date()
    const now = sub(nowExact, { seconds: 60 })
    const prevDay = sub(now, { days: 1 })
    const isWithinDay = prevDay.getTime() < reminder.time && reminder.time < now.getTime()
    if (isWithinDay) {
      return true
    }
    return false
  }

  const getMissedReminders = () => {
    const reminders = useReminderStore.getState().reminders
    return reminders.filter((reminder) => {
      return missed(reminder)
    })
  }

  const getBlockReminder = (blockid: string) => {
    const reminders = useReminderStore.getState().reminders
    return reminders.find((reminder) => reminder.todoid === blockid)
  }
  /*
   * Reminders that are to be armed
   * Includes snoozed and missed reminders
   * Filtered for the arm condition in toArm
   */
  const getToArmReminders = (): { reminders: Reminder[]; time: number }[] => {
    const reminders = useReminderStore.getState().reminders
    const upcomingReminders = reminders.filter(upcoming).filter(toArm)
    const tobeArmedReminders = uniqBy(upcomingReminders, 'id')

    // mog('tobeArmedReminders', {
    //   tobeArmedReminders,
    //   reminders,
    //   upcomingReminders
    // })

    // Group by time of interval 1 minutes
    const groupedReminders: Record<number, Reminder[]> = tobeArmedReminders.reduce(
      (prev: Record<number, Reminder[]>, reminder) => {
        const timeIncludedKey: string | undefined = Object.entries(prev).reduce(
          (prev2: undefined | string, [tkey, gReminders]): undefined | string => {
            const gTime = parseInt(tkey)
            if (isInSameMinute(reminder.time, gTime)) {
              return tkey
            }
            return prev2
          },
          undefined
        )

        if (timeIncludedKey) {
          return {
            ...prev,
            [timeIncludedKey]: [...prev[timeIncludedKey], reminder]
          }
        } else {
          return {
            ...prev,
            [reminder.time]: [reminder]
          }
        }
      },
      {}
    )
    return Object.entries(groupedReminders).map(([time, reminders]) => {
      return {
        reminders,
        time: parseInt(time)
      }
    })
  }

  /*
   * Arm Reminders to send notifications
   * if a reminder is armed => notification timeout is set
   */
  const armReminders = (reminders: Reminder[], time: number) => {
    setupReminders(reminders, time)
  }

  const armMissedReminders = () => {
    const toArmRem = getToArmReminders()
    const now = Date.now()
    const tenSecNow = add(now, { seconds: 5 })
    mog('ReminderArmer: Using the interval', { reminders, toArmRem })
    if (toArmRem.length === 0) {
      armReminders([], tenSecNow.getTime())
    }
  }

  const snoozeControl: SnoozeControl = {
    type: 'snooze',
    action: (reminder: Reminder, time: number) => {
      actOnReminder({ type: 'snooze', value: time }, reminder)
    }
  }
  const pastControls: ReminderControls = [
    {
      type: 'delete',
      action: (reminder: Reminder) => {
        actOnReminder({ type: 'delete' }, reminder)
      }
    },
    snoozeControl
  ]
  const futureControls: ReminderControls = [
    ...pastControls,
    {
      type: 'unarchive',
      action: (reminder: Reminder) => {
        markUndone(reminder)
      }
    }
  ]
  const activeOrSnoozedControls: ReminderControls = [
    {
      type: 'open',
      action: (reminder: Reminder) => {
        actOnReminder({ type: 'open' }, reminder)
      }
    },
    snoozeControl,
    {
      type: 'dismiss',
      action: (reminder: Reminder) => {
        actOnReminder({ type: 'dismiss' }, reminder)
      }
    }
  ]

  const getReminderControls = (reminder: Reminder) => {
    const remState = getReminderState(reminder)
    if (remState === 'active' || remState === 'snooze') {
      return activeOrSnoozedControls
    }
    if (reminder.time > Date.now()) {
      return futureControls
    }
    if (reminder.time < Date.now() && !reminder.state.done) {
      return activeOrSnoozedControls // missed reminders
    }
    return pastControls
  }

  const actOnReminder = (action: ReminderActions, reminder: Reminder) => {
    mog('ReminderArmer: IpcAction.ACTION_REMINDER', { action, reminder })
    switch (action.type) {
      case 'open':
        updateReminderState(reminder, {
          ...reminder.state,
          done: true
        })
        mog('ReminderArmer: IpcAction.ACTION_REMINDER USE OPEN_REMINDER ACTION', { action, reminder })
        // appNotifierWindow(IpcAction.OPEN_REMINDER_IN_MEX, AppType.SPOTLIGHT, { reminder: reminder })
        break
      case 'delete':
        deleteReminder(reminder.id)
        break
      case 'snooze':
        snoozeReminder(reminder, action.value)
        break
      case 'dismiss':
        dismissReminder(reminder)
        break
      case 'todo':
        mog('USE TODO ACTION', { action, reminder })
        switch (action.todoAction) {
          case 'status':
            updateStatusOfTodo(action.value.nodeid, action.value.id, action.value.metadata.status)
            break
          case 'priority':
            updatePriorityOfTodo(action.value.nodeid, action.value.id, action.value.metadata.priority)
            break
          default:
            break
        }
        break
      default:
        break
    }
    // saveData()
  }

  const removeRemindersForBlockid = (blockid: string) => {
    const reminders = useReminderStore.getState().reminders
    const newReminders = reminders.filter((reminder) => reminder.todoid !== blockid)
    useReminderStore.setState({ reminders: newReminders })
  }

  const attachBlockData = (reminder: Reminder): DisplayReminder => {
    const path = getPathFromNodeid(reminder.nodeid)
    const block = reminder.todoid ? getTodo(reminder.nodeid, reminder.todoid) : undefined
    return { ...reminder, path, todo: block }
  }

  /*
   * Setup the timeout to display notification for the reminder
   */
  const setupReminders = (reminders: Reminder[], time: number) => {
    const now = new Date()
    const next24t = add(now, { hours: 24 })
    if (time < now.getTime() || time > next24t.getTime()) {
      console.error(`Time is in the past. Reminder will not be set up.`, { time })
      return
    }

    const toArmRems = reminders.filter((reminder) => {
      if (!toArm(reminder)) {
        console.error(`Reminder does not meet arming conditions. Reminder will not be set up.`, { reminder })
      }
      return toArm(reminder)
    })

    const id = setTimeout(() => {
      const rems: DisplayReminder[] = toArmRems.map(attachBlockData)
      const reminderGroup: ReminderGroup = {
        type: 'reminders',
        label: reminders.length > 1 ? 'Reminders' : 'Reminder',
        reminders: rems
      }

      const missedReminderGroup = {
        type: 'missed',
        label: 'Missed',
        reminders: getMissedReminders()
          .filter((reminder) => {
            return reminderGroup.reminders.find((r) => r.id === reminder.id) === undefined
          })
          .map(attachBlockData)
      }

      const reminderGroups: DisplayReminderGroup[] = []

      if (reminderGroup.reminders.length > 0) {
        reminderGroups.push(reminderGroup)
      }

      if (missedReminderGroup.reminders.length > 0) {
        reminderGroups.push(missedReminderGroup)
      }

      mog('reminderGroups', {
        reminderGroups,
        reminderGroup,
        missedReminderGroup
      })

      if (reminderGroups.length === 0) {
        return
      }
      // Use multiple notifications
      // appNotifierWindow(IpcAction.SHOW_REMINDER, AppType.MEX, {
      //     status: ToastStatus.WARNING,
      //     title: 'Reminders',
      //     description: 'You have reminders to complete',
      //     independent: true,
      //     attachment: reminderGroups
      // })
    }, time - now.getTime())
    toArmRems.forEach((r) => addArmReminder({ reminderId: r.id, timeoutId: id }))
  }

  /*
   * Functions related to rendering
   */
  const getUpcomingReminders = (nodeid: string) => {
    const reminders = useReminderStore.getState().reminders
    const allNodeReminders = reminders.filter((reminder) => reminder.nodeid === nodeid)
    const upcomingReminders = allNodeReminders.filter(upcoming).sort((a, b) => {
      return a.time - b.time
    })
    return upcomingReminders
  }

  const getPastReminders = (nodeid: string) => {
    const reminders = useReminderStore.getState().reminders
    const allNodeReminders = reminders.filter((reminder) => reminder.nodeid === nodeid)
    const pastReminders = allNodeReminders.filter(past).sort((a, b) => {
      return b.time - a.time
    })
    return pastReminders
  }

  const getNodeReminders = (nodeid: string): NodeReminderGroup[] => {
    const upcomingRemindersBase = getUpcomingReminders(nodeid)
    const pastRemindersBase = getPastReminders(nodeid)

    const res = []

    const upcomingReminders = upcomingRemindersBase.filter(
      (reminder) => pastRemindersBase.find((r) => r.id === reminder.id && r.state.done === true) === undefined
    )

    const pastReminders = pastRemindersBase.filter(
      (reminder) => upcomingRemindersBase.find((r) => r.id === reminder.id && r.state.done === false) === undefined
    )

    if (upcomingReminders.length > 0) {
      res.push({
        type: 'upcoming',
        label: 'Upcoming Reminders',
        reminders: upcomingReminders.map(attachBlockData)
      })
    }
    if (pastReminders.length > 0) {
      res.push({
        type: 'past',
        label: 'Past Reminders',
        reminders: pastReminders.map(attachBlockData)
      })
    }

    return res
  }

  const clearAllArmedReminders = () => {
    const armedReminders = useReminderStore.getState().armedReminders
    armedReminders.forEach((reminder) => {
      clearTimeout(reminder.timeoutId)
    })
    clearArmedReminders()
  }

  const clearNodeReminders = (nodeid: string) => {
    // const toDeleteReminders = reminders.filter((reminder) => reminder.nodeid === nodeid)
    deleteAllNode(nodeid).then(() => {
      const newReminders = reminders.filter((reminder) => reminder.nodeid !== nodeid)
      setReminders(newReminders)
    })
  }

  const getRemindersForNextNMinutes = (minutes: number) => {
    const now = new Date()
    const nextMinute = new Date(now.getTime() + minutes * 60000)
    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.time)
      return reminderDate.getTime() > now.getTime() && reminderDate.getTime() < nextMinute.getTime()
    })
  }

  const addReminder = async (reminder: Reminder) => {
    addReminderStore(reminder)
    const res = await saveReminder(reminder)
    console.log('addReminder', { res })
  }

  // const updateRemider

  return {
    reminders,
    addReminder,
    deleteReminder,
    updateReminder,
    clearReminders,
    setReminders,
    // getTodayReminders,
    // getFilteredReminders,
    getNodeReminders,
    getToArmReminders,
    clearNodeReminders,
    armReminders,
    armMissedReminders,
    clearAllArmedReminders,
    actOnReminder,
    markUndone,
    getMissedReminders,
    getBlockReminder,
    removeRemindersForBlockid,
    getReminderControls,
    attachBlockData,
    getRemindersForNextNMinutes
  }
}

export const getReminderAssociatedId = (reminder: Reminder, workspaceId: string): string => {
  switch (reminder.associated) {
    case 'node':
      return reminder.nodeid
    case 'todo':
      return reminder.todoid
    case 'url': {
      const hashedURL = md5(`${workspaceId}${reminder.url}`)
      return hashedURL
    }
    default:
      return reminder.nodeid
  }
}
