import React, { useEffect } from 'react'
import { mog } from '@mexit/core'

import { useAuth } from '@workduck-io/dwindle'
import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import { init as SentryInit } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import Analytics from '../Utils/analytics'

import config from '../config'
import { getNodeidFromPathAndLinks } from '../Hooks/useLinks'
import useLoad from '../Hooks/useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useInitialize } from '../Hooks/useInitialize'
import { useIndexedDBData } from '../Hooks/usePersistentData'
import { hashPasswordWithWorker } from '../Workers/controller'
import { useAnalysis } from '../Stores/useAnalysis'

const Init: React.FC = () => {
  const { init } = useInitialize()
  const { getPersistedData } = useIndexedDBData()
  const { initCognito } = useAuth()
  const { goTo } = useRouting()
  const { loadNode } = useLoad()

  useAnalysis()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ; (async () => {

      initCognito({
        UserPoolId: config.cognito.USER_POOL_ID,
        ClientId: config.cognito.APP_CLIENT_ID
      })

      getPersistedData()
        .then((d) => {
          mog('Initializaing With Data', { d })
          init(d)
          return d
        })
        .then((d) => {
          const baseNodeId = getNodeidFromPathAndLinks(d.ilinks, d.baseNodeId)
          loadNode(baseNodeId, {
            fetch: false,
            savePrev: false,
            withLoading: false
          })
          return { nodeid: baseNodeId }
        })
        .then(({ nodeid }) => {
          goTo(ROUTE_PATHS.node, NavigationType.replace, nodeid)
        })
        .catch((e) => console.error(e))
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const routingInstrumentation = useRoutingInstrumentation()
  useEffect(() => {
    const browserTracing = new BrowserTracing({
      routingInstrumentation
    })

    SentryInit({
      dsn: 'https://53b95f54a627459c8d0e74b9bef36381@o1135527.ingest.sentry.io/6184488',
      tracesSampleRate: 1.0,
      integrations: [browserTracing]
    })

    // if (import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP && typeof import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP === 'string')
    //   Analytics.init(import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP)
  }, [routingInstrumentation])

  return null
}

export default Init
