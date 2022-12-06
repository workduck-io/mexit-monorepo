import { connectToParent as connectToExtension } from 'penpal'

import { broadCastMessage } from './channels'
import { initializeExtension } from './initializeExtension'
import { syncStoresWithExtension } from './syncedStores'

export const webExtensionConnector = async () => {
  /*
   * Functions for extension
   */
  const exposedMethods = {
    broadCastMessage
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
    .catch((err) => {
      console.error('[IFRAME -- X -- EXTENSION]', { err })
    })
}
