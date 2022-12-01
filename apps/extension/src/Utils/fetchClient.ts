import 'regenerator-runtime/runtime'

import { wrapErr } from '@mexit/core'

import useAuthStore from '../Hooks/useAuthStore'
import fetchAdapter from '@vespaiach/axios-fetch-adapter'
import { CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js'
import axios from 'axios'

const client = axios.create({
  adapter: fetchAdapter
})

client.interceptors.request.use((request) => {
  const userCred = useAuthStore.getState().userCred
  if (request && request.headers && userCred && userCred.token) {
    request.headers['Authorization'] = `Bearer ${userCred.token}`
  }

  return request
})

const refreshToken = () => {
  const { userCred, userPool: uPool } = useAuthStore.getState()
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
