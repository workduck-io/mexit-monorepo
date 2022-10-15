import { client } from '@workduck-io/dwindle'

import { apiURLs, mog, Reminder } from '@mexit/core'

import { getReminderAssociatedId } from '../useReminders'
import { useAPIHeaders } from './useAPIHeaders'

export const useReminderAPI = () => {
  const { workspaceHeaders, workspaceId } = useAPIHeaders()

  const getReminder = async (id: string) => {
    const res = await client.get(apiURLs.reminders.reminderByID(id), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getAllWorkspaceReminders = async () => {
    const res = await client.get(apiURLs.reminders.remindersOfWorkspace, {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getAllNodeReminders = async (nodeId: string) => {
    const res = await client.get(apiURLs.reminders.remindersOfNode(nodeId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const saveReminder = async (reminder: Reminder) => {
    const workspaceIdStr = workspaceId()
    const reqData = {
      workspaceId: workspaceIdStr,
      // This is entity id
      nodeId: getReminderAssociatedId(reminder, workspaceIdStr),
      entityId: reminder.id,
      properties: reminder
    }

    // mog('Saving reminder', { reminder, reqData })

    const res = await client.post(apiURLs.reminders.saveReminder, reqData, {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteReminder = async (id: string) => {
    const res = await client.delete(apiURLs.reminders.reminderByID(id), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteAllNode = async (nodeId: string) => {
    const res = await client.delete(apiURLs.reminders.remindersOfNode(nodeId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  return {
    getReminder,
    getAllWorkspaceReminders,
    getAllNodeReminders,
    saveReminder,
    deleteReminder,
    deleteAllNode
  }
}
