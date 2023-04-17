import { toast } from 'react-hot-toast'

import Highlighter from 'web-highlighter'

import {
  AIEvent,
  API,
  FloatingElementType,
  getMenuItem,
  getMIcon,
  isExtension,
  SupportedAIEventTypes,
  useAuthStore,
  useFloatingStore,
  useHistoryStore
} from '@mexit/core'

import { DefaultMIcons } from '../Components/Icons'

export const useAIOptions = () => {
  const addAIEvent = useHistoryStore((store) => store.addInitialEvent)
  const addInAIEventsHistory = useHistoryStore((store) => store.addInAIHistory)
  const setFloatingElement = useFloatingStore((store) => store.setFloatingElement)

  const handleOpenAIPreview = (content: string) => {
    const selection = window.getSelection()

    if (content) {
      addAIEvent({ role: 'assistant', content })
    }

    const highlight = new Highlighter({
      style: {
        className: 'highlight'
      }
    })

    const range = selection.getRangeAt(0)
    highlight.fromRange(range)

    setFloatingElement(FloatingElementType.AI_POPOVER, {
      range
    })
  }

  // * AI functions
  const handleAIQuery = async (type: SupportedAIEventTypes, callback: any) => {
    performAIAction(type).then((res) => {
      callback(res)
    })
  }

  const getAIMenuItems = () => {
    return [
      getMenuItem(
        'Continue',
        (c) => handleAIQuery(SupportedAIEventTypes.EXPAND, c),
        false,
        getMIcon('ICON', 'system-uicons:write')
      ),
      getMenuItem(
        'Explain',
        (c) => handleAIQuery(SupportedAIEventTypes.EXPLAIN, c),
        false,
        getMIcon('ICON', 'ri:question-line')
      ),
      getMenuItem('Summarize', (c) => handleAIQuery(SupportedAIEventTypes.SUMMARIZE, c), false, DefaultMIcons.AI),
      getMenuItem(
        'Actionable',
        (c) => handleAIQuery(SupportedAIEventTypes.ACTIONABLE, c),
        false,
        getMIcon('ICON', 'ic:round-view-list')
      )
    ]
  }

  const aiRequestHandler = async (reqData: Record<string, any>, onSuccess: (res) => void) => {
    const inExtension = isExtension()
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (inExtension) {
      const res = await chrome.runtime.sendMessage({ type: 'PERFORM_AI_ACTION', data: reqData, workspaceId })
      onSuccess(res)
    } else {
      const res = await API.ai.perform(reqData)
      onSuccess(res)
    }
  }

  const getUserQuery = (type: SupportedAIEventTypes, content?: string) => {
    const aiEventsHistory = useHistoryStore.getState().ai
    const userQuery: AIEvent = {
      role: 'user',
      type
    }

    if (content) {
      userQuery.content = content
    }

    const context = [...aiEventsHistory.flat().filter((item) => item), userQuery]

    return {
      userQuery,
      context
    }
  }

  const performAIAction = async (type: SupportedAIEventTypes, content?: string): Promise<void> => {
    const { context, userQuery } = getUserQuery(type, content)

    try {
      await aiRequestHandler({ context }, (res) => {
        if (res?.content) {
          addInAIEventsHistory(userQuery, res)
        }
      })
    } catch (err) {
      // * Write cute error message
      toast('Something went wrong!')
      console.error('Unable to perform AI action', err)
    }
  }

  return {
    performAIAction,
    handleOpenAIPreview,
    getAIMenuItems
  }
}
