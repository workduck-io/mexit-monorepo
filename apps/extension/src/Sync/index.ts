import {
  BroadcastSyncedChannel,
  mog,
  useCalendarStore,
  useContentStore,
  useDataStore,
  useHighlightStore,
  useLayoutStore,
  useLinkStore,
  useMetadataStore,
  useRecentsStore,
  useReminderStore,
  useSnippetStore,
  useTimestampStore
} from '@mexit/core'

import { childIframe } from './iframeConnector'
import { MessageType, UnhandledRequestsByExtension } from './messageHandler'
import { storeChangeHandler } from './storeChangeHandler'

const onStateChange = (message: MessageType) => {
  if (childIframe && !UnhandledRequestsByExtension?.has(message.msgId)) {
    mog(`${message.msgId} from extension`, { message })
    childIframe.broadCastMessage(message.msgId, message)
  }

  UnhandledRequestsByExtension?.delete(message.msgId)
}

/**
 * Listeners of Extension stores.
 * Changes from these stores would be broadcasted on their respective channels.
 */
const messagePassing = () => {
  storeChangeHandler(
    useDataStore,
    {
      name: BroadcastSyncedChannel.DATA,
      sync: [{ field: 'ilinks' }, { field: 'tags' }, { field: 'sharedNodes' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useLayoutStore,
    {
      name: BroadcastSyncedChannel.LAYOUT,
      sync: [{ field: 'toggleTop' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useMetadataStore,
    {
      name: BroadcastSyncedChannel.METADATA,
      sync: [{ field: 'metadata' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useSnippetStore,
    {
      name: BroadcastSyncedChannel.SNIPPETS,
      sync: [{ field: 'snippets' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useContentStore,
    {
      name: BroadcastSyncedChannel.CONTENTS,
      sync: [{ field: 'contents' }, { field: 'docUpdated' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useRecentsStore,
    {
      name: BroadcastSyncedChannel.RECENTS,
      sync: [{ field: 'lastOpened' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useReminderStore,
    {
      name: BroadcastSyncedChannel.REMINDERS,
      sync: [{ field: 'reminders' }, { field: 'armedReminders' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useLinkStore,
    {
      name: BroadcastSyncedChannel.LINKS,
      sync: [{ field: 'links' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useHighlightStore,
    {
      name: BroadcastSyncedChannel.HIGHLIGHTS,
      sync: [{ field: 'highlights' }, { field: 'highlightBlockMap' }]
    },
    onStateChange
  )

  storeChangeHandler(
    useCalendarStore,
    {
      name: BroadcastSyncedChannel.CALENDAR,
      sync: [{ field: 'tokens' }]
    },
    onStateChange
  ),

  storeChangeHandler(
    useTimestampStore,
    {
      name: BroadcastSyncedChannel.TIMESTAMP,
      sync: [{ field: 'timestamp' }]
    },
    onStateChange
  )
}

export default messagePassing
