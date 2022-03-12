import React, { useState } from 'react'

import { ToggleButton, apiURLs } from '@mexit/shared'

import { useApi } from '../../Hooks/useApi'
import useDataStore from '../../Stores/useDataStore'

const ShareOptions = ({ nodeId }) => {
  const { checkNodePublic, setNodePublic, setNodePrivate } = useDataStore(
    ({ checkNodePublic, setNodePublic, setNodePrivate }) => ({
      checkNodePublic,
      setNodePublic,
      setNodePrivate
    })
  )

  const { makeNodePublic, makeNodePrivate } = useApi()
  const isPublic = checkNodePublic(nodeId)

  const onChange = async () => {
    // Go from public -> private
    if (isPublic) {
      setNodePrivate(nodeId)

      // Toggle immedtiately but re-toggle if request failed
      try {
        const resp = await makeNodePrivate(nodeId)
        console.log('Resp: ', JSON.stringify(resp.nodeUID))
      } catch (error) {
        setNodePublic(nodeId)
        console.log('Error in making private')
      }
    } else {
      // Private to Public
      setNodePublic(nodeId)
      try {
        const resp = await makeNodePublic(nodeId)
        console.log('Resp: ', JSON.stringify(resp.nodeUID))
      } catch (error) {
        setNodePrivate(nodeId)
        console.log('error in making public')
      }
    }

    console.log('Inverting public from: ', isPublic)
  }

  return (
    <div>
      <p>Share to Web</p>
      <ToggleButton id="toggle-public" value={isPublic} onChange={onChange} checked={isPublic} />
      {/* TODO: copy this to clipboard */}
      {isPublic && <p>URL: {apiURLs.getPublicNodePath(nodeId)}</p>}
    </div>
  )
}

export default ShareOptions
