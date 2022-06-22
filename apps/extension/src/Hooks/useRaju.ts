import {
  AddILinkProps,
  Contents,
  idxKey,
  ILink,
  mog,
  NodeEditorContent,
  NodeMetadata,
  Reminder,
  ReminderActions,
  Snippet,
  UserDetails,
  WorkspaceDetails
} from '@mexit/core'
import { Theme } from '@mexit/shared'
import { AsyncMethodReturns, Methods } from 'penpal'
import { useEffect } from 'react'
import { addMinutes } from 'date-fns'
import toast from 'react-hot-toast'
import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useAuthStore } from './useAuth'
import useInternalAuthStore from './useAuthStore'
import { useReminders } from './useReminders'
import useThemeStore from './useThemeStore'

interface ParentMethods {
  // Custom events is not a good option when we want to receive a response,
  // I may have to go with postmessage or broadcast channel for this,
  // TODO: implement the above and then we can move useSearch away from chotu
  // ['SEARCH']: (key: idxKey | idxKey[], query: string) => Promise<any>
  ['SET_CONTENT']: [props: { nodeid: string; content: NodeEditorContent; metadata: NodeMetadata }]
  ['ADD_ILINK']: [props: AddILinkProps]
  ['ACT_ON_REMINDER']: [props: { action: ReminderActions; reminder: Reminder }]
}

// Raju is great with doing Hera Pheri
// He doesn't carry out things on his own, but tells people what to do and when
// e.g. watch his scene when negotiating with taxi driver and construction worker to understand what useRaju does
export default function useRaju() {
  const setTheme = useThemeStore((store) => store.setTheme)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setInternalAuthStore = useInternalAuthStore((store) => store.setAllStore)
  const initContents = useContentStore((store) => store.initContents)
  const setIlinks = useDataStore((store) => store.setIlinks)
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const { setReminders, reminders } = useReminderStore()
  const { actOnReminder } = useReminders()

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === 'RAJU') {
        console.log('actOnReminders', reminders, message, addMinutes(Date.now(), 15).getTime())
        const mentionedReminder = reminders.find((item) => item.id === message.notificationId)
        switch (message.action) {
          case 'OPEN':
            actOnReminder({ type: 'open' }, mentionedReminder)
            dispatch('ACT_ON_REMINDER', { action: { type: 'open' }, reminder: mentionedReminder })
            break
          case 'SNOOZE':
            actOnReminder({ type: 'snooze', value: addMinutes(Date.now(), 15).getTime() }, mentionedReminder)
            dispatch('ACT_ON_REMINDER', {
              action: { type: 'snooze', value: addMinutes(Date.now(), 15).getTime() },
              reminder: mentionedReminder
            })
            break
          case 'DISMISS':
            actOnReminder({ type: 'dismiss' }, mentionedReminder)
            dispatch('ACT_ON_REMINDER', { action: { type: 'dismiss' }, reminder: mentionedReminder })
            break
        }
      }

      return
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [reminders])

  const methods: Methods = {
    init(
      userDetails: UserDetails,
      workspaceDetails: WorkspaceDetails,
      theme: Theme,
      authAWS: any,
      snippets: Snippet[],
      contents: Contents,
      ilinks: any[],
      reminders: Reminder[]
    ) {
      setAuthenticated(userDetails, workspaceDetails)
      setTheme(theme)
      setInternalAuthStore(authAWS)
      initSnippets(snippets)
      setIlinks(ilinks)
      initContents(contents)
      setReminders(reminders)
    },
    success(message: string) {
      toast.success(message)
    },
    error(message: string) {
      toast.error(message)
    }
  }

  const dispatch = <K extends keyof ParentMethods>(type: K, ...params: ParentMethods[K]) => {
    let event = new CustomEvent('raju', { detail: { type, ...params } })

    window.dispatchEvent(event)
  }

  return {
    methods,
    dispatch
  }
}
