import { apiURLs, defaultContent } from '@mexit/core'
import client from './fetchClient'
import { Tab } from '../Types/Tabs'
import { serializeContent } from './serializer'

export const handleCaptureRequest = ({ subType, data }) => {
  switch (subType) {
    case 'BULK_CREATE_NODE': {
      const URL = apiURLs.createNode
      const elementMetadata = data.metadata.saveableRange
        ? {
            saveableRange: data.metadata?.saveableRange,
            sourceUrl: data.metadata?.sourceUrl
          }
        : undefined
      const reqData = {
        id: data.id,
        title: data.title,
        data: serializeContent(data.content ?? defaultContent.content, data.id, elementMetadata)
      }

      if (data.referenceID) {
        reqData['referenceID'] = data.referenceID
      }

      return client
        .post(URL, reqData, {
          headers: {
            'mex-workspace-id': data.workspaceID
          }
        })
        .then((response: any) => {
          return { message: response.data, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
  }
}

export const handleActionRequest = (request: any) => {
  const event_name = request.data.event_name
  switch (event_name) {
    case 'reload':
      chrome.tabs.reload()
      break
    case 'chrome-url':
      chrome.tabs.create({ url: request.data.base_url })
      break
  }
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
    case 'GET_CURRENT_TAB': {
      return chrome.tabs
        .query({ currentWindow: true , active: true})
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
    case 'OPEN_WITH_NEW_TABS': {
      return chrome.tabs
        .create({
          url: data.urls
        })
        .then((response) => {
          return { message: response, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }

    // TODO: complete this
    case 'MEX_USER': {
      const URL = apiURLs.getUserByLinkedin

      return client
        .post(URL, data.body)
        .then((response: any) => {
          return { message: response, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
    case 'CAPTURE_VISIBLE_TAB': {
      return chrome.tabs
        .captureVisibleTab()
        .then((img) => {
          const parsedImage = img.split(',')[1]
          return client
            .post(
              apiURLs.createImageLink,
              {
                encodedString: parsedImage
              },
              {
                headers: {
                  'workspace-id': data.workspaceId
                }
              }
            )
            .then((resp) => resp.data)
            .then((path) => {
              return { message: apiURLs.getImagePublicLink(path), error: null }
            })
            .catch((error) => {
              return { message: null, error: error }
            })
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
  }
}
