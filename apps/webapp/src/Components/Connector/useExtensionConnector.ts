import { useEffect } from 'react'

import { connectToParent as connectToExtension } from 'penpal'

import { syncStoresWithExtension, broadCastMessage } from '../../IFrame/channels'

const useExtensionConnector = () => {
  useEffect(() => {}, [])
}

export default useExtensionConnector
