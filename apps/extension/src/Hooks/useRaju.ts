import { useEffect } from 'react'

import { addMinutes } from 'date-fns'
import { connectToChild, Methods } from 'penpal'

import { useAuthStore as useDwindleAuthStore } from '@workduck-io/dwindle'

import {
  Contents,
  idxKey,
  ILink,
  MEXIT_FRONTEND_URL_BASE,
  mog,
  NodeEditorContent,
  NodeMetadata,
  Reminder,
  ReminderActions,
  SharedNode,
  SingleNamespace,
  Snippet,
  UserDetails,
  WorkspaceDetails,
  Link,
  Description,
  Highlighted
} from '@mexit/core'
import { Theme } from '@mexit/shared'

import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { getElementById, styleSlot } from '../contentScript'
import { useAuthStore } from './useAuth'
import useInternalAuthStore from './useAuthStore'
import { useReminders } from './useReminders'
import { useSnippets } from './useSnippets'
import useThemeStore from './useThemeStore'

export interface ParentMethods {
  SEARCH: (key: idxKey | idxKey[], query: string) => Promise<any>
  SET_CONTENT: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  ADD_SINGLE_ILINK: (nodeid: string, path: string, namespace: string) => void
  ADD_MULTIPLE_ILINKS: (linksToBeCreated: ILink[]) => void
  ADD_RECENT_NODE: (nodeId: string) => void
  ACT_ON_REMINDER: (action: ReminderActions, reminder: Reminder) => void
  ADD_HIGHLIGHTED_BLOCK: (nodeid: string, content: NodeEditorContent) => void
  UPLOAD_IMAGE_TO_S3: (base64string: string) => Promise<string>
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
  const setChild = useSputlitStore((s) => s.setChild)
  const setTheme = useThemeStore((store) => store.setTheme)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setInternalAuthStore = useInternalAuthStore((store) => store.setAllStore)
  const setUserPool = useDwindleAuthStore((store) => store.setUserPool)
  const setUserCred = useDwindleAuthStore((store) => store.setUserCred)
  const initContents = useContentStore((store) => store.initContents)
  const setIlinks = useDataStore((store) => store.setIlinks)
  const setNamespaces = useDataStore((store) => store.setNamespaces)
  const setPublicNodes = useDataStore((store) => store.setPublicNodes)
  const setSharedNodes = useDataStore((store) => store.setSharedNodes)
  const setRecents = useRecentsStore((s) => s.initRecents)
  const { updateSnippets } = useSnippets()
  const { setReminders, reminders } = useReminderStore()
  const { actOnReminder } = useReminders()
  const setLinks = useLinkStore((store) => store.setLinks)
  const initDescriptions = useDescriptionStore((state) => state.initDescriptions)
  const setHighlights = useHighlightStore((store) => store.setHighlights)

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
    bootDwindle(authAWS: { userPool; userCred }) {
      setInternalAuthStore(authAWS)
    },
    bootRecents(recents: Array<string>) {
      setRecents(recents)
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
    },
    bootLinks(links: Link[]) {
      setLinks(links)
    },
    bootDescriptions(descriptions: Description) {
      initDescriptions(descriptions)
    },
    bootHighlights(highlights: Highlighted) {
      setHighlights(highlights)
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
          mog('setting content')
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
    const child = useSputlitStore.getState().child

    switch (type) {
      case 'SET_CONTENT':
        return child.updateContentStore(...params)
      case 'ADD_SINGLE_ILINK':
        return child.updateSingleILink(...params)
      case 'ADD_MULTIPLE_ILINKS':
        return child.updateMultipleILinks(...params)
      case 'ADD_RECENT_NODE':
        return child.addRecentNode(...params)
      case 'ACT_ON_REMINDER':
        return child.reminderAction(...params)
      case 'ADD_HIGHLIGHTED_BLOCK':
        return child.addHighlighted(...params)
      case 'SEARCH':
        return child.search(...params).then((result) => {
          return result
        })
      case 'UPLOAD_IMAGE_TO_S3': {
        return child.uploadImageToS3Dwindle(...params).then((result) => {
          mog('UploadImageToS3', { result })
          return result
        })
      }
    }
  }

  return {
    methods,
    dispatch
  }
}
