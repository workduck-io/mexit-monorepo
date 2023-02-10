import 'regenerator-runtime/runtime'

import fetchAdapter from '@vespaiach/axios-fetch-adapter'
import { CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js'
import axios from 'axios'

import { wrapErr } from '@mexit/core'

import useAuthStore from '../Hooks/useAuthStore'

// * TODO: Move to KYClient

const client = axios.create({
  adapter: fetchAdapter
})

const AWS_AUTH_KEY = 'aws-auth-mexit'

const getUserCredFromChrome = async () => {
  const authState = (await chrome.storage.local.get(AWS_AUTH_KEY))?.[AWS_AUTH_KEY]
  return JSON.parse(authState ?? '{}')?.state?.userCred
}

client.interceptors.request.use(async (request) => {
  const userCred = await getUserCredFromChrome()

  if (request && request.headers && userCred && userCred.token) {
    request.headers['Authorization'] = `Bearer ${userCred.token}`
  }

  return request
})

const refreshToken = () => {
  const userCred = useAuthStore.getState().userCred
  const uPool = useAuthStore.getState().userPool

  if (userCred) {
    if (uPool) {
      const userPool = new CognitoUserPool(uPool)
      const nuser = new CognitoUser({ Username: userCred.email, Pool: userPool })

      nuser.getSession(
        wrapErr((sess: CognitoUserSession) => {
          if (sess) {
            const refreshToken = sess.getRefreshToken()
            nuser.refreshSession(refreshToken, (err, session) => {
              if (err) {
                console.log(err)
              } else {
                const token = session.getAccessToken().getJwtToken()
                const payload = session.getAccessToken().payload
                const expiry = session.getAccessToken().getExpiration()
                useAuthStore.setState({
                  userCred: {
                    email: userCred.email,
                    url: userCred.url,
                    token,
                    expiry,
                    userId: payload.sub
                  }
                })
              }
            })
          }
        })
      )
    }
  }
}

client.interceptors.response.use(undefined, async (error) => {
  const response = error.response

  if (response) {
    if (response.status === 401 && error.config && !error.config.__isRetryRequest) {
      try {
        refreshToken()
      } catch (authError) {
        // refreshing has failed, but report the original error, i.e. 401
        return Promise.reject(error)
      }

      // retry the original request
      error.config.__isRetryRequest = true
      return client(error.config)
    }
  }

  return Promise.reject(error)
})

export default client
