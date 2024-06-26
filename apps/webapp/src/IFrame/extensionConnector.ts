import { connectToParent as connectToExtension } from 'penpal'

import { mog } from '@mexit/core'

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
  runBatchMessageTransformer,
  searchIndex,
  searchIndexByNodeId,
  searchIndexWithRanking,
  startRequestsWorkerService,
  startSearchWorker,
  updateDoc,
  updateOrAppendBlocks} from '../Workers/controller'

import { broadCastMessage } from './channels'
import { initializeExtension } from './initializeExtension'
import { syncStoresWithExtension } from './syncedStores'
import { uploadImageToCDN } from './uploadImageToCDN'

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
    runBatchMessageTransformer,
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
