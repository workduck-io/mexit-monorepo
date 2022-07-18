import React, { useState } from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuth, client } from '@workduck-io/dwindle'
import { UserCred } from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'
import { nanoid } from 'nanoid'

import { apiURLs, AuthStoreState, mog } from '@mexit/core'
import { RegisterFormData } from '@mexit/core'
import { authStoreConstructor } from '@mexit/core'
import { useApi } from '../Hooks/API/useNodeAPI'
import { useContentStore } from './useContentStore'
import { useDataStore } from './useDataStore'
import { useSnippetStore } from './useSnippetStore'
import { useLayoutStore } from './useLayoutStore'
import { useApiStore } from './useApiStore'
import { usePublicNodeStore } from './usePublicNodes'
import { useRecentsStore } from './useRecentsStore'
import { useReminderStore } from './useReminderStore'
import { useTodoStore } from './useTodoStore'
import { usePortals } from '../Hooks/usePortals'
import { useUserCacheStore } from './useUserCacheStore'
import { useInternalLinks } from '../Hooks/useInternalLinks'
import { getEmailStart } from '../Utils/constants'
import { useSnippets } from '../Hooks/useSnippets'

export const useAuthStore = create<AuthStoreState>(persist(authStoreConstructor, { name: 'mexit-authstore' }))

type LoginResult = { loginData: UserCred; loginStatus: string }

export const useAuthentication = () => {
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const { signIn, signOut, signUp, verifySignUp, googleSignIn } = useAuth()

  const setRegistered = useAuthStore((store) => store.setRegistered)
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()

  const { updateSnippets } = useSnippets()
  const initContents = useContentStore((store) => store.initContents)
  const clearRequests = useApiStore().clearRequests
  const resetDataStore = useDataStore().resetDataStore
  const resetPublicNodes = usePublicNodeStore().reset
  const clearRecents = useRecentsStore().clear
  const clearReminders = useReminderStore().clearReminders
  const clearTodos = useTodoStore().clearTodos

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const loginResult = await signIn(email, password)
      .then((d) => {
        return { loginStatus: 'success', loginData: d }
      })
      .catch((e) => {
        console.error({ e })
        return { loginStatus: e.toString(), loginData: {} as UserCred }
      })

    return loginResult
  }

  const loginViaGoogle = async (
    code: string,
    clientId: string,
    redirectURI: string,
    getWorkspace = true
  ): Promise<LoginResult> => {
    try {
      const loginResult = await googleSignIn(code, clientId, redirectURI)
        .then(({ userCred }: { userCred: UserCred }) => {
          return { loginStatus: 'success', loginData: userCred }
        })
        .catch((e: Error) => {
          console.error('GoogleLoginError', { error: e })
          return { loginStatus: e.toString(), loginData: {} as UserCred }
        })

      return loginResult
    } catch (error) {
      mog('ErrorInGoogleLogin', { error })
    }
  }

  const logout = async () => {
    await signOut()
    setUnAuthenticated()

    // Reseting all persisted stores explicitly because just clearing out local storage and indexed db doesn't work
    // This is because zustand maintains it's state post logout as we don't go through a reload
    // Which results in zustand recreating everything post logout
    clearRequests()
    initContents({})
    resetDataStore()
    resetPublicNodes()
    clearRecents()
    clearReminders()
    updateSnippets([])
    clearTodos()
  }

  const registerDetails = (data: RegisterFormData): Promise<string> => {
    const customAttributes = [{ name: 'user_type', value: 'mexit_webapp' }]
    const { email, password } = data

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

  const verifySignup = async (code: string, metadata: any): Promise<any> => {
    const formMetadata = {
      ...metadata,
      name: sensitiveData.name,
      email: sensitiveData.email,
      roles: sensitiveData.roles.reduce((prev, cur) => `${prev},${cur.value}`, '').slice(1),
      alias: sensitiveData.alias
    }
    await verifySignUp(code, formMetadata).catch(console.error)
    const { loginStatus, loginData } = await login(sensitiveData.email, sensitiveData.password)

    if (loginStatus !== 'success') throw new Error('Could Not Verify Signup')

    return loginData
  }

  const registerNewUser = async (loginResult: UserCred) => {
    const { email, userId } = loginResult
    const name = getEmailStart(email)
    const newWorkspaceName = `WD_${nanoid()}`
    const result = await client
      .post(
        apiURLs.registerUser,
        {
          type: 'RegisterUserRequest',
          user: {
            id: userId,
            email: email,
            name: name,
            alias: name
          },
          workspaceName: newWorkspaceName
        },
        {
          headers: {
            'mex-workspace-id': ''
          }
        }
      )
      .then((d: any) => {
        return d.data
      })

    const userDetails = {
      email: email,
      alias: name,
      userID: userId,
      name: name
    }
    const workspaceDetails = { id: result.id, name: 'WORKSPACE_NAME' }

    return { userDetails, workspaceDetails }
  }

  return { login, logout, registerDetails, verifySignup, loginViaGoogle, registerNewUser }
}

export const useInitializeAfterAuth = () => {
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const addUser = useUserCacheStore((s) => s.addUser)
  const { updateSnippets } = useSnippets()

  const { refreshToken } = useAuth()
  const { initPortals } = usePortals()
  const { refreshILinks } = useInternalLinks()
  const api = useApi()
  const { registerNewUser } = useAuthentication()
  const { getInitialSnippets } = useSnippets()

  const initializeAfterAuth = async (
    loginData: UserCred,
    forceRefreshToken = false,
    isGoogle = false,
    registerUser = false
  ) => {
    try {
      setShowLoader(true)
      const { email } = loginData
      const { userDetails, workspaceDetails } = registerUser
        ? await registerNewUser(loginData)
        : await client
            .get(apiURLs.getUserRecords, {
              validateStatus: (status: number) => {
                return (status >= 200 && status < 300) || status === 404
              }
            })
            .then(async (d: { status: number; data: any }) => {
              if (d.status === 404 && isGoogle) {
                forceRefreshToken = true
                return await registerNewUser(loginData)
              } else if (d.data.group) {
                const userDetails = {
                  email: email,
                  alias: d.data.alias ?? d.data.properties?.alias ?? d.data.name,
                  userID: d.data.id,
                  name: d.data.name
                }
                const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }
                return { workspaceDetails, userDetails }
              } else {
                throw new Error('Could Not Fetch User Records')
              }
            })

      addUser({
        userID: userDetails.userID,
        email: userDetails.email,
        name: userDetails.name,
        alias: userDetails.alias
      })

      if (forceRefreshToken) await refreshToken()

      setAuthenticated(userDetails, workspaceDetails)

      const initialSnippetsP = await api.getAllSnippetsByWorkspace()

      const initPortalsP = initPortals()
      const refreshILinksP = refreshILinks()

      const initialSnippetsResult = (await Promise.allSettled([initialSnippetsP, initPortalsP, refreshILinksP]))[0]

      if (initialSnippetsResult.status === 'fulfilled') updateSnippets(initialSnippetsResult.value)
      getInitialSnippets()
    } catch (error) {
      mog('InitializeAfterAuthError', { error })
    } finally {
      setShowLoader(false)
    }
  }

  return { initializeAfterAuth }
}
