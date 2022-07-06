import React, { useState, useEffect } from 'react'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuth, client } from '@workduck-io/dwindle'
import { UserCred } from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'
import { nanoid } from 'nanoid'
import { clear as IDBClear } from 'idb-keyval'

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
import useArchive from '../Hooks/useArchive'
import { useUserCacheStore } from './useUserCacheStore'
import { useInternalLinks } from '../Hooks/useInternalLinks'

export const useAuthStore = create<AuthStoreState>(persist(authStoreConstructor, { name: 'mexit-authstore' }))

export const useAuthentication = () => {
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const { signIn, signOut, signUp, verifySignUp, googleSignIn, refreshToken } = useAuth()

  const setILinks = useDataStore((store) => store.setIlinks)
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const initContents = useContentStore((store) => store.initContents)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)

  const clearRequests = useApiStore().clearRequests
  const resetDataStore = useDataStore().resetDataStore
  const resetPublicNodes = usePublicNodeStore().reset
  const clearRecents = useRecentsStore().clear
  const clearReminders = useReminderStore().clearReminders
  const clearTodos = useTodoStore().clearTodos
  const { initPortals } = usePortals()
  const addUser = useUserCacheStore((s) => s.addUser)

  const { refreshILinks } = useInternalLinks()

  const login = async (email: string, password: string): Promise<{ data: UserCred; loginStatus: string }> => {
    let data: any // eslint-disable-line @typescript-eslint/no-explicit-any
    const loginStatus = await signIn(email, password)
      .then((d) => {
        data = d
        return 'success'
      })
      .catch((e) => {
        console.error({ e })
        return e.toString() as string
      })

    mog('LoginResult', { loginStatus, data })

    if (!data) {
      throw new Error('Error Occurred In Login')
    }

    return { data, loginStatus }
  }

  const loginViaGoogle = async (code: string, clientId: string, redirectURI: string, getWorkspace = true) => {
    try {
      const result: any = await googleSignIn(code, clientId, redirectURI)
      console.log(`Result of Login: ${JSON.stringify(result)}`)

      setShowLoader(true)
      if (getWorkspace && result !== undefined) {
        await client.get(apiURLs.getUserRecords).then(async (d: any) => {
          const userDetails = {
            email: result.userCred.email,
            userID: result.userCred.userId,
            alias: d.data.alias ?? d.data.properties?.alias ?? d.data.name,
            name: d.data.name
          }
          const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }
          setAuthenticated(userDetails, workspaceDetails)

          if (!d.data.group) {
            await registerUserForGoogle(result, d.data)
          } else {
            mog('UserDetails', { userDetails: result })
            const userDetails = {
              email: result.userCred.email,
              name: d.data.name,
              userID: result.userCred.userId,
              alias: d.data.alias ?? d.data.properties?.alias ?? d.data.name
            }
            const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }

            mog('Login Google BIG success', { d, userDetails, workspaceDetails })

            setAuthenticated(userDetails, workspaceDetails)
          }
        })
        await refreshILinks()
        await initPortals()
      }

      setShowLoader(false)
      return result
    } catch (error) {
      setShowLoader(false)
      console.log(error)
    }
  }

  async function registerUserForGoogle(result: any, data: any) {
    mog('Registering user for google', { result })
    setSensitiveData({
      email: result.email,
      name: data.name,
      password: '',
      roles: [],
      alias: data.alias ?? data.properties?.alias ?? data.name
    })
    const uCred: UserCred = {
      username: result.userCred.username,
      email: result.userCred.email,
      userId: result.userCred.userId,
      expiry: result.userCred.expiry,
      token: result.userCred.token,
      url: result.userCred.url
    }

    const newWorkspaceName = `WD_${nanoid()}`

    mog('Login Google Need to create user', { uCred })
    await client
      .post(
        apiURLs.registerUser,
        {
          type: 'RegisterUserRequest',
          user: {
            id: uCred.userId,
            name: data.name,
            alias: data.alias ?? data.name,
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
        try {
          await refreshToken()
        } catch (error) {
          // setShowLoader(false)
          mog('Error: ', { error: JSON.stringify(error) })
        }
        const userDetails = {
          userID: uCred.userId,
          name: data.name,
          alias: d.data.alias ?? d.data.properties?.alias ?? d.data.name,
          email: uCred.email
        }
        const workspaceDetails = { id: d.data.id, name: 'WORKSPACE_NAME' }
        mog('Register Google BIG success', { d, data, userDetails, workspaceDetails })

        mog('Login Google BIG success created user', { userDetails, workspaceDetails })
        setAuthenticated(userDetails, workspaceDetails)
        // setShowLoader(false)
      })
      .catch(console.error)
      .finally(() => {
        setShowLoader(false)
      })
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
    initSnippets([])
    clearTodos()
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
      roles: sensitiveData.roles.reduce((prev, cur) => `${prev},${cur.value}`, '').slice(1),
      alias: sensitiveData.alias
    }
    const vSign = await verifySignUp(code, formMetaData).catch(console.error)

    const loginData = await login(sensitiveData.email, sensitiveData.password).catch(console.error)

    if (!loginData) {
      return
    }

    const uCred = loginData.data
    const newWorkspaceName = `WD_${nanoid()}`

    setShowLoader(true)

    await client
      .post(apiURLs.registerUser, {
        user: {
          id: uCred.userId,
          name: sensitiveData.name,
          email: uCred.email,
          alias: sensitiveData.alias
        },
        workspaceName: newWorkspaceName
      })
      .then(async (d: any) => {
        const userDetails = {
          email: uCred.email,
          userID: uCred.userId,
          name: sensitiveData.name,
          alias: sensitiveData.alias
        }
        const { registrationInfo, ilinks, nodes, snippets } = d.data
        const workspaceDetails = { id: registrationInfo.id, name: registrationInfo.name }

        addUser({
          userID: userDetails.userID,
          email: userDetails.email,
          name: userDetails.name,
          alias: userDetails.alias
        })

        setILinks(ilinks)
        initSnippets(snippets)

        const contents = {}
        nodes.forEach((node) => {
          contents[node.id] = { ...node, type: 'editor' }
        })
        initContents(contents)
        setAuthenticated(userDetails, workspaceDetails)
        try {
          await refreshToken()
        } catch (error) {} // eslint-disable-line
      })
      .catch(console.error)

    await initPortals()

    if (vSign) {
      setRegistered(false)
    }
    setShowLoader(false)
    return vSign
  }

  return { login, logout, registerDetails, verifySignup, loginViaGoogle }
}

