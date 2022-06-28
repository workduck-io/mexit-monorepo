import React, { useState, useEffect } from 'react'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuth, client } from '@workduck-io/dwindle'
import { nanoid } from 'nanoid'
import { clear as IDBClear } from 'idb-keyval'

import { apiURLs, AuthStoreState, Snippet, UserCred } from '@mexit/core'
import { RegisterFormData } from '@mexit/core'
import { authStoreConstructor } from '@mexit/core'
import { useApi } from '../Hooks/useApi'
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
  const api = useApi()

  const clearRequests = useApiStore().clearRequests
  const resetDataStore = useDataStore().resetDataStore
  const resetPublicNodes = usePublicNodeStore().reset
  const clearRecents = useRecentsStore().clear
  const clearReminders = useReminderStore().clearReminders
  const clearTodos = useTodoStore().clearTodos
  const { initPortals } = usePortals()

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

    setShowLoader(true)

    if (getWorkspace && data !== undefined) {
      await client
        .get(apiURLs.getUserRecords)
        .then((d: any) => {
          const userDetails = { email, userId: data.userId }
          const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }

          setAuthenticated(userDetails, workspaceDetails)
        })
        .then(() =>
          api.getAllSnippetsByWorkspace().then((res: any[]) => {
            initSnippets(
              res.map((item) => ({
                icon: 'ri:quill-pen-line',
                id: item.snippetID,
                title: item.title
              }))
            )
          })
        )
        .catch((e) => {
          console.error({ e })
          return e.toString() as string
        })
      await initPortals()
    }
    setShowLoader(false)
    return { data, v }
  }

  const loginViaGoogle = async (code: string, clientId: string, redirectURI: string, getWorkspace = true) => {
    try {
      const result: any = await googleSignIn(code, clientId, redirectURI)
      console.log(`Result of Login: ${JSON.stringify(result)}`)

      if (getWorkspace && result.userCred !== undefined) {
        await client
          .get(apiURLs.getUserRecords)
          .then(async (d: any) => {
            const userDetails = { email: result.userCred.email, userId: result.userCred.userId }
            const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }

            setAuthenticated(userDetails, workspaceDetails)
          })
          .catch(async (error) => {
            setShowLoader(true)
            if (error.response && error.response.status === 404) {
              await registerUserForGoogle(result)
            }
          })

        await initPortals()
      }
      setShowLoader(false)
      return result
    } catch (error) {
      setShowLoader(false)
      console.log(error)
    }
  }

  async function registerUserForGoogle(result: any) {
    setShowLoader(true)
    setSensitiveData({ email: result.userCred.email, name: result.userCred.username, password: '', roles: [] })

    const uCred: UserCred = {
      email: result.userCred.email,
      userId: result.userCred.userId,
      expiry: result.userCred.expiry,
      token: result.userCred.token,
      url: result.userCred.url
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
        const userDetails = { email: uCred.email, userId: uCred.userId }
        const { registrationInfo, ilinks, nodes, snippets } = d.data
        const workspaceDetails = { id: registrationInfo.id, name: registrationInfo.name }

        setILinks(ilinks)
        initSnippets(snippets)

        const contents = {}
        nodes.forEach((node) => {
          contents[node.id] = { ...node, type: 'Node' }
        })
        initContents(contents)
        setAuthenticated(userDetails, workspaceDetails)
        try {
          await refreshToken()
        } catch (error) {} // eslint-disable-line
      })
      .catch(console.error)

    await initPortals()

    setShowLoader(false)
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
      roles: sensitiveData.roles.reduce((prev, cur) => `${prev},${cur.value}`, '').slice(1)
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
          name: uCred.email,
          email: uCred.email
        },
        workspaceName: newWorkspaceName
      })
      .then(async (d: any) => {
        const userDetails = { email: uCred.email, userId: uCred.userId }
        const { registrationInfo, ilinks, nodes, snippets } = d.data
        const workspaceDetails = { id: registrationInfo.id, name: registrationInfo.name }

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
