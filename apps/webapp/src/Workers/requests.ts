import ky from 'ky'
import { type KyInstance } from 'ky/distribution/types/ky'
import { customAlphabet } from 'nanoid'

import { exposeShared } from '@workduck-io/mex-threads.js/worker'

import { apiURLs, mog, runBatch } from '@mexit/core'

import { WorkerRequestType } from '../Utils/worker'

const nolookalikes = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
const nanoid = customAlphabet(nolookalikes, 21)
const generateRequestID = () => `REQUEST_${nanoid()}`

let client: KyInstance

const initializeClient = (authToken: string, workspaceID: string) => {
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

const getMultipleNodeAPI = async (nodeids: string[], namespaceID?: string) => {
  if (nodeids.length === 0) return
  if (nodeids.length === 1) {
    return client
      .get(apiURLs.node.get(nodeids[0]))
      .then((d) => d.json())
      .then((res) => {
        if (res) return { rawResponse: [res], nodeids }
      })
  }

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
  if (nodeids.length === 1) {
    return client
      .get(apiURLs.share.getSharedNode(nodeids[0]))
      .then((d) => d.json())
      .then((res) => {
        if (res) return { rawResponse: [res], nodeids }
      })
  }

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
  if (ids.length === 1) {
    return client
      .get(apiURLs.snippet.getById(ids[0]))
      .then((d) => d.json())
      .then((res) => {
        if (res) return [res]
      })
  }

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

const functions = { initializeClient, runBatchWorker }

export type RequestsWorkerInterface = typeof functions
exposeShared(functions)