export const useInitializeAfterAuth = () => {
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const addUser = useUserCacheStore((s) => s.addUser)
  const initSnippets = useSnippetStore((store) => store.initSnippets)

  const { initPortals } = usePortals()
  const { refreshILinks } = useInternalLinks()
  const api = useApi()

  const initializeAfterAuth = async ({ data, loginStatus }: { data: UserCred; loginStatus: string }) => {
    try {
      setShowLoader(true)
      const { email } = data

      const { userDetails, workspaceDetails } = await client.get(apiURLs.getUserRecords).then((d: any) => {
        const userDetails = {
          email,
          alias: d.data.alias ?? d.data.properties?.alias ?? d.data.name,
          userID: d.data.id,
          name: d.data.name
        }
        // const userDetails = { email, userId: data.userId }
        const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }
        return { workspaceDetails, userDetails }
      })

      addUser({
        userID: userDetails.userID,
        email: userDetails.email,
        name: userDetails.name,
        alias: userDetails.alias
      })

      setAuthenticated(userDetails, workspaceDetails)

      const initialSnippets = await api.getAllSnippetsByWorkspace()
      initSnippets(initialSnippets)

      await initPortals()
      await refreshILinks()
    } catch (error) {
      mog('InitializeAfterAuthError', { error })
    } finally {
      setShowLoader(false)
    }
  }

  return { initializeAfterAuth }
}
