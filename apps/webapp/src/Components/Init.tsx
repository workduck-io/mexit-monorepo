import React, { useEffect } from 'react'

import { mog } from '@mexit/core'

import { getNodeidFromPathAndLinks } from '../Hooks/useLinks'
import useLoad from '../Hooks/useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useInitialize } from '../Hooks/useInitialize'
import { useIndexedDBData } from '../Hooks/usePersistentData'
import { useAnalysis } from '../Stores/useAnalysis'
import { initSearchIndex } from '../Workers/controller'

const Init: React.FC = () => {
  const { init } = useInitialize()
  const { getPersistedData } = useIndexedDBData()
  const { goTo } = useRouting()
  const { loadNode } = useLoad()

  useAnalysis()

  useEffect(() => {
    getPersistedData()
      .then((d) => {
        mog('Initializaing With Data', { d })
        init(d)
        return d
      })
      .then((d) => {
        initSearchIndex(d)
        return d
      })
      // .then((d) => {
      //   const baseNodeId = getNodeidFromPathAndLinks(d.ilinks, d.baseNodeId)
      //   loadNode(baseNodeId, {
      //     fetch: false,
      //     savePrev: false,
      //     withLoading: false
      //   })
      //   return { nodeid: baseNodeId }
      // })
      // .then(({ nodeid }) => {
      //   goTo(ROUTE_PATHS.node, NavigationType.replace, nodeid)
      // })
      .catch((e) => console.error(e))
  }, []) // eslint-disable-line

  return null
}

export default Init
