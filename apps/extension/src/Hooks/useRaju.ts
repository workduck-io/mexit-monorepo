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
import { useSputlitContext } from './useSputlitContext'
import useThemeStore from './useThemeStore'

export interface ParentMethods {
  SEARCH: (key: idxKey | idxKey[], query: string) => Promise<any>
  SET_CONTENT: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  ADD_SINGLE_ILINK: (nodeid: string, path: string, namespace: string) => void
  ADD_MULTIPLE_ILINKS: (linksToBeCreated: ILink[]) => void
  ACT_ON_REMINDER: (action: ReminderActions, reminder: Reminder) => void
  ADD_HIGHLIGHTED_BLOCK: (nodeid: string, content: NodeEditorContent) => void
}

const IFRAME_ID = 'something-nothing'

// Ref: https://stackoverflow.com/a/53039092/13011527
type ArgumentsType<T extends (...args: any[]) => any> = T extends (...args: infer A) => any ? A : never

// Raju is great with doing Hera Pheri
// He doesn't carry out things on his own, but tells people what to do and when
// e.g. watch his scene when negotiating with taxi driver and construction worker to understand what useRaju does
export default function useRaju() {
  // For some reason, using useState wasn't making dispatch() make use of the new variable
  // So added in the context for now
  const { child, setChild } = useSputlitContext()

  const setTheme = useThemeStore((store) => store.setTheme)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setInternalAuthStore = useInternalAuthStore((store) => store.setAllStore)
  const initContents = useContentStore((store) => store.initContents)
  const setIlinks = useDataStore((store) => store.setIlinks)
  const setNamespaces = useDataStore((store) => store.setNamespaces)
  const setPublicNodes = useDataStore((store) => store.setPublicNodes)
  const setSharedNodes = useDataStore((store) => store.setSharedNodes)
  const { updateSnippets } = useSnippets()
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
    bootSnippets(snippets: Snippet[]) {
      updateSnippets(snippets)
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
    iframe.id = IFRAME_ID

    if (!getElementById(IFRAME_ID)) {
      styleSlot.appendChild(iframe)
    }
    const connection = connectToChild({
      iframe,
      methods
      // debug: true
    })

    const handleIframeLoad = () => {
      connection.promise
        .then((child: any) => {
          setChild(child)
        })
        .catch((error) => {
          mog('ErrorConnectingToChild', error)
        })
    }

    iframe.addEventListener('load', handleIframeLoad)

    return () => iframe.removeEventListener('load', handleIframeLoad)
  }, [])

  const dispatch = <K extends keyof ParentMethods>(
    type: K,
    ...params: ArgumentsType<ParentMethods[K]>
  ): ReturnType<ParentMethods[K]> => {
    switch (type) {
      case 'SET_CONTENT':
        return child.updateContentStore(...params)
      case 'ADD_SINGLE_ILINK':
        return child.updateSingleILink(...params)
      case 'ADD_MULTIPLE_ILINKS':
        return child.updateMultipleILinks(...params)
      case 'ACT_ON_REMINDER':
        return child.reminderAction(...params)
      case 'ADD_HIGHLIGHTED_BLOCK':
        return child.addHighlighted(...params)
      case 'SEARCH':
        const res = child.search(...params).then((result) => {
          return result
        })

        return res
    }
  }

  return {
    methods,
    dispatch
  }
}
