import React, { useEffect } from 'react'
import { useAuth } from '@workduck-io/dwindle'
import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import { init as SentryInit } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import Analytics from '../Utils/analytics'

import config from '../config'
import { IS_DEV } from '@mexit/shared'
import { useSnippetStore } from '../Stores/useSnippetStore'
import useSearchStore from '../Hooks/useSearchStore'
import useDataStore from '../Stores/useDataStore'

const Init = () => {
  const { initCognito } = useAuth()
  const routingInstrumentation = useRoutingInstrumentation()
  const snippets = useSnippetStore((store) => store.snippets)
  const initializeSearchIndex = useSearchStore((store) => store.initializeSearchIndex)
  const ilinks = useDataStore((store) => store.ilinks)

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

    if (process.env.NX_MIXPANEL_TOKEN_WEBAPP && !IS_DEV) Analytics.init(process.env.NX_MIXPANEL_TOKEN_WEBAPP)
  }, [routingInstrumentation])

  useEffect(() => {
    const initData = {
      node: [],
      snippet: snippets,
      archive: []
    }
    initializeSearchIndex(ilinks, initData)
  }, [])

  return null
}

export default Init
