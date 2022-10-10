import { useEffect, useMemo, useState } from 'react'

import { addMinutes } from 'date-fns'
import { AsyncMethodReturns, connectToChild, Methods } from 'penpal'
import toast from 'react-hot-toast'

import {
  AddILinkProps,
  CacheUser,
  Contents,
  idxKey,
  ILink,
  InvitedUser,
  Mentionable,
  MEXIT_FRONTEND_URL_BASE,
  mog,
  NodeEditorContent,
  NodeMetadata,
  Reminder,
  ReminderActions,
  SharedNode,
  SingleNamespace,
  Snippet,
  Tag,
  UserDetails,
  WorkspaceDetails
} from '@mexit/core'
import { Theme } from '@mexit/shared'

import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useMentionStore } from '../Stores/useMentionsStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useUserCacheStore } from '../Stores/useUserCacheStore'
import { getElementById, styleSlot } from '../contentScript'
import { useAuthStore } from './useAuth'
import useInternalAuthStore from './useAuthStore'
import { useReminders } from './useReminders'
import { useSnippets } from './useSnippets'
import useThemeStore from './useThemeStore'

export interface ParentMethods {
  // Custom events is not a good option when we want to receive a response,
  // I may have to go with postmessage or broadcast channel for this,
  // TODO: implement the above and then we can move useSearch away from chotu
  SEARCH: (key: idxKey | idxKey[], query: string) => Promise<any>
  SET_CONTENT: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  ADD_SINGLE_ILINK: (nodeid: string, path: string, namespace: string) => void
  ADD_MULTIPLE_ILINKS: (linksToBeCreated: ILink[]) => void
  ACT_ON_REMINDER: (action: ReminderActions, reminder: Reminder) => void
}

// Ref: https://stackoverflow.com/a/53039092/13011527
type ArgumentsType<T extends (...args: any[]) => any> = T extends (...args: infer A) => any ? A : never

// Raju is great with doing Hera Pheri
// He doesn't carry out things on his own, but tells people what to do and when
// e.g. watch his scene when negotiating with taxi driver and construction worker to understand what useRaju does
export default function useRaju() {
  const [iframe, setIframe] = useState<HTMLIFrameElement>(null)
  const setTheme = useThemeStore((store) => store.setTheme)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setInternalAuthStore = useInternalAuthStore((store) => store.setAllStore)
  const initContents = useContentStore((store) => store.initContents)
  const setIlinks = useDataStore((store) => store.setIlinks)
  const setNamespaces = useDataStore((store) => store.setNamespaces)
  const setPublicNodes = useDataStore((store) => store.setPublicNodes)
  const setSharedNodes = useDataStore((store) => store.setSharedNodes)
  const setTags = useDataStore((store) => store.setTags)
  const { updateSnippets } = useSnippets()
  const { setReminders, reminders } = useReminderStore()
  const { actOnReminder } = useReminders()
  const { initHighlights } = useHighlightStore()
  const { setCache } = useUserCacheStore()
  const initMentionData = useMentionStore((store) => store.initMentionData)

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === 'RAJU') {
        console.log('actOnReminders', reminders, message, addMinutes(Date.now(), 15).getTime())
        const mentionedReminder = reminders.find((item) => item.id === message.notificationId)
        switch (message.action) {
          case 'OPEN':
            actOnReminder({ type: 'open' }, mentionedReminder)
            dispatch('ACT_ON_REMINDER', { type: 'open' }, mentionedReminder)
            break
          case 'SNOOZE':
            actOnReminder({ type: 'snooze', value: addMinutes(Date.now(), 15).getTime() }, mentionedReminder)
            dispatch(
              'ACT_ON_REMINDER',
              { type: 'snooze', value: addMinutes(Date.now(), 15).getTime() },
              mentionedReminder
            )
            break
          case 'DISMISS':
            actOnReminder({ type: 'dismiss' }, mentionedReminder)
            dispatch('ACT_ON_REMINDER', { type: 'dismiss' }, mentionedReminder)
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
    bootAuth(userDetails: UserDetails, workspaceDetails: WorkspaceDetails) {
      setAuthenticated(userDetails, workspaceDetails)
    },
    bootTheme(theme: Theme) {
      setTheme(theme)
    },
    bootDwindle(authAWS: any) {
      setInternalAuthStore(authAWS)
    },
    bootIlinks(ilinks: ILink[]) {
      setIlinks(ilinks)
    },
    bootNamespaces(namespaces: SingleNamespace[]) {
      setNamespaces(namespaces)
    },
    bootReminders(reminders: Reminder[]) {
      setReminders(reminders)
    },
    bootContents(contents: Contents) {
      initContents(contents)
    },
    bootPublicNodes(publicNodes: any[]) {
      setPublicNodes(publicNodes)
    },
    bootSharedNodes(sharedNodes: SharedNode[]) {
      setSharedNodes(sharedNodes)
    }
  }

  useEffect(() => {
    const iframe = document.createElement('iframe')
    iframe.src = `${MEXIT_FRONTEND_URL_BASE}/chotu`
    const IFRAME_ID = 'something-nothing'
    iframe.id = IFRAME_ID

    if (!getElementById(IFRAME_ID)) {
      styleSlot.appendChild(iframe)
    }

    const handleIframeLoad = () => {
      console.log('loaded', getElementById(IFRAME_ID))
      setIframe(getElementById(IFRAME_ID) as HTMLIFrameElement)
    }

    iframe.addEventListener('load', handleIframeLoad)

    return () => iframe.removeEventListener('load', handleIframeLoad)
  }, [])

  const connection = useMemo(() => {
    if (!iframe) return

    return connectToChild({
      iframe,
      methods,
      debug: true
    })
  }, [iframe])

  const init = () => {
    console.log('calling initi', iframe)
    connection.promise
      .then((child: any) => {
        child.log('Hi there')
      })
      .catch((error) => {
        mog('ErrorWithInitConection', error)
      })
  }

  const dispatch = <K extends keyof ParentMethods>(
    type: K,
    ...params: ArgumentsType<ParentMethods[K]>
  ): ReturnType<ParentMethods[K]> => {
    console.log('calling dispatch', iframe)

    const result = connection.promise.then((child: any) => {
      switch (type) {
        case 'SET_CONTENT':
          return child.updateContentStore(params)
        case 'ADD_SINGLE_ILINK':
          return child.updateSingleILink(params)
        case 'ADD_MULTIPLE_ILINKS':
          return child.updateMultipleILinks(params)
        case 'ACT_ON_REMINDER':
          return child.reminderAction(params)
        case 'SEARCH':
          console.log('params', params)
          return child.search(params).then((result) => {
            console.log('result', result)
            return result
          })
      }
    })

    connection.destroy()
    return result as ReturnType<ParentMethods[K]>
  }

  return {
    iframe,
    methods,
    init,
    dispatch
  }
}
