import { PartialBy } from '@mexit/core'

export enum STAGE {
  prod = 'prod',
  staging = 'staging',
  test = 'test',
  local = 'local'
}

export const DEPLOYMENT_STAGE: STAGE = (() => {
  const { MEXIT_STAGE, MEXIT_FORCE_DEV, MODE } = import.meta.env ?? process.env

  if (MEXIT_FORCE_DEV) {
    return STAGE.local
  } else if (MEXIT_STAGE) {
    return STAGE[MEXIT_STAGE]
  } else if (MODE) {
    return MODE === 'development' ? STAGE.local : STAGE[MODE]
  }
})()

export const IS_DEV = (() => {
  return DEPLOYMENT_STAGE === STAGE.local || DEPLOYMENT_STAGE === STAGE.test
})()

interface CognitoConfig {
  REGION: string
  USER_POOL_ID: string
  APP_CLIENT_ID: string
  IDENTITY_POOL_ID?: string
  SCOPES: string
}

const cognitoCreds: Record<STAGE, PartialBy<CognitoConfig, 'SCOPES'>> = {
  [STAGE.prod]: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_Zu7FAh7hj',
    APP_CLIENT_ID: '6pvqt64p0l2kqkk2qafgdh13qe',
    IDENTITY_POOL_ID: 'us-east-1:4bdb5a8f-7db1-4af0-8a4d-79099b847165'
  },
  [STAGE.staging]: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_Zu7FAh7hj',
    APP_CLIENT_ID: '6pvqt64p0l2kqkk2qafgdh13qe',
    IDENTITY_POOL_ID: 'us-east-1:4bdb5a8f-7db1-4af0-8a4d-79099b847165'
  },
  [STAGE.test]: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_O5YTlVrCd',
    APP_CLIENT_ID: '25qd6eq6vv3906osgv8v3f8c6v',
    IDENTITY_POOL_ID: 'us-east-1:4cf33aad-d624-47d1-b7dc-996e9c4d732e'
  },
  [STAGE.local]: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_O5YTlVrCd',
    APP_CLIENT_ID: '25qd6eq6vv3906osgv8v3f8c6v',
    IDENTITY_POOL_ID: 'us-east-1:4cf33aad-d624-47d1-b7dc-996e9c4d732e'
  }
}

type BaseURLs =
  | 'MEXIT_BACKEND_URL_BASE'
  | 'MEX_API_GATEWAY_URL_BASE'
  | 'MEXIT_FRONTEND_URL_BASE'
  | 'MEXIT_WEBSOCKET_URL'

const baseURLs: Record<STAGE, Record<BaseURLs, string>> = {
  [STAGE.prod]: {
    MEXIT_WEBSOCKET_URL: 'wss://ws.workduck.io/route',
    MEXIT_FRONTEND_URL_BASE: 'https://mexit.workduck.io',
    MEXIT_BACKEND_URL_BASE: 'https://mexit-backend-staging.workduck.io',
    MEX_API_GATEWAY_URL_BASE: 'https://http-staging.workduck.io'
  },
  [STAGE.staging]: {
    MEXIT_WEBSOCKET_URL: 'wss://ws.workduck.io/route',
    MEXIT_FRONTEND_URL_BASE: 'https://mexit.workduck.io',
    MEXIT_BACKEND_URL_BASE: 'https://mexit-backend-staging.workduck.io',
    MEX_API_GATEWAY_URL_BASE: 'https://http-staging.workduck.io'
  },
  [STAGE.test]: {
    MEXIT_WEBSOCKET_URL: 'wss://ws-test.workduck.io/route',
    MEXIT_FRONTEND_URL_BASE: 'https://mexit.workduck.io',
    MEXIT_BACKEND_URL_BASE: 'https://mexit-backend-test.workduck.io',
    MEX_API_GATEWAY_URL_BASE: 'https://http-test.workduck.io'
  },
  [STAGE.local]: {
    MEXIT_WEBSOCKET_URL: 'wss://ws-test.workduck.io/route',
    MEXIT_FRONTEND_URL_BASE: 'http://localhost:3333',
    MEXIT_BACKEND_URL_BASE: 'http://localhost:5002',
    MEX_API_GATEWAY_URL_BASE: 'https://http-test.workduck.io'
  }
}

export interface MexitConfig {
  cognito: CognitoConfig
  baseURLs: Record<BaseURLs, string>
}

const config: MexitConfig = {
  cognito: {
    ...cognitoCreds[DEPLOYMENT_STAGE],
    SCOPES: 'email openid profile'
  },
  baseURLs: baseURLs[DEPLOYMENT_STAGE]
}

export default config
