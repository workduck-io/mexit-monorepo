import { get } from 'idb-keyval'
import { connectToParent as connectToExtension } from 'penpal'

import { StorePersistentKeys } from '@mexit/core'

import {
  getSearchIndexInitState,
  initSearchIndex,
  searchIndex,
  searchIndexByNodeId,
  searchIndexWithRanking,
  startSearchWorker
} from '../Workers/controller'

import { broadCastMessage } from './channels'
import { initializeExtension } from './initializeExtension'
import { syncStoresWithExtension } from './syncedStores'
import { uploadImageToCDN } from './uploadImageToCDN'

const getStoreValueFromIDB = async (key: StorePersistentKeys, field?: string) => {
  const idbValue = await get(key)
  if (idbValue) {
    const jsonStoreValue = JSON.parse(idbValue).state
    return field ? jsonStoreValue[field] : jsonStoreValue
  }
}

export const webExtensionConnector = async () => {
  /*
   * Functions for extension
   */
  const exposedMethods = {
    broadCastMessage,
    searchIndex,
    searchIndexByNodeId,
    searchIndexWithRanking,
    uploadImageToCDN
  }

  // * Connect and expose Web app methods
  const host = connectToExtension({
    // * This will run in Iframe with data sent by the extension component.
    methods: exposedMethods
  })

  host.promise
    .then((extension) => {
      // console.log('[IFRAME ---- EXTENSION]', { extension, location: window.location.href })
      syncStoresWithExtension(extension)
      initializeExtension(extension)
    })
    .then(async () => {
      await startSearchWorker()
      const initState = await getSearchIndexInitState()
      if (!initState) {
        const storeValues = {
          DATA: await getStoreValueFromIDB(StorePersistentKeys.DATA),
          SNIPPETS: await getStoreValueFromIDB(StorePersistentKeys.SNIPPETS, 'snippets'),
          CONTENTS: await getStoreValueFromIDB(StorePersistentKeys.CONTENTS, 'contents')
        }

        const initData = {
          ilinks: storeValues.DATA.ilinks,
          archive: storeValues.DATA.archive,
          sharedNodes: storeValues.DATA.sharedNodes,
          snippets: storeValues.SNIPPETS,
          contents: storeValues.CONTENTS
        }
        await initSearchIndex(initData)
      }
    })
    .catch((err) => {
      console.error('[IFRAME -- X -- EXTENSION]', { err })
    })
}
