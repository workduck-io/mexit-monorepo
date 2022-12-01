import { broadCastMessage } from './channels'
import { syncStoresWithExtension } from './syncedStores'
import { connectToParent as connectToExtension } from 'penpal'

export const webExtensionConnector = () => {
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
      console.log('[IFRAME ---- EXTENSION]', { extension, location: window.location.href })
      syncStoresWithExtension(extension)
    })
    .catch((err) => {
      console.log('[IFRAME -- X -- EXTENSION]', { err })
    })
}
