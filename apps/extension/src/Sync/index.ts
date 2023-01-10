import { BroadcastSyncedChannel, mog } from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useReminderStore } from '../Stores/useReminderStore'

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
      sync: [{ field: 'ilinks' }, { field: 'tags' }, { field: 'publicNodes' }, { field: 'sharedNodes' }]
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
    useContentStore,
    {
      name: BroadcastSyncedChannel.CONTENTS,
      sync: [{ field: 'contents' }]
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
}

export default messagePassing
