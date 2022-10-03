import React, { useEffect, useState } from 'react'

import { AsyncMethodReturns, connectToParent } from 'penpal'

import {
  AddILinkProps,
  CategoryType,
  idxKey,
  ILink,
  initActions,
  mog,
  NodeEditorContent,
  NodeMetadata,
  Reminder,
  ReminderActions
} from '@mexit/core'

import { useInternalLinks } from '../Hooks/useInternalLinks'
import { useIndexedDBData } from '../Hooks/usePersistentData'
import { useReminders } from '../Hooks/useReminders'
import { useSearch } from '../Hooks/useSearch'
import { useAuthStore } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useMentionStore } from '../Stores/useMentionsStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useShortenerStore } from '../Stores/useShortener'
import { useSnippetStore } from '../Stores/useSnippetStore'
import useThemeStore from '../Stores/useThemeStore'
import { useUserCacheStore } from '../Stores/useUserCacheStore'
import { initSearchIndex, searchWorker } from '../Workers/controller'

export default function Chotu() {
  const [parent, setParent] = useState<AsyncMethodReturns<any>>(null)
  const { userDetails, workspaceDetails } = useAuthStore()
  // const linkCaptures = useShortenerStore((state) => state.linkCaptures)
  const theme = useThemeStore((state) => state.theme)
  // TODO: this is stupid, it would never know if auth changes
  const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state
  const snippets = useSnippetStore((store) => store.snippets)
  const reminders = useReminderStore((store) => store.reminders)

  const { ilinks, archive, sharedNodes, tags, publicNodes } = useDataStore()
  const { contents, setContent } = useContentStore()
  const actOnReminder = useReminders().actOnReminder
  const [first, setFirst] = useState(true)
  const { updateSingleILink, updateMultipleILinks } = useInternalLinks()
  const { cache } = useUserCacheStore()
  const { mentionable, invitedUsers } = useMentionStore()

  useEffect(() => {
    if (!first) {
      initSearchIndex({ ilinks, archive, contents, snippets, sharedNodes })
    } else {
      setFirst(false)
    }
  }, [ilinks, archive, contents, snippets])

  const { queryIndex } = useSearch()

  const connection = connectToParent({
    methods: {
      search(key: idxKey | idxKey[], query: string) {
        const res = searchWorker ? queryIndex(key, query) : []
        return res
      },
      updateContentStore(props: { nodeid: string; content: NodeEditorContent; metadata?: NodeMetadata }) {
        setContent(props.nodeid, props.content, props?.metadata)
        return
      },
      updateSingleILink(props: { nodeid: string; path: string; namespace: string }) {
        updateSingleILink(props.nodeid, props.path, props.namespace)
        return
      },
      updateMultipleILinks(props: { linksToBeCreated: ILink[] }) {
        updateMultipleILinks(props.linksToBeCreated)
        return
      },
      reminderAction(props: { action: ReminderActions; reminder: Reminder }) {
        actOnReminder(props.action, props.reminder)
        return
      }
    }
    // debug: true
  })

  useEffect(() => {
    if (connection) {
      connection.promise
        .then((parent: any) => {
          parent.init(
            userDetails,
            workspaceDetails,
            theme,
            authAWS,
            snippets,
            contents,
            ilinks,
            reminders,
            publicNodes,
            sharedNodes,
            tags,
            cache,
            mentionable,
            invitedUsers
          )
        })
        .catch((error) => {
          console.error(error)
        })

      return () => {
        connection.destroy()
      }
    }
  }, [
    userDetails,
    workspaceDetails,
    theme,
    authAWS,
    snippets,
    contents,
    ilinks,
    reminders,
    publicNodes,
    sharedNodes,
    tags,
    cache,
    connection
  ])

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
