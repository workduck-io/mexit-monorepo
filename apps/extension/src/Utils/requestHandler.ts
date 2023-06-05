import ky from 'ky'

import { AIEvent, apiURLs, DEFAULT_NAMESPACE, defaultContent, ListItemType, mog } from '@mexit/core'

import { Tab } from '../Types/Tabs'

import client, { getAuthStateFromChrome, setAuthStateChrome } from './fetchClient'
import { deserializeContent, serializeContent } from './serializer'

export const handleCaptureRequest = ({ subType, data }) => {
  const elementMetadata = data?.highlightId
    ? {
        type: 'highlightV1' as const,
        id: data.highlightId
      }
    : undefined
  switch (subType) {
    case 'SAVE_NODE': {
      // We need the highlightid to add to the highlighted elementMetadata
      const reqData = {
        id: data.id,
        title: data.title,
        data: serializeContent(data.content ?? defaultContent.content, data.id, elementMetadata),
        referenceID: data.referenceID,
        namespaceID: data.namespaceID
      }

      return client
        .post(apiURLs.node.create, {
          headers: {
            'mex-workspace-id': data.workspaceID
          },
          json: reqData
        })
        .json()
        .then((response: any) => {
          return { message: { ...response, content: deserializeContent(reqData.data) }, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }

    case 'BULK_CREATE_NODES': {
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
        .post(apiURLs.node.bulkCreate, {
          json: reqData,
          headers: {
            'mex-workspace-id': data.workspaceID
          }
        })
        .json()
        .then((response: any) => {
          return { message: { ...response, content: deserializeContent(reqData.data) }, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
  }
}

export const handlePerformAIRequest = async ({ data, workspaceId }) => {
  return await client
    .post(apiURLs.openAi.perform, {
      json: data,
      headers: {
        'mex-workspace-id': workspaceId
      }
    })
    .json()
    .then((event: AIEvent) => {
      return { message: event, error: null }
    })
    .catch((error) => {
      return { message: null, error: error }
    })
}

export const handleSnippetRequest = ({ data }) => {
  const reqData = {
    id: data.id,
    type: 'SnippetRequest',
    title: data.title,
    namespaceIdentifier: DEFAULT_NAMESPACE,
    data: serializeContent(data.content ?? defaultContent.content, data.snippetId),
    template: data.template
  }

  return client
    .post(apiURLs.snippet.create, {
      json: reqData,
      headers: {
        'mex-workspace-id': data.workspaceId
      }
    })
    .json()
    .then((response: any) => {
      return { message: response, error: null }
    })
    .catch((err) => {
      return { message: null, error: err }
    })
}

export const handleNodeContentRequest = ({ subType, body, headers }) => {
  switch (subType) {
    case 'DELETE_BLOCKS': {
      const blockMap = body?.blockMap
      const reqData = {
        type: 'DeleteBlocksRequest',
        data: blockMap
      }

      return client
        .patch(apiURLs.node.deleteBlock, {
          json: blockMap,
          headers: headers
        })
        .json()
        .then((response: any) => {
          return { message: response, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
    case 'APPEND_NODE': {
      const elementMetadata = body?.highlightId
        ? {
            type: 'highlightV1' as const,
            id: body.highlightId
          }
        : undefined
      const reqData = {
        type: 'ElementRequest',
        workspaceID: body.workspaceID,
        elements: serializeContent(body.content ?? defaultContent.content, body.id, elementMetadata)
      }

      mog('SAVE REQUEST', { reqData, elementMetadata })

      return client
        .patch(apiURLs.node.append(body.id), {
          json: reqData,
          headers: {
            'mex-workspace-id': body.workspaceID
          }
        })
        .json()
        .then((response: any) => {
          return { message: { content: deserializeContent(reqData.elements) }, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
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
        .patch(apiURLs.node.makePublic(body?.nodeId), { headers: headers })
        .json()
        .then((response) => {
          return { message: body?.nodeId, error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
    case 'MAKE_PRIVATE': {
      return client
        .patch(apiURLs.node.makePrivate(body?.nodeId), {
          headers: headers
        })
        .json()
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
        .post(apiURLs.highlights.saveHighlight, { json: body, headers: headers })
        .json()
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
        .json()
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
        .json()
        .then((d: any) => {
          return { message: d.data, error: null }
        })
        .catch((err) => {
          return { message: null, error: err }
        })
    }
    case 'SAVE_LINK': {
      return client
        .post(apiURLs.links.saveLink, {
          headers: headers,
          json: body
        })
        .json()
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

const _refreshTokenHook = (state) => async (request, _, response) => {
  if (response && response.status === 401) {
    try {
      const res = await client.get(apiURLs.calendar.getGoogleCalendarNewToken).json()
      setAuthStateChrome({ ...state, accessToken: res })
    } catch (error) {
      throw new Error(error)
    }
  }

  return
}

export const handleAsyncCalendarRequest = async ({ subType, data }) => {
  switch (subType) {
    case 'GET_AUTH':
      return await client
        .get(apiURLs.calendar.getAuth)
        .json()
        .then((res: any) => {
          if (res) {
            const userId = res.userId
            const token = res.actionAuth?.token?.[userId]?.accessToken

            if (token) {
              return { message: token, error: null }
            }
          }
        })
        .catch((err) => {
          console.error('Unable to fetch calendar', err)
          return {
            message: null,
            error: 'Unable to fetch auth token'
          }
        })
    case 'GET_EVENTS':
      // eslint-disable-next-line no-case-declarations
      const state = await getAuthStateFromChrome('mexit-calendars-extension')
      return await ky
        .get(data.url, {
          hooks: {
            beforeRequest: [(request) => request.headers.set('authorization', `Bearer ${state.tokens['GOOGLE_CAL']}`)],
            afterResponse: [_refreshTokenHook(state)]
          },
          timeout: 20000,
          retry: 0
        })
        .json()
        .then((d: any) => {
          return { message: d, error: null }
        })
        .catch((err) => {
          console.error('Unable to fetch calendar', err)
          return {
            message: null,
            error: 'Unable to fetch calendar events'
          }
        })
    case 'REFRESH_GOOGLE_CALENDAR_TOKEN': {
      return client
        .get(apiURLs.calendar.getGoogleCalendarNewToken)
        .json()
        .then((d: any) => {
          return { message: d.data, error: null }
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
      const URL = apiURLs.user.getUserByLinkedin(data.body)

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
        .post(apiURLs.misc.createImageLink, {
          json: { encodedString: data.base64 },
          headers: { 'mex-workspace-id': data.workspaceId }
        })
        .json()
        .then((path: string) => {
          return { message: apiURLs.misc.getImagePublicLink(path), error: null }
        })
        .catch((error) => {
          return { message: null, error: error }
        })
    }
  }
}
