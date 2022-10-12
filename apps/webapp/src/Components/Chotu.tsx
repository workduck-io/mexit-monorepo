import React, { useEffect, useState, useMemo } from 'react'

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
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useMentionStore } from '../Stores/useMentionsStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import useThemeStore from '../Stores/useThemeStore'
import { useUserCacheStore } from '../Stores/useUserCacheStore'
import { initSearchIndex, searchWorker } from '../Workers/controller'

export default function Chotu() {
  const [parent, setParent] = useState<any>(null)
  const { userDetails, workspaceDetails } = useAuthStore()
  const theme = useThemeStore((state) => state.theme)
  const snippets = useSnippetStore((store) => store.snippets)
  const reminders = useReminderStore((store) => store.reminders)

  const { ilinks, archive, sharedNodes, tags, publicNodes, namespaces } = useDataStore()
  const { contents, setContent } = useContentStore()
  const actOnReminder = useReminders().actOnReminder
  const { addHighlightedBlock } = useHighlightStore()
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

  const methods = {
    search(key: idxKey | idxKey[], query: string) {
      return new Promise((resolve) => {
        resolve(searchWorker ? queryIndex(key, query) : [])
      })
    },
    addHighlight(nodeid: string, content: NodeEditorContent) {
      addHighlightedBlock(nodeid, content)
      return
    },
    updateContentStore(nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) {
      setContent(nodeid, content, metadata)
      return
    },
    updateSingleILink(nodeid: string, path: string, namespace: string) {
      updateSingleILink(nodeid, path, namespace)
      return
    },
    updateMultipleILinks(linksToBeCreated: ILink[]) {
      updateMultipleILinks(linksToBeCreated)
      return
    },
    reminderAction(action: ReminderActions, reminder: Reminder) {
      actOnReminder(action, reminder)
      return
    }
  }

  useEffect(() => {
    const connection = connectToParent({
      methods
      // debug: true
    })

    connection.promise
      .then((parent) => {
        setParent(parent)
      })
      .catch((error) => {
        mog('ErrorConnectingToParent', error)
      })
  }, [])

  // Couldn't think of a way other than multiple useEffects
  useEffect(() => {
    if (!parent) return

    const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state

    parent.bootAuth(userDetails, workspaceDetails)
    parent.bootDwindle(authAWS)
  }, [parent, userDetails, workspaceDetails])

  useEffect(() => {
    if (!parent) return

    parent.bootIlinks(ilinks)
    parent.bootContents(contents)
    parent.bootNamespaces(namespaces)
  }, [parent, ilinks, contents, namespaces])

  useEffect(() => {
    if (!parent) return

    parent.bootReminders()
  }, [parent, reminders])

  useEffect(() => {
    if (!parent) return

    parent.bootTheme(theme)
  }, [parent, theme])

  useEffect(() => {
    if (!parent) return

    parent.bootSnippets(snippets)
  }, [parent, snippets])

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
