import { apiURLs, defaultContent, ListItemType } from '@mexit/core'

import { Tab } from '../Types/Tabs'
import client from './fetchClient'
import { serializeContent } from './serializer'

export const handleCaptureRequest = ({ subType, data }) => {
  switch (subType) {
    case 'SAVE_NODE': {
      const elementMetadata = data.metadata?.saveableRange
        ? {
            saveableRange: data.metadata?.saveableRange,
            sourceUrl: data.metadata?.sourceUrl
          }
        : undefined
      const reqData = {
        id: data.id,
        title: data.title,
        data: serializeContent(data.content ?? defaultContent.content, data.id, elementMetadata),
        referenceID: data.referenceID,
        namespaceID: data.namespaceID
      }

      return client
        .post(apiURLs.node.create, reqData, {
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
    case 'BULK_CREATE_NODES': {
      const elementMetadata = data.metadata?.saveableRange
        ? {
            saveableRange: data.metadata?.saveableRange,
            sourceUrl: data.metadata?.sourceUrl
          }
        : undefined
      const reqData = {
        id: data.id,
        nodePath: {
          path: data.path,
          namespaceID: data.namespaceID
        },
        title: data.title,
        data: serializeContent(data?.content ?? defaultContent, data.id, elementMetadata),
        // TODO: replace this with DEFAULT_NAMESPACE constant (added in another PR)
        namespaceID: data.namespaceID,
        tags: []
      }
      return client
        .post(apiURLs.node.bulkCreate, reqData, {
          headers: {
            'mex-workspace-id': data.workspaceID
          }
        })
        .then((response) => {
          return { message: response.data, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
  }
}

export const handleActionRequest = (request: ListItemType) => {
  const event_name = request?.extras.event_name
  switch (event_name) {
    case 'reload':
      chrome.tabs.reload()
      break
    case 'chrome-url':
      chrome.tabs.create({ url: request.extras.base_url })
      break
  }
}

export const handleSharingRequest = ({ subType, body, headers }) => {
  switch (subType) {
    case 'MAKE_PUBLIC': {
      return client
        .patch(apiURLs.node.makePublic(body?.nodeId), null, {
          withCredentials: false,
          headers: headers
        })
        .then((response) => {
          return { message: body?.nodeId, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
    case 'MAKE_PRIVATE': {
      return client
        .patch(apiURLs.node.makePrivate(body?.nodeId), null, {
          withCredentials: false,
          headers: headers
        })
        .then((response) => {
          return { message: body?.nodeId, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
  }
}

export const handleHighlightRequest = ({ subType, body, headers }) => {
  switch (subType) {
    case 'ADD_HIGHLIGHT': {
      return client
        .post(apiURLs.highlights.saveHighlight, body, { headers: headers })
        .then((d: any) => {
          return { message: d.data, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
    case 'DELETE_HIGHLIGHT': {
      return client
        .delete(apiURLs.highlights.byId(body?.highlightId), { headers: headers })
        .then((d: any) => {
          return { message: d.data, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
  }
}

export const handleShortenerRequest = ({ subType, body, headers }) => {
  switch (subType) {
    case 'GET_ALL_LINKS': {
      return client
        .get(apiURLs.links.getLinks, {
          headers: headers
        })
        .then((d: any) => {
          return { message: d.data, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
    case 'SAVE_LINK': {
      return client
        .post(apiURLs.links.saveLink, body, {
          headers: headers
        })
        .then((d: any) => {
          return { message: d.data, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
    case 'DELETE_LINK': {
      return client
        .delete(apiURLs.links.deleteLink(body.hashedURL), {
          headers: headers
        })
        .then((d: any) => {
          return { message: d, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
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

    // TODO: complete this
    case 'MEX_USER': {
      const URL = apiURLs.user.getUserByLinkedin

      return client
        .post(URL, data.body)
        .then((response: any) => {
          return { message: response, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }

    /**
     * Action captures the current tab screenshot and returns the base64 encoded image
     */
    case 'CAPTURE_VISIBLE_TAB': {
      return chrome.tabs
        .captureVisibleTab()
        .then((img) => {
          // const parsedImage = img.split(',')[1]
          // mog('MOG_IMAGE', { imgBase64: parsedImage })
          return { message: img, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }

    /**
     * Action uploads the image to the server and returns the public link
     * data should be base64 encoded string of screenshot without the frontmatter
     */
    case 'UPLOAD_IMAGE': {
      return client
        .post(
          apiURLs.misc.createImageLink,
          { encodedString: data.base64 },
          {
            headers: { 'workspace-id': data.workspaceId }
          }
        )
        .then((resp) => resp.data)
        .then((path: string) => {
          return { message: apiURLs.misc.getImagePublicLink(path), error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
  }
}
