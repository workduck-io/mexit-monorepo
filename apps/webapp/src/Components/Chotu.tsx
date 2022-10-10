import React, { useEffect, useState } from 'react'

import { connect } from 'http2'
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
  const { userDetails, workspaceDetails } = useAuthStore()
  // const linkCaptures = useShortenerStore((state) => state.linkCaptures)
  const theme = useThemeStore((state) => state.theme)
  // TODO: this is stupid, it would never know if auth changes
  const snippets = useSnippetStore((store) => store.snippets)
  const reminders = useReminderStore((store) => store.reminders)

  const { ilinks, archive, sharedNodes, tags, publicNodes, namespaces } = useDataStore()
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
        console.log('params', key, query)
        const res = searchWorker ? queryIndex(key, query) : []
        return res
      },
      updateContentStore(nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) {
        setContent(nodeid, content, metadata)
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
    connection.promise
      .then((parent: any) => {
        const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state

        parent.bootAuth(userDetails, workspaceDetails)
        parent.bootDwindle(authAWS)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => connection.destroy()
  }, [userDetails, workspaceDetails])

  useEffect(() => {
    connection.promise
      .then((parent: any) => {
        parent.bootIlinks(ilinks)
        parent.bootContents(contents)
        parent.bootNamespaces(namespaces)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => connection.destroy()
  }, [ilinks, contents, namespaces])

  useEffect(() => {
    connection.promise
      .then((parent: any) => {
        parent.bootTheme(theme)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => connection.destroy()
  }, [theme])

  useEffect(() => {
    connection.promise
      .then((parent: any) => {
        parent.bootReminders()
      })
      .catch((error) => {
        console.error(error)
      })

    return () => connection.destroy()
  }, [reminders])

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
