import { useAuthStore } from '../Hooks/useAuth'
import { useShortenerStore } from '../Hooks/useShortener'
import { useTagStore } from '../Hooks/useTags'
import { apiURLs } from '../routes'
import client from './fetchClient'

export const handleDwindleRequest = ({ requestMethod, URL, body }) => {
  if (requestMethod === 'POST') {
    return client
      .post(URL, body)
      .then((response) => {
        return { message: response, error: null }
      })
      .catch((err) => {
        return { message: null, error: err.response }
      })
  } else if (requestMethod === 'GET') {
    return client
      .get(URL)
      .then((response) => {
        return { message: response, error: null }
      })
      .catch((err) => {
        return { message: null, error: err.response }
      })
  }
}

export const handleActionRequest = ({ subType, data }) => {
  switch (subType) {
    case 'CREATE_SHORT_URL': {
      const authenticated = useAuthStore.getState().authenticated
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
