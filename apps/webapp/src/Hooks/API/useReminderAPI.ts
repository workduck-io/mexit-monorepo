import { apiURLs, Reminder } from '@mexit/core'
import { client } from '@workduck-io/dwindle'
import { getReminderAssociatedId } from '../useReminders'
import { useAPIHeaders } from './useAPIHeaders'

export const useReminderAPI = () => {
  const { workspaceHeaders, workspaceId } = useAPIHeaders()

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

  const saveReminder = async (reminder: Reminder) => {
    const workspaceIdStr = workspaceId()
    const reqData = {
      workspaceId: workspaceIdStr,
      // This is entity id
      nodeid: getReminderAssociatedId(reminder, workspaceIdStr),
      properties: {
        title: reminder.title,
        description: reminder.description,

        associated: reminder.associated,

        time: reminder.time,
        state: reminder.state,

        createdAt: reminder.createdAt,
        updatedAt: reminder.updatedAt,

        // AssociatedData
        nodeid: reminder.nodeid,
        todoid: reminder.todoid,
        url: reminder.url,

        // is not supported by implementation
        priority: reminder.priority,
        frequency: reminder.frequency
      }
    }
    const res = await client.post(apiURLs.reminders.base, reqData, {
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
    saveReminder,
    deleteReminder,
    deleteAllNode
  }
}
