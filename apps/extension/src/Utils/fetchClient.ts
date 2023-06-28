import 'regenerator-runtime/runtime'

import ky, { AfterResponseHook, BeforeRequestHook } from 'ky'
import { nanoid } from 'nanoid'

import { config } from '@mexit/core'

const AWS_AUTH_KEY = 'aws-auth-mexit'

export const getAuthStateFromChrome = async (key: string = AWS_AUTH_KEY) => {
  const authState = (await chrome.storage.local.get(key))?.[key]
  return JSON.parse(authState ?? '{}')?.state
}

export const setAuthStateChrome = async (data, key: string = AWS_AUTH_KEY) => {
  const sData = JSON.stringify(data)
  return await chrome.storage.local.set({
    [key]: sData
  })
}

const generateRequestID = () => {
  return `REQUEST_${nanoid(21)}`
}

const attachTokenToRequest: BeforeRequestHook = async (request) => {
  const authState = await getAuthStateFromChrome()
  if (request && request.headers && authState?.userCred && authState?.userCred?.token) {
    request.headers.set('Authorization', `Bearer ${authState?.userCred.token}`)
    request.headers.set('wd-request-id', request.headers['wd-request-id'] ?? generateRequestID())
  }
}

const refreshTokenHook: AfterResponseHook = async (request, _, response) => {
  if (response && response.status === 401) {
    try {
      const URL = `${config.baseURLs.MEXIT_AUTH_URL_BASE}/oauth2/token`
      const authState = await getAuthStateFromChrome()
      const formData = new URLSearchParams()

      if (!authState?.userCred) {
        throw new Error("Refresh token doesn't exist in store")
      }

      formData.append('grant_type', 'refresh_token')
      formData.append('client_id', config.cognito.APP_CLIENT_ID)
      formData.append('refresh_token', authState?.userCred.refresh_token)

      const response = (await ky
        .post(URL, {
          body: formData
        })
        .json()) as any

      const updatedAuthState = {
        ...authState,
        userCred: {
          ...authState.userCred,
          token: response.id_token,
          expiry: Date.now() + response.expires_in * 1000
        }
      }

      await setAuthStateChrome({ state: updatedAuthState })
      return await client(request)
    } catch (error) {
      console.error('Error refresh token: ', error)
      throw new Error(error)
    }
  }
}

const client = ky.create({
  hooks: {
    beforeRequest: [attachTokenToRequest],
    afterResponse: [refreshTokenHook]
  },
  timeout: 20000,
  retry: 0
})

export default client
