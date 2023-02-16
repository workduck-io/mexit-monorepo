import 'regenerator-runtime/runtime'

import ky, { AfterResponseHook, BeforeRequestHook } from 'ky'
import { nanoid } from 'nanoid'

import { config } from '@mexit/core'

import useInternalAuthStore from '../Hooks/useAuthStore'

const AWS_AUTH_KEY = 'aws-auth-mexit'

const getUserCredFromChrome = async () => {
  const authState = (await chrome.storage.local.get(AWS_AUTH_KEY))?.[AWS_AUTH_KEY]
  return JSON.parse(authState ?? '{}')?.state?.userCred
}

const setUserCredChrome = async (data) => {
  const sData = JSON.stringify(data)
  return await chrome.storage.local.set({
    AWS_AUTH_KEY: sData
  })
}

const generateRequestID = () => {
  return `REQUEST_${nanoid(21)}`
}

const attachTokenToRequest: BeforeRequestHook = async (request) => {
  const userCred = await getUserCredFromChrome()
  if (request && request.headers && userCred && userCred.token) {
    request.headers.set('Authorization', `Bearer ${userCred.token}`)
    request.headers.set('wd-request-id', request.headers['wd-request-id'] ?? generateRequestID())
  }
}

const refreshTokenHook: AfterResponseHook = async (request, _, response) => {
  if (response && response.status === 401) {
    try {
      const URL = `${config.baseURLs.MEXIT_AUTH_URL_BASE}/oauth2/token`
      const userCred = await getUserCredFromChrome()
      const formData = new URLSearchParams()

      formData.append('grant_type', 'refresh_token')
      formData.append('client_id', config.cognito.APP_CLIENT_ID)
      formData.append('refresh_token', userCred.refresh_token)

      const response = (await ky
        .post(URL, {
          body: formData
        })
        .json()) as any

      useInternalAuthStore.setState({
        userCred: {
          ...useInternalAuthStore.getState().userCred,
          token: response.id_token,
          expiry: Date.now() + response.expires_in * 1000
        }
      })

      await setUserCredChrome(useInternalAuthStore.getState())

      return client(request)
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
  retry: 0
})

export default client
