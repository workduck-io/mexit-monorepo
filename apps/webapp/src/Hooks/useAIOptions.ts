import { toast } from 'react-hot-toast'

import { AIEvent, API, SupportedAIEventTypes, useHistoryStore } from '@mexit/core'

export const useAIOptions = () => {
  const addInAIEventsHistory = useHistoryStore((store) => store.addInAIHistory)

  const performAIAction = async (type: SupportedAIEventTypes, content?: string): Promise<void> => {
    const aiEventsHistory = useHistoryStore.getState().ai
    const userQuery: AIEvent = {
      role: 'user',
      type
    }

    if (content) {
      userQuery.content = content
    }

    const reqData = {
      context: [...aiEventsHistory.flat().filter((item) => item), userQuery]
    }

    try {
      const assistantResponse = await API.ai.perform(reqData)

      if (assistantResponse?.content) {
        addInAIEventsHistory(userQuery, assistantResponse)
      }
    } catch (err) {
      // * Write cute error message
      toast('Something went wrong!')
      console.error('Unable to perform AI action', err)
    }
  }

  return {
    performAIAction
  }
}
