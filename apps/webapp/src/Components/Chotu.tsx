import React, { useEffect, useState } from 'react'

import { connectToParent } from 'penpal'

import { useAuth } from '@workduck-io/dwindle'

import {
  AddHighlightFn,
  idxKey,
  ILink,
  mog,
  NodeEditorContent,
  NodeMetadata,
  Reminder,
  ReminderActions
} from '@mexit/core'

import { useInternalLinks } from '../Hooks/useInternalLinks'
import { useReminders } from '../Hooks/useReminders'
import { useSearch } from '../Hooks/useSearch'
import { useAuthStore } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useHighlightStore2 } from '../Stores/useHighlightStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { initSearchIndex, searchWorker } from '../Workers/controller'

export default function Chotu() {
  const [parent, setParent] = useState<any>(null)
  const { userDetails, workspaceDetails } = useAuthStore()
  const theme = useUserPreferenceStore((store) => store.theme)
  const snippets = useSnippetStore((store) => store.snippets)
  const reminders = useReminderStore((store) => store.reminders)
  const descriptions = useDescriptionStore((store) => store.descriptions)

  const {
    ilinks,
    archive,
    sharedNodes,
    tags,
    publicNodes,
    namespaces,
    _hasHydrated: _areIlinksHydrated
  } = useDataStore()
  const { contents, setContent, _hasHydrated: _isContentHydrated } = useContentStore()
  const recents = useRecentsStore((s) => s.lastOpened)
  const addNodeInRecents = useRecentsStore((s) => s.addRecent)
  const actOnReminder = useReminders().actOnReminder
  const addHighlight = useHighlightStore2((s) => s.addHighlight)
  const [first, setFirst] = useState(true)
  const { updateSingleILink, updateMultipleILinks } = useInternalLinks()
  const links = useLinkStore((state) => state.links)
  const { queryIndex } = useSearch()
  const { uploadImageToS3 } = useAuth()

  useEffect(() => {
    if (!first) {
      initSearchIndex({ ilinks, archive, contents, snippets, sharedNodes })
    } else {
      setFirst(false)
    }
  }, [ilinks, archive, contents, snippets])

  const methods = {
    search(key: idxKey | idxKey[], query: string) {
      return new Promise((resolve) => {
        resolve(searchWorker ? queryIndex(key, query) : [])
      })
    },
    addHighlight: ((...params) => {
      addHighlight(...params)
      return
    }) as AddHighlightFn,
    addRecentNode(nodeid: string) {
      addNodeInRecents(nodeid)
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
    },
    uploadImageToS3Dwindle(base64string: string) {
      return new Promise<string>((resolve, reject) => {
        try {
          const val = uploadImageToS3(base64string, { giveCloudFrontURL: true, parseBase64String: true })
          resolve(val)
        } catch (error) {
          reject(error)
        }
      })
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

    if (_isContentHydrated && _areIlinksHydrated) {
      parent.bootIlinksAndContents(ilinks, contents)
      parent.bootNamespaces(namespaces)
    }
  }, [parent, _isContentHydrated, _areIlinksHydrated, ilinks, contents, namespaces])

  useEffect(() => {
    if (!parent) return

    parent.bootReminders(reminders)

    // stringifying reminders because useEffect runs twice even though no change
  }, [parent, JSON.stringify(reminders)])

  useEffect(() => {
    if (!parent) return

    parent.bootRecents(recents)
  }, [parent, recents])

  useEffect(() => {
    if (!parent) return

    parent.bootTheme(theme)
  }, [parent, theme])

  useEffect(() => {
    if (!parent) return

    parent.bootSnippets(snippets)
  }, [parent, snippets])

  useEffect(() => {
    if (!parent) return

    parent.bootLinks(links)
  }, [parent, links])

  useEffect(() => {
    if (!parent) return

    parent.bootDescriptions(descriptions)
  }, [parent, descriptions])

  useEffect(() => {
    if (!parent) return

    parent.bootSharedNodes(sharedNodes)
  }, [parent, sharedNodes])

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
