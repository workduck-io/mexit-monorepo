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
      const resp = await makeNodePrivate(nodeId)
      console.log('Resp: ', JSON.stringify(resp.nodeUID))
      setNodePrivate(nodeId)
    } else {
      // Private to Public
      const resp = await makeNodePublic(nodeId)
      console.log('Resp: ', JSON.stringify(resp.nodeUID))
      setNodePublic(nodeId)
    }
    console.log('Inverting public from: ', isPublic)
  }

  return (
    <div>
      <p>Share to Web</p>
      <ToggleButton id="toggle-public" value={isPublic} onChange={onChange} checked={isPublic} />
      {isPublic && <p>URL: {apiURLs.getPublicNodePath(nodeId)}</p>}
    </div>
  )
}

export default ShareOptions
