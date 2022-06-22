import React, { useEffect, useState } from 'react'
import {
  AddILinkProps,
  CategoryType,
  idxKey,
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

export default function Chotu() {
  const [parent, setParent] = useState<AsyncMethodReturns<any>>(null)
  const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  // const linkCaptures = useShortenerStore((state) => state.linkCaptures)
  const theme = useThemeStore((state) => state.theme)
  const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state
  const snippets = useSnippetStore((store) => store.snippets)
  const reminders = useReminderStore((store) => store.reminders)

  const { ilinks, archive, addILink } = useDataStore()
  const { contents, setContent } = useContentStore()
  const actOnReminder = useReminders().actOnReminder
  const [first, setFirst] = useState(true)

  useEffect(() => {
    if (!first) {
      initSearchIndex({ ilinks, archive, contents, snippets })
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
      updateContentStore(props: { nodeid: string; content: NodeEditorContent; metadata: NodeMetadata }) {
        setContent(props.nodeid, props.content, props.metadata)
        return
      },
      updateIlinks(props: AddILinkProps) {
        addILink(props)
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
        parent.init(userDetails, workspaceDetails, theme, authAWS, snippets, contents, ilinks, reminders)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      connection.destroy()
    }
  }, [userDetails, workspaceDetails, theme, authAWS, snippets, contents, ilinks, reminders])

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
