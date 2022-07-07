import React, { useEffect, useState } from 'react'
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
import { AsyncMethodReturns, connectToParent } from 'penpal'
import { useSearch } from '../Hooks/useSearch'
import { useAuthStore } from '../Stores/useAuth'
import { useIndexedDBData } from '../Hooks/usePersistentData'
import { useShortenerStore } from '../Stores/useShortener'
import useThemeStore from '../Stores/useThemeStore'
import { initSearchIndex, searchWorker } from '../Workers/controller'

import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useReminders } from '../Hooks/useReminders'
import { useInternalLinks } from '../Hooks/useInternalLinks'

export default function Chotu() {
  const [parent, setParent] = useState<AsyncMethodReturns<any>>(null)
  const { userDetails, workspaceDetails } = useAuthStore()
  // const linkCaptures = useShortenerStore((state) => state.linkCaptures)
  const theme = useThemeStore((state) => state.theme)
  // TODO: this is stupid, it would never know if auth changes
  const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state
  const snippets = useSnippetStore((store) => store.snippets)
  const reminders = useReminderStore((store) => store.reminders)
  const publicNodes = useDataStore((store) => store.publicNodes)

  const { ilinks, archive, sharedNodes } = useDataStore()
  const { contents, setContent } = useContentStore()
  const actOnReminder = useReminders().actOnReminder
  const [first, setFirst] = useState(true)
  const { updateSingleILink, updateMultipleILinks } = useInternalLinks()

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
      updateSingleILink(props: { nodeid: string; path: string }) {
        updateSingleILink(props.nodeid, props.path)
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
          parent.init(userDetails, workspaceDetails, theme, authAWS, snippets, contents, ilinks, reminders, publicNodes)
        })
        .catch((error) => {
          console.error(error)
        })

      return () => {
        connection.destroy()
      }
    }
  }, [userDetails, workspaceDetails, theme, authAWS, snippets, contents, ilinks, reminders, publicNodes, connection])

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
