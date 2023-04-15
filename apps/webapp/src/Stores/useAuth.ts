import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { useAuth } from '@workduck-io/dwindle'
import { UserCred } from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'

import {
  API,
  mog,
  RegisterFormData,
  useAppStore,
  useAuthStore,
  useCommentStore,
  useContentStore,
  useDataStore,
  useEditorStore,
  useHelpStore,
  useHighlightStore,
  useLinkStore,
  useMentionStore,
  useMetadataStore,
  usePromptStore,
  usePublicNodeStore,
  useReactionStore,
  useRecentsStore,
  useReminderStore,
  useRouteStore,
  userPreferenceStore as useUserPreferenceStore,
  useSnippetStore,
  useTodoStore,
  useUserCacheStore
} from '@mexit/core'

import { getEmailStart } from '../Utils/constants'
import { terminateAllWorkers } from '../Workers/controller'

import { useViewStore } from './useViewStore'

type LoginResult = { loginData: UserCred; loginStatus: string }

export const useAuthentication = () => {
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const { signIn, signOut, signUp, verifySignUp, googleSignIn } = useAuth()

  const setRegistered = useAuthStore((store) => store.setRegistered)
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()

  const initContents = useContentStore((store) => store.initContents)
  const clearUsersCache = useUserCacheStore((s) => s.clearCache)
  const clearUserPreferences = useUserPreferenceStore((store) => store.clear)
  const clearSnippets = useSnippetStore((s) => s.clear)
  const clearHighlightsStore = useHighlightStore((s) => s.reset)
  const resetDataStore = useDataStore((s) => s.resetDataStore)
  const resetLinksStore = useLinkStore((s) => s.reset)
  const resetPublicNodes = usePublicNodeStore((s) => s.reset)
  const clearRecents = useRecentsStore((s) => s.clear)
  const clearMentions = useMentionStore((m) => m.reset)
  const clearComments = useCommentStore((s) => s.clear)
  const clearAppStore = useAppStore((s) => s.clear)
  const clearReactions = useReactionStore((s) => s.clear)
  const clearViews = useViewStore((s) => s.clear)
  const clearRoutesInformation = useRouteStore((s) => s.clear)
  const clearMetadataStore = useMetadataStore((s) => s.reset)
  const clearPromptStore = usePromptStore((s) => s.reset)
  const resetEditorStore = useEditorStore((s) => s.reset)

  const clearReminders = useReminderStore((r) => r.clearReminders)
  const clearTodos = useTodoStore((s) => s.clearTodos)
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
    try {
      await terminateAllWorkers()
    } catch (err) {
      mog('Worker Termination failed!', { err })
    }

    setUnAuthenticated()
    initContents({})
    clearPromptStore()
    clearUserPreferences()
    clearMetadataStore()
    clearReactions()
    clearComments()
    resetDataStore()
    clearMentions()
    clearRoutesInformation()
    resetPublicNodes()
    clearRecents()
    clearHighlightsStore()
    clearReminders()
    resetLinksStore()
    clearSnippets()
    resetShortcuts()
    clearAppStore()
    clearTodos()
    clearViews()
    clearUsersCache()
    resetEditorStore()
    API.reset()
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

    let workspaceID = null
    for (let i = 0; i < 7; i++) {
      try {
        const result = await API.user.registerStatus(undefined, { throwHttpErrors: false })
        if (result.status === 'SUCCESS') {
          workspaceID = result.workspaceID
          break
        }
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 2 * 1000))
      }
    }

    if (!workspaceID) {
      toast('Could not sign-up new user')
      throw new Error('Did not receive status SUCCESS from backend; Could not signup')
    }

    const userDetails = {
      email: email,
      alias: name,
      id: userId,
      name: name
    }

    const workspaceDetails = { id: workspaceID, name: 'WORKSPACE_NAME' }

    return { userDetails, workspaceDetails }
  }

  return { login, logout, registerDetails, verifySignup, loginViaGoogle, registerNewUser }
}

export const useInitializeAfterAuth = () => {
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
        : await API.user
            .getCurrent()
            .then(async (res) => {
              if (res) {
                if (isGoogle && res.activeWorkspace === undefined) {
                  forceRefreshToken = true
                  return await registerNewUser(loginData)
                } else if (res.activeWorkspace) {
                  const name = res.name ?? res.metadata?.name ?? res.properties?.name
                  const userDetails = {
                    email: email,
                    alias: res.alias ?? res.metadata?.alias ?? res.properties?.alias ?? name,
                    id: res.id,
                    name
                  }
                  const workspaceDetails = { id: res.activeWorkspace, name: 'WORKSPACE_NAME' }
                  return { workspaceDetails, userDetails }
                } else {
                  throw new Error('Could Not Fetch User Records')
                }
              }
            })
            .catch((error) => {
              if (error.status === 404) {
                return registerNewUser(loginData)
              }
            })

      addUser({
        id: userDetails.id,
        email: userDetails.email,
        name: userDetails.name,
        alias: userDetails.alias
      })

      if (forceRefreshToken) await refreshToken()
      setAuthenticated(userDetails, workspaceDetails)
    } catch (error) {
      mog('InitializeAfterAuthError', { error })
    }
  }

  return { initializeAfterAuth }
}

export const useForceLogout = () => {
  const { logout } = useAuthentication()

  const forceLogout = async () => {
    await logout()

    // Delete the keyval-store instance of IndexedDB
    const idbStoreName = 'keyval-store'
    window.indexedDB.deleteDatabase(idbStoreName)

    // Clear localStorage
    localStorage.clear()
  }

  return { forceLogout }
}
