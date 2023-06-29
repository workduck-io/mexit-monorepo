import ky from 'ky'
import { type KyInstance } from 'ky/distribution/types/ky'
import { customAlphabet } from 'nanoid'
import ReconnectingWebSocket from 'reconnecting-websocket'

import {
  apiURLs,
  batchArray,
  batchArrayWithNamespaces,
  DefaultMIcons,
  Highlight,
  ILink,
  iLinksToUpdate,
  mog,
  runBatch,
  Snippets
} from '@mexit/core'

import { deserializeContent } from '../Utils/serializer'
import { WorkerRequestType } from '../Utils/worker'

import { exposeX } from './worker-utils'

const nolookalikes = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
const nanoid = customAlphabet(nolookalikes, 21)
const generateRequestID = () => `REQUEST_${nanoid()}`

let client: KyInstance
let wsClient: ReconnectingWebSocket

const initializeClient = (authToken: string, workspaceID: string) => {
  wsClient = new ReconnectingWebSocket(
    `wss://5bjjcc3nq3.execute-api.us-east-1.amazonaws.com/test?workspaceId=${workspaceID}&Authorizer=${authToken}`
  )

  const idToPortMap = {}
  const broadcastChannel = new BroadcastChannel('WebSocketChannel')

  // Let all connected contexts(tabs) know about state changes
  wsClient.onopen = () => {
    broadcastChannel.postMessage({
      type: 'WSState',
      data: {
        state: wsClient.readyState
      }
    })
  }
  wsClient.onclose = () =>
    broadcastChannel.postMessage({
      type: 'WSState',
      data: {
        state: wsClient.close
      }
    })

  // When we receive data from the server.
  wsClient.onmessage = ({ data }) => {
    console.log(data)
    // Construct object to be passed to handlers
    const parsedData = { data: JSON.parse(data), type: 'message' }
    if (!parsedData.data.from) {
      // Broadcast to all contexts(tabs). This is because
      // no particular id was set on the from field here.
      // We're using this field to identify which tab sent
      // the message
      broadcastChannel.postMessage(parsedData)
    } else {
      // Get the port to post to using the uuid, ie send to
      // expected tab only.
      idToPortMap[parsedData.data.from].postMessage(parsedData)
    }
  }

  client = ky.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          if (request && request.headers && authToken && workspaceID) {
            request.headers.set('Authorization', `Bearer ${authToken}`)
            request.headers.set('mex-workspace-id', workspaceID)
            request.headers.set('wd-request-id', request.headers['wd-request-id'] ?? generateRequestID())
          }
        }
      ]
    }
  })
}

const reset = () => {
  client = null
}

const getMultipleNodeAPI = async (nodeids: string[], namespaceID?: string) => {
  if (nodeids.length === 0) return

  const url = apiURLs.node.getMultipleNode(namespaceID)
  return client
    .post(url, { json: { ids: nodeids } })
    .then((d) => d.json())
    .then((res: any) => {
      if (res) {
        if (res.failed.length > 0) mog('Failed API Requests: ', { url, ids: res.failed })
        return { rawResponse: res.successful, nodeids }
      }
    })
}

const getMultipleSharedNodeAPI = async (nodeids: string[]) => {
  if (nodeids.length === 0) return

  const url = apiURLs.share.getBulk
  return client
    .post(url, { json: { ids: nodeids } })
    .then((d) => d.json())
    .then((res: any) => {
      if (res) {
        if (res.failed.length > 0) mog('Failed API Requests: ', { url, ids: res.failed })
        return { rawResponse: res.successful, nodeids }
      }
    })
}

const getMultipleSnippetAPI = async (ids: string[]) => {
  if (ids.length === 0) return

  const url = apiURLs.snippet.bulkGet
  return client
    .post(url, { json: { ids: ids } })
    .then((d) => d.json())
    .then((res: any) => {
      if (res) {
        if (res.failed.length > 0) mog('Failed API Requests: ', { url, ids: res.failed })
        return res.successful
      }
    })
}

const runBatchWorker = async (requestType: WorkerRequestType, batchSize = 6, args: any) => {
  const requestsToMake: Promise<any>[] = []
  switch (requestType) {
    case WorkerRequestType.GET_NODES: {
      // Args is of type Record<string, string[][]>
      Object.entries<string[][]>(args).forEach(([nsID, batches]) => {
        if (nsID === 'NOT_SHARED') batches.forEach((b) => requestsToMake.push(getMultipleNodeAPI(b)))
        else batches.forEach((b) => requestsToMake.push(getMultipleNodeAPI(b, nsID)))
      })
      break
    }

    case WorkerRequestType.GET_ARCHIVED_NODES: {
      args.forEach((i) => requestsToMake.push(getMultipleNodeAPI(i)))
      break
    }

    case WorkerRequestType.GET_SHARED_NODES: {
      args.forEach((i) => requestsToMake.push(getMultipleSharedNodeAPI(i)))
      break
    }

    case WorkerRequestType.GET_SNIPPETS: {
      args.forEach((i) => requestsToMake.push(getMultipleSnippetAPI(i)))
      break
    }
  }

  const res = await runBatch(requestsToMake, batchSize)
  return res
}

