import axios from 'axios'
import { customAlphabet } from 'nanoid'
import { expose } from 'threads/worker'

import { apiURLs, runBatch, mog, extractMetadata } from '@mexit/core'

import { deserializeContent } from '../Utils/serializer'

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

const getNodeAPI = async (nodeid: string) => {
  const url = apiURLs.getNode(nodeid)
  return client
    .get(url, {
      headers: {}
    })
    .then((d: any) => {
      if (d) {
        return { rawResponse: d.data, nodeid }
      }
    })
    .catch((e) => {
      console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
    })
}

enum RequestType {
  'GET_NODE' = 'GET_NODE'
}

const runBatchWorker = async (requestType: RequestType, batchSize = 6, args: string[]) => {
  const requestsToMake: Promise<any>[] = []

  switch (requestType) {
    case RequestType.GET_NODE: {
      args.forEach((i) => requestsToMake.push(getNodeAPI(i)))
      break
    }
  }

  const res = await runBatch(requestsToMake, batchSize)
  return res
}

expose({ initializeClient, runBatchWorker })
