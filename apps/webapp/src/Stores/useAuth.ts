import React, { useState, useEffect } from 'react'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuth, client } from '@workduck-io/dwindle'
import { nanoid } from 'nanoid'
import { clear as IDBClear } from 'idb-keyval'

import { apiURLs, AuthStoreState, UserCred } from '@mexit/core'
import { RegisterFormData } from '@mexit/core'
import { authStoreConstructor } from '@mexit/core'

export const useAuthStore = create<AuthStoreState>(persist(authStoreConstructor, { name: 'mexit-authstore' }))

export const useAuthentication = () => {
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const { signIn, signOut, signUp, verifySignUp, googleSignIn, refreshToken } = useAuth()

  const setRegistered = useAuthStore((store) => store.setRegistered)
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()

  const login = async (
    email: string,
    password: string,
    getWorkspace = false
  ): Promise<{ data: UserCred; v: string }> => {
    let data: any // eslint-disable-line @typescript-eslint/no-explicit-any
    const v = await signIn(email, password)
      .then((d) => {
        data = d
        return 'success'
      })
      .catch((e) => {
        console.error({ e })
        return e.toString() as string
      })

    if (getWorkspace && data !== undefined) {
      await client
        .get(apiURLs.getUserRecords(data.userId))
        .then((d: any) => {
          const userDetails = { email, userId: data.userId }
          const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }

          setAuthenticated(userDetails, workspaceDetails)
        })
        .then()
        .catch((e) => {
          console.error({ e })
          return e.toString() as string
        })
    }
    return { data, v }
  }

  const loginViaGoogle = async (code: string, clientId: string, redirectURI: string, getWorkspace = true) => {
    try {
      const result: any = await googleSignIn(code, clientId, redirectURI)

      if (getWorkspace && result.userCred !== undefined) {
        await client
          .get(apiURLs.getUserRecords(result.userCred.userId))
          .then((d: any) => {
            const userDetails = { email: result.userCred.email, userId: result.userCred.userId }
            const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }

            setAuthenticated(userDetails, workspaceDetails)
          })
          .catch(async (e) => {
            setSensitiveData({ email: result.userCred.email, name: result.userCred.username, password: '', roles: [] })

            const uCred: UserCred = {
              email: result.userCred.email,
              userId: result.userCred.userId,
              expiry: result.userCred.exp,
              token: result.userCred.token,
              url: result.userCred.iss
            }
            const newWorkspaceName = `WD_${nanoid()}`

            await client
              .post(
                apiURLs.registerUser,
                {
                  type: 'RegisterUserRequest',
                  user: {
                    id: uCred.userId,
                    name: uCred.email,
                    email: uCred.email
                  },
                  workspaceName: newWorkspaceName
                },
                {
                  headers: {
                    'mex-workspace-id': ''
                  }
                }
              )
              .then(async (d: any) => {
                await refreshToken()
                const userDetails = { email: uCred.email, userId: uCred.userId }
                const workspaceDetails = { id: d.data.id, name: d.data.name }

                setAuthenticated(userDetails, workspaceDetails)
                console.log('Setting user as authenticated')
              })
              .catch(console.error)
          })
      }
      return result
    } catch (error) {
      console.log(error)
    }
  }

  const logout = async () => {
    await signOut()
    setUnAuthenticated()
    localStorage.clear()
    await IDBClear()
  }

  const registerDetails = (data: RegisterFormData): Promise<string> => {
    const customAttributes = [{ name: 'user_type', value: 'mexit_webapp' }]
    const { email, password, roles, name } = data
    const userRole = roles.map((r) => r.value).join(', ') ?? ''

    const status = signUp(email, password, customAttributes)
      .then(() => {
        setRegistered(true)
        setSensitiveData(data)
        return data.email
      })
      .catch((e) => {
        if (e.name === 'UsernameExistsException') {
          setRegistered(true)
          setSensitiveData(data)
          return e.name
        }
      })
    return status
  }

  const verifySignup = async (code: string, metadata: any): Promise<string> => {
    const formMetaData = {
      ...metadata,
      name: sensitiveData.name,
      email: sensitiveData.email,
      roles: sensitiveData.roles.reduce((prev, cur) => `${prev},${cur.value}`, '').slice(1)
    }
    const vSign = await verifySignUp(code, formMetaData).catch(console.error)

    const loginData = await login(sensitiveData.email, sensitiveData.password).catch(console.error)

    if (!loginData) {
      return
    }

    const uCred = loginData.data
    const newWorkspaceName = `WD_${nanoid()}`

    await client
      .post(apiURLs.registerUser, {
        user: {
          id: uCred.userId,
          name: uCred.email,
          email: uCred.email
        },
        workspaceName: newWorkspaceName
      })
      .then((d: any) => {
        const userDetails = { email: uCred.email, userId: uCred.userId }
        const workspaceDetails = { id: d.data.id, name: d.data.name }

        setAuthenticated(userDetails, workspaceDetails)
      })
      .catch(console.error)

    if (vSign) {
      setRegistered(false)
    }
    return vSign
  }

  return { login, logout, registerDetails, verifySignup, loginViaGoogle }
}
