import { useAuthStore } from '../Hooks/useAuth'
import { useShortenerStore } from '../Hooks/useShortener'
import { useTagStore } from '../Hooks/useTags'
import { apiURLs } from '../routes'
import client from './fetchClient'

export const handleCaptureRequest = ({ subType, data }) => {
  switch (subType) {
    case 'CREATE_SHORT_URL': {
      // const authenticated = useAuthStore.getState().authenticated
      const authenticated = true
      if (!authenticated) return { message: null, error: 'Not Authenticated' }

      const body = data.body
      const workspaceDetails = useAuthStore.getState().workspaceDetails

      const addLinkCapture = useShortenerStore.getState().addLinkCapture
      const addTagsToGlobalStore = useTagStore.getState().addTags
      addTagsToGlobalStore(body.metadata.userTags)

      const reqBody = {
        ...body,
        namespace: workspaceDetails.name
      }

      console.log('Reqbody: ', reqBody)

      const URL = apiURLs.createShort
      return client
        .post(URL, reqBody)
        .then((response: any) => {
          addLinkCapture({
            ...reqBody,
            shortenedURL: response.data.message
          })
          return { message: response, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
    case 'CREATE_LINK_QC': {
      // const authenticated = useAuthStore.getState().authenticated
      const authenticated = true

      if (!authenticated) return { message: null, error: 'Not Authenticated' }

      const userDetails = useAuthStore.getState().userDetails

      const body = data.body
      const workspaceDetails = useAuthStore.getState().workspaceDetails

      const reqBody = {
        ...body,
        workspace: workspaceDetails.id,
        createdBy: userDetails.userId
      }

      const URL = apiURLs.addLinkCapture
      return client
        .post(URL, reqBody)
        .then((response: any) => {
          return { message: response, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
    case 'GET_CURRENT_WINDOW_TABS': {
      chrome.tabs
        .query({ currentWindow: true })
        .then((tabs) => {
          return { message: tabs, error: null }
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
    case 'remove-local-storage':
      chrome.browsingData.removeLocalStorage({ since: 0 })
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
    case 'remove-cookies':
      chrome.browsingData.removeCookies({ since: 0 })
      break
    case 'remove-history':
      chrome.browsingData.removeHistory({ since: 0 })
      break
    case 'remove-cache':
      chrome.browsingData.removeCache({ since: 0 })
      break
  }
}
