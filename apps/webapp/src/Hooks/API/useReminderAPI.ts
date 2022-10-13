import { apiURLs, Reminder } from '@mexit/core'
import { client } from '@workduck-io/dwindle'
import { useAPIHeaders } from './useAPIHeaders'

export const useReminderAPI = () => {
  const { workspaceHeaders } = useAPIHeaders()

  const getReminder = async (id: string) => {
    const res = await client.get(apiURLs.reminders.byId(id), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getAllWorkspaceReminders = async () => {
    const res = await client.get(apiURLs.reminders.allWorkspace, {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getAllNodeReminders = async (nodeId: string) => {
    const res = await client.get(apiURLs.reminders.allNode(nodeId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const createReminder = async (reminder: Reminder) => {
    const res = await client.post(apiURLs.reminders.base, reminder, {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const updateReminder = async (reminder: Reminder) => {
    const res = await client.put(apiURLs.reminders.base, reminder, {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteReminder = async (id: string) => {
    const res = await client.delete(apiURLs.reminders.byId(id), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteAllNode = async (nodeId: string) => {
    const res = await client.delete(apiURLs.reminders.allNode(nodeId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  return {
    getReminder,
    getAllWorkspaceReminders,
    getAllNodeReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    deleteAllNode
  }
}
