import { BroadcastSyncedChannel, mog } from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
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

const messagePassing = () => {
  storeChangeHandler(
    useDataStore,
    {
      name: BroadcastSyncedChannel.DATA,
      sync: [{ field: 'ilinks' }, { field: 'tags' }, { field: 'publicNodes' }]
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
      sync: [{ field: 'reminders' }]
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