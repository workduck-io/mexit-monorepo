import { useState } from 'react'

import { nanoid } from 'nanoid'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { useAuth, client } from '@workduck-io/dwindle'
import { UserCred } from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'

import { apiURLs, AuthStoreState, mog } from '@mexit/core'
import { RegisterFormData } from '@mexit/core'
import { authStoreConstructor } from '@mexit/core'

import { useViewStore } from '../Hooks/useTaskViews'
import { getEmailStart } from '../Utils/constants'
import { terminateRequestWorker } from '../Workers/controller'
import { useApiStore } from './useApiStore'
import { useCommentStore } from './useCommentStore'
import { useContentStore } from './useContentStore'
import { useDataStore } from './useDataStore'
import { useHelpStore } from './useHelpStore'
import { useLayoutStore } from './useLayoutStore'
import { useMentionStore } from './useMentionsStore'
import { usePublicNodeStore } from './usePublicNodes'
import { useReactionStore } from './useReactionStore'
import { useRecentsStore } from './useRecentsStore'
import { useReminderStore } from './useReminderStore'
import useRouteStore from './useRouteStore'
import { useSnippetStore } from './useSnippetStore'
import { useTodoStore } from './useTodoStore'
import { useUserCacheStore } from './useUserCacheStore'

export const useAuthStore = create<AuthStoreState>(persist(authStoreConstructor, { name: 'mexit-authstore' }))

type LoginResult = { loginData: UserCred; loginStatus: string }

export const useAuthentication = () => {
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const { signIn, signOut, signUp, verifySignUp, googleSignIn } = useAuth()

  const setRegistered = useAuthStore((store) => store.setRegistered)
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()

  const initContents = useContentStore((store) => store.initContents)
  const clearSnippets = useSnippetStore((s) => s.clear)
  const clearRequests = useApiStore().clearRequests
  const resetDataStore = useDataStore().resetDataStore
  const resetPublicNodes = usePublicNodeStore().reset
  const clearRecents = useRecentsStore().clear
  const clearMentions = useMentionStore((m) => m.reset)
  const clearComments = useCommentStore((s) => s.clear)
  const clearReactions = useReactionStore((s) => s.clear)
  const clearViews = useViewStore((s) => s.clear)
  const clearRoutesInformation = useRouteStore((s) => s.clear)

  const clearReminders = useReminderStore().clearReminders
  const clearTodos = useTodoStore().clearTodos
  const resetShortcuts = useHelpStore((s) => s.reset)

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
    await terminateRequestWorker()

    setUnAuthenticated()

    // Reseting all persisted stores explicitly because just clearing out local storage and indexed db doesn't work
    // This is because zustand maintains it's state post logout as we don't go through a reload
    // Which results in zustand recreating everything post logout
    clearRequests()
    initContents({})
    clearReactions()
    clearComments()
    resetDataStore()
    clearMentions()
    clearRoutesInformation()
    resetPublicNodes()
    clearRecents()
    clearReminders()
    clearSnippets()
    resetShortcuts()
    clearTodos()
    clearViews()
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
        apiURLs.user.registerUser,
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

  const { refreshToken } = useAuth()
  const { registerNewUser } = useAuthentication()

  const initializeAfterAuth = async (
    loginData: UserCred,
    forceRefreshToken = false,
    isGoogle = false,
    registerUser = false
  ) => {
    try {
      const { email } = loginData
      const { userDetails, workspaceDetails } = registerUser
        ? await registerNewUser(loginData)
        : await client
            .get(apiURLs.user.getUserRecords, {
              validateStatus: (status: number) => {
                return (status >= 200 && status < 300) || status === 404
              }
            })
            .then(async (d: { status: number; data: any }) => {
              if (isGoogle && (d.data.group === undefined || d.status === 404)) {
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
      mog('WORKSPACE ID', { d: loginData.token, workspaceDetails })
      setAuthenticated(userDetails, workspaceDetails)
      setShowLoader(true)
    } catch (error) {
      mog('InitializeAfterAuthError', { error })
    } finally {
      // Loader would be stopped inside useInitLoader
      // setShowLoader(false)
    }
  }

  return { initializeAfterAuth }
}
