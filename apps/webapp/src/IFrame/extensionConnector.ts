import { get } from 'idb-keyval'
import { connectToParent as connectToExtension } from 'penpal'

import { mog, StorePersistentKeys } from '@mexit/core'

import {
  addDoc,
  getSearchIndexInitState,
  initHighlightsExtension,
  initLinksExtension,
  initNamespacesExtension,
  initRequestClient,
  initSearchIndex,
  initSmartCapturesExtension,
  initSnippetsExtension,
  removeDoc,
  searchIndex,
  searchIndexByNodeId,
  searchIndexWithRanking,
  startRequestsWorkerService,
  startSearchWorker,
  updateDoc,
  updateOrAppendBlocks
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
    uploadImageToCDN,
    startSearchWorker,
    initSearchIndex,
    getSearchIndexInitState,
    initNamespacesExtension,
    initSnippetsExtension,
    initRequestClient,
    startRequestsWorkerService,
    addDoc,
    updateDoc,
    updateOrAppendBlocks,
    removeDoc,
    initHighlightsExtension,
    initLinksExtension,
    initSmartCapturesExtension
  }

  // * Connect and expose Web app methods
  const host = connectToExtension({
    // * This will run in Iframe with data sent by the extension component.
    methods: exposedMethods
  })

  mog('CONNECTION TO EXTENSION', { host })
  host.promise
    .then((extension) => {
      mog('[IFRAME ---- EXTENSION]', { extension, location: window.location.href })
      syncStoresWithExtension(extension)
      initializeExtension(extension)
    })
    .catch((err) => {
      console.error('[IFRAME -- X -- EXTENSION]', { err })
    })
}
