import { wrapErr } from '@mexit/core'
import {
  AuthenticationDetails,
  ClientMetadata,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  //CognitoUser,
  ICognitoUserPoolData
} from 'amazon-cognito-identity-js'
import { useEffect } from 'react'
import useInternalAuthStore, { UserCred } from './useAuthStore'

const AWSRegion = 'us-east-1'

const useAuth = () => {
  const uPool = useInternalAuthStore((store) => store.userPool)
  const email = useInternalAuthStore((store) => store.email)
  const setUserPool = useInternalAuthStore((store) => store.setUserPool)

  const setUser = useInternalAuthStore((store) => store.setUser)
  const setEmail = useInternalAuthStore((store) => store.setEmail)
  // Needs to handle automatic refreshSession
  const setUserCred = useInternalAuthStore((store) => store.setUserCred)
  const userCred = useInternalAuthStore((store) => store.userCred)
  const clearStore = useInternalAuthStore((store) => store.clearStore)

  const initCognito = (poolData: ICognitoUserPoolData) => {
    setUserPool(poolData)
    if (userCred) {
      return userCred.email
    }
    return
  }

  // Handles refreshing of the token on every update of UserCred
  // client also refreshes the token if a request returns 401
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000)
    if (userCred) {
      if (userCred.expiry < now) refreshToken()
    }
  }, [userCred])

  const signIn = (email: string, password: string): Promise<UserCred> => {
    return new Promise((resolve, reject) => {
      const authData = {
        Username: email,
        Password: password
      }
      const authDetails = new AuthenticationDetails(authData)

      if (uPool) {
        const userPool = new CognitoUserPool(uPool)
        const user = new CognitoUser({ Username: email, Pool: userPool })
        user.authenticateUser(authDetails, {
          onSuccess: function (result) {
            const accessToken = result.getAccessToken().getJwtToken()
            const payload = result.getAccessToken().payload
            const expiry = result.getAccessToken().getExpiration()

            const nUCred = {
              email: email,
              userId: payload.sub,
              expiry,
              token: accessToken,
              url: `cognito-idp.${AWSRegion}.amazonaws.com/${userPool.getUserPoolId()}`
            }

            setUserCred(nUCred)
            resolve(nUCred)
          },

          onFailure: function (err) {
            reject(err.message || JSON.stringify(err))
          }
        })
      }
    })
  }

  const refreshToken = () => {
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
                  setUserCred({ email: userCred.email, url: userCred.url, token, expiry, userId: payload.sub })
                }
              })
            }
          })
        )
      }
    }
  }

  const getConfig = () => {
    if (userCred) {
      return {
        headers: { Authorization: `Bearer ${userCred.token}` }
      }
    }
    return undefined
  }

  const signUp = (email: string, password: string, customAttributes?: any[]): Promise<string | { email: string }> => {
    return new Promise((resolve, reject) => {
      const attributeEmail = new CognitoUserAttribute({ Name: 'email', Value: email })
      const attributeList = [attributeEmail]

      if (customAttributes !== undefined && customAttributes.length > 0) {
        customAttributes.forEach((item: any) => {
          const name = `custom:${item.name}`
          const value = item.value
          const t = new CognitoUserAttribute({
            Name: name,
            Value: value
          })
          attributeList.push(t)
        })
      }

      console.log('Attribute List: ', attributeList)

      if (uPool) {
        const userPool = new CognitoUserPool(uPool)
        userPool.signUp(email, password, attributeList, [], (err, result) => {
          if (err) {
            if (err.name === 'UsernameExistsException') {
              setEmail(email)
            }
            reject(err)
          }
          if (result) {
            const cognitoUser = result.user
            setEmail(email)
            setUser(cognitoUser)
            resolve({ email })
          }
        })
      }
    })
  }

  const verifySignUp = (code: string, metadata?: ClientMetadata): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (email) {
        if (uPool) {
          const userPool = new CognitoUserPool(uPool)

          const nuser = new CognitoUser({ Username: email, Pool: userPool })
          nuser.confirmRegistration(
            code,
            true,
            (err, result) => {
              if (err) {
                reject('VerifySignUp Failed')
              }
              if (result) {
                resolve({ result })
              }
            },
            metadata
          )
        }
      }
    })
  }

  const resendCode = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (email) {
        if (uPool) {
          const userPool = new CognitoUserPool(uPool)

          const nuser = new CognitoUser({ Username: email, Pool: userPool })
          nuser.resendConfirmationCode((err, result) => {
            if (err) reject(err)
            if (result) {
              console.log({ result })
              resolve('sent successfully')
            }
          })
        }
      }
    })
  }

  const forgotPassword = () => undefined
  const verifyForgotPassword = () => undefined

  const getUserDetails = (): { email: string } | undefined => {
    if (userCred) {
      return { email: userCred.email }
    }
    return
  }

  const changePassword = () => {
    /*if (user)
        user.changePassword(
          oldPassword,
          newPassword,
          wrapErr((result) => console.log({ result }))
        ) */
  }

  const signOut = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        if (uPool && userCred) {
          const userPool = new CognitoUserPool(uPool)
          const nuser = new CognitoUser({ Username: userCred.email, Pool: userPool })
          nuser.signOut(() => {
            clearStore()
            resolve('Signout Successful')
          })
        }
      } catch {
        reject('Signout Failed')
      }
    })
  }

  return {
    initCognito,
    signIn,
    signUp,
    verifySignUp,
    resendCode,
    forgotPassword,
    verifyForgotPassword,
    getUserDetails,
    changePassword,
    signOut,
    refreshToken,
    userCred,
    getConfig
  }
}

export default useAuth
