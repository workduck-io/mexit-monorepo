import { nanoid } from 'nanoid'

import { useAuthStore } from '../Hooks/useAuth'
import { useShortenerStore } from '../Hooks/useShortener'
import { useTagStore } from '../Hooks/useTags'
import { apiURLs } from '../routes'
import client from './fetchClient'
import { Tab } from '../Types/Tabs'

export const handleCaptureRequest = ({ subType, data }) => {
  switch (subType) {
    case 'CREATE_CONTENT_QC': {
      const URL = apiURLs.addContentCapture
      const reqBody = data.body

      return client
        .post(URL, reqBody)
        .then((response: any) => {
          return { message: response, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
  }
}

export const handleStoreRequest = ({ subType, data }) => {
  switch (subType) {
    case 'GET_ITEM': {
      const res = localStorage.getItem(data.key)
      return { value: res }
    }
    case 'SET_ITEM': {
      localStorage.setItem(data.key, data.value)
      return
    }
    case 'REMOVE_ITEM': {
      localStorage.removeItem(data.key)
      return
    }
    case 'CLEAR_STORE': {
      localStorage.clear()
      return
    }
  }
}

export const handleAuthRequest = (data: any) => {
  const authenticated = useAuthStore.getState().authenticated
  let userDetails: any, workspaceDetails: any
  if (authenticated) {
    userDetails = useAuthStore.getState().userDetails
    workspaceDetails = useAuthStore.getState().workspaceDetails
  }

  return { authenticated, userDetails, workspaceDetails }
}

export const handleActionRequest = (request: any) => {
  const event_name = request.data.event_name
  switch (event_name) {
    case 'reload':
      chrome.tabs.reload()
      break
    case 'browser-search':
      chrome.search.query(
        {
          disposition: 'NEW_TAB',
          text: request.data.query
        },
        () => {} // eslint-disable-line @typescript-eslint/no-empty-function
      )
      break
    case 'chrome-url':
      chrome.tabs.create({ url: request.data.base_url })
      break
  }
}
export const handleEditorSaveRequest = (data: any) => {
  return console.log('nothing')
}

export const handleAsyncActionRequest = ({ subType, data }) => {
  switch (subType) {
    case 'GET_CURRENT_WINDOW_TABS': {
      return chrome.tabs
        .query({ currentWindow: true })
        .then((tabs) => {
          const res = []
          tabs.forEach((tab) => {
            const t: Tab = {
              id: tab.id,
              title: tab.title,
              windowId: tab.windowId,
              url: tab.url,
              status: tab.status,
              incognito: tab.incognito,
              pinned: tab.pinned
            }
            res.push(t)
          })
          return { message: res, error: null }
        })
        .catch((err) => {
          console.error('Error in getting current tabs: ', err)
          return { message: null, error: err }
        })
    }

    case 'OPEN_WINDOW_WITH_TABS': {
      return chrome.windows
        .create({
          focused: true,
          url: data.urls
        })
        .then((response) => {
          return { message: response, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
    case 'GET_LIBRE_TRANSLATE': {
      return fetch('https://libretranslate.com/translate', {
        method: 'POST',
        body: data.body
      })
        .then((resp) => resp.json())
        .then((val) => {
          return { message: val.translatedText, error: null }
        })
        .catch((error) => {
          return { error: error, message: null }
        })
    }
    case 'GET_CURRENCY_CONVERSION': {
      const params = data.params
      const url = new URL('https://api.frankfurter.app/latest')
      url.search = new URLSearchParams(params).toString()
      return fetch(url.toString())
        .then((resp) => resp.json())
        .then((val) => {
          const conv = val.rates[params.to]
          return { message: conv, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
  }
}