const initializeNamespacesExtension = async (localILinks: ILink[]) => {
  const namespaces = await client
    .get(apiURLs.namespaces.getAll())
    .then((d) => d.json())
    .then((d: any) => {
      return d.map((item: any) => {
        return {
          ns: {
            id: item.id,
            name: item.name,
            icon: item.metadata?.icon ?? undefined,
            access: item.accessType,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            granterID: item.granterID ?? undefined,
            publicAccess: item.publicAccess
          },
          nodeHierarchy: item.nodeHierarchy.map((i) => ({
            ...i,
            namespace: item.id,
            icon: i.icon ?? DefaultMIcons.NOTE
          })),
          archiveNodeHierarchy: item.archiveNodeHierarchy.map((i) => ({ ...i, namespace: item.id }))
        }
      })
    })
    .catch((e) => {
      mog('Error fetching all namespaces', { e })
      return undefined
    })

  if (namespaces) {
    const newILinks = namespaces.reduce((arr, { nodeHierarchy }) => {
      return [...arr, ...nodeHierarchy]
    }, [])

    const archivedILinks = namespaces.reduce((arr, { archiveNodeHierarchy }) => {
      return [...arr, ...archiveNodeHierarchy]
    }, [])

    // mog('update namespaces and ILinks From Extension', { namespaces, newILinks, archivedILinks })
    // SetILinks once middleware is integrated
    const ns = namespaces.map((n) => n.ns)

    const { toUpdateLocal } = iLinksToUpdate(localILinks, newILinks)

    const ids = batchArrayWithNamespaces(toUpdateLocal, ns, 10)

    const response = await runBatchWorker(WorkerRequestType.GET_NODES, 6, ids)
    return { response, ns, newILinks, archivedILinks }
  }

  return { response: [], ns: [], newILinks: [], archivedILinks: [] }
}

const getSnippet = (id: string, snippets: Snippets) => {
  return snippets?.[id]
}

const initializeSnippetsExtension = async (localSnippets: Snippets) => {
  const data = await client
    .get(apiURLs.snippet.getAllSnippetsByWorkspace)
    .then((d) => d.json())
    .then((d: any) => {
      const newSnippets = d.filter((snippet) => {
        const existSnippet = getSnippet(snippet.snippetID, localSnippets)
        return existSnippet === undefined
      })

      return newSnippets
    })
    .then(async (newSnippets: any) => {
      const toUpdateSnippets = newSnippets?.map((item) => item.snippetID)
      // mog('NewSnippets', { newSnippets, toUpdateSnippets })

      if (toUpdateSnippets && toUpdateSnippets.length > 0) {
        const ids = batchArray(toUpdateSnippets, 10)
        if (ids && ids.length > 0) {
          try {
            const res = await runBatchWorker(WorkerRequestType.GET_SNIPPETS, 6, ids)
            return { newSnippets, response: res }
          } catch (error) {
            mog('SnippetsWorkerError', { error })
          }
        }
      }
      return { response: [] }
    })
    .catch((error) => {
      mog('Error fetching all Snippets', { error })
      return undefined
    })

  return data
}

const initializeLinksExtension = async () => {
  return await client
    .get(apiURLs.links.getAllLinks)
    .then((d) => d.json())
    .catch((error) => {
      mog('InitLinksError', { error })
      return undefined
    })
}

const initializeHighlightsExtension = async () => {
  return await client
    .get(apiURLs.highlights.all)
    .then((d) => d.json())
    .then((d: any) => {
      const highlights =
        d?.map((item) => {
          if (item?.properties?.content) {
            const content = deserializeContent(item.properties.content)
            item.properties.content = content
          }

          return {
            properties: item?.properties,
            entityId: item?.entityRefID,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt
          } as Highlight
        }) ?? []

      return highlights
    })
    .catch((error) => {
      mog('InitHighlightsError', { error })
      return undefined
    })
}

const initializeSmartCapturesExtension = async () => {
  return await client
    .get(apiURLs.smartcapture.public)
    .then((d) => d.json())
    .catch((error) => {
      mog('InitSmartCaptureError', { error })
      return undefined
    })
}

const functions = {
  initializeClient,
  reset,
  runBatchWorker,
  initializeNamespacesExtension,
  initializeSnippetsExtension,
  initializeHighlightsExtension,
  initializeLinksExtension,
  initializeSmartCapturesExtension
}

export type RequestsWorkerInterface = typeof functions
exposeX(functions)
