import React, { useEffect } from 'react'
import { useAuth } from '@workduck-io/dwindle'
import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import { init as SentryInit } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import Analytics from '../Utils/analytics'

import config from '../config'
import { useSnippetStore } from '../Stores/useSnippetStore'
import useSearchStore from '../Hooks/useSearchStore'
import useDataStore from '../Stores/useDataStore'
import useContentStore from '../Stores/useContentStore'

const Init = () => {
  const { initCognito } = useAuth()
  const routingInstrumentation = useRoutingInstrumentation()
  const snippets = useSnippetStore((store) => store.snippets)
  const initializeSearchIndex = useSearchStore((store) => store.initializeSearchIndex)
  const ilinks = useDataStore((store) => store.ilinks)
  const contents = useContentStore((store) => store.contents)

  useEffect(() => {
    initCognito({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const browserTracing = new BrowserTracing({
      routingInstrumentation
    })

    SentryInit({
      dsn: 'https://53b95f54a627459c8d0e74b9bef36381@o1135527.ingest.sentry.io/6184488',
      tracesSampleRate: 1.0,
      integrations: [browserTracing]
    })

    if (import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP && typeof import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP === 'string')
      Analytics.init(import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP)
  }, [routingInstrumentation])

  useEffect(() => {
    const nodes = Object.entries(contents).map(([nodeId, val]) => {
      return {
        id: nodeId,
        ...val
      }
    })
    const initData = {
      node: nodes,
      snippet: snippets,
      archive: []
    }
    initializeSearchIndex(ilinks, initData)
  }, [])

  return null
}

export default Init
