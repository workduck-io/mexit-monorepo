import { API, Reminder } from '@mexit/core'

import { getReminderAssociatedId } from '../useReminders'
import { useAPIHeaders } from './useAPIHeaders'

export const useReminderAPI = () => {
  const { workspaceId } = useAPIHeaders()

  const getReminder = async (id: string) => {
    const res = await API.reminder.get(id)
    return res
  }

  const getAllWorkspaceReminders = async () => {
    const res = await API.reminder.getAllOfWorkspace()
    return res
  }

  const getAllNodeReminders = async (nodeId: string) => {
    const res = await API.reminder.getAllOfNode(nodeId)
    return res
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

    const res = await API.reminder.save(reqData)
    return res
  }

  const deleteReminder = async (id: string) => {
    const res = await API.reminder.delete(id)
    return res
  }

  const deleteAllNode = async (nodeId: string) => {
    const res = await API.reminder.deleteAllOfNode(nodeId)
    return res
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
