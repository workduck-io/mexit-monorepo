import axios from 'axios'
import { customAlphabet } from 'nanoid'
import { expose } from 'threads/worker'

import { apiURLs, runBatch } from '@mexit/core'

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

const getNodeAPI = async (nodeid: string, isShared = false) => {
  const url = isShared ? apiURLs.share.getSharedNode(nodeid) : apiURLs.node.get(nodeid)
  return client.get(url).then((d: any) => {
    if (d) {
      return { rawResponse: d.data, nodeid }
    }
  })
}

const getMultipleNodeAPI = async (nodeids: string) => {
  const url = apiURLs.node.getMultipleNode
  return client.post(url, { ids: nodeids.split(',') }).then((d) => {
    if (d) {
      return { rawResponse: d.data, nodeids }
    }
  })
}

const getMultipleSnippetAPI = async (ids: string) => {
  const url = apiURLs.snippet.bulkGet
  return client.post(url, { ids: ids.split(',') }).then((d) => d.data)
}

const runBatchWorker = async (requestType: WorkerRequestType, batchSize = 6, args: string[]) => {
  const requestsToMake: Promise<any>[] = []

  switch (requestType) {
    case WorkerRequestType.GET_NODES: {
      args.forEach((i) => requestsToMake.push(getMultipleNodeAPI(i)))
      break
    }

    case WorkerRequestType.GET_SHARED_NODES: {
      args.forEach((i) => requestsToMake.push(getNodeAPI(i, true)))
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
