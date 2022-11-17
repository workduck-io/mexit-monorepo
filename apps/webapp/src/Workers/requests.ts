import axios from 'axios'
import { customAlphabet } from 'nanoid'
import { expose } from 'threads/worker'

import { apiURLs, mog, runBatch } from '@mexit/core'

import { WorkerRequestType } from '../Utils/worker'

const nolookalikes = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
const nanoid = customAlphabet(nolookalikes, 21)
const generateRequestID = () => `REQUEST_${nanoid()}`

const client = axios.create()

const initializeClient = (authToken: string, workspaceID: string) => {
  client.interceptors.request.use((request) => {
    if (authToken && workspaceID) {
      request.headers['Authorization'] = `Bearer ${authToken}`
      request.headers['wd-request-id'] = request.headers['wd-request-id'] ?? generateRequestID()
      request.headers['mex-workspace-id'] = workspaceID
    }
    return request
  })
}

const getMultipleNodeAPI = async (nodeids: string[], namespaceID?: string) => {
  if (nodeids.length === 0) return
  if (nodeids.length === 1) {
    return client.get(apiURLs.node.get(nodeids[0])).then((d) => {
      if (d) return { rawResponse: [d.data], nodeids }
    })
  }

  const url = apiURLs.node.getMultipleNode(namespaceID)
  return client.post(url, { ids: nodeids }).then((d) => {
    if (d) {
      if (d.data.failed.length > 0) mog('Failed API Requests: ', { url, ids: d.data.failed })
      return { rawResponse: d.data.successful, nodeids }
    }
  })
}

const getMultipleSharedNodeAPI = async (nodeids: string[]) => {
  if (nodeids.length === 0) return
  if (nodeids.length === 1) {
    return client.get(apiURLs.share.getSharedNode(nodeids[0])).then((d) => {
      if (d) return { rawResponse: [d.data], nodeids }
    })
  }

  const url = apiURLs.share.getBulk
  return client.post(url, { ids: nodeids }).then((d) => {
    if (d) {
      if (d.data.failed.length > 0) mog('Failed API Requests: ', { url, ids: d.data.failed })
      return { rawResponse: d.data.successful, nodeids }
    }
  })
}

const getMultipleSnippetAPI = async (ids: string[]) => {
  if (ids.length === 0) return
  if (ids.length === 1) {
    return client.get(apiURLs.snippet.getById(ids[0])).then((d) => {
      if (d) return [d.data]
    })
  }

  const url = apiURLs.snippet.bulkGet
  return client.post(url, { ids: ids }).then((d: any) => {
    if (d) {
      if (d.data.failed.length > 0) mog('Failed API Requests: ', { url, ids: d.data.failed })
      return d.data.successful
    }
  })
}

const runBatchWorker = async (requestType: WorkerRequestType, batchSize = 6, args: string[] | string[][]) => {
  const requestsToMake: Promise<any>[] = []

  switch (requestType) {
    case WorkerRequestType.GET_NODES: {
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

expose({ initializeClient, runBatchWorker })
