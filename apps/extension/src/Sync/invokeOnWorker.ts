import { Indexes, ISearchQuery, IUpdateDoc } from '@workduck-io/mex-search'

import { ILink, PersistentData, Snippets } from '@mexit/core'

import { childIframe } from './iframeConnector'

export const wSearchIndex = async (key: Indexes, query: ISearchQuery, tags?: Array<string>) => {
  if (childIframe) {
    return await childIframe.searchIndex(key, query, tags)
  }
}

export const wSearchIndexByNodeId = async (key: Indexes, nodeID: string, query: string) => {
  if (childIframe) {
    return childIframe.searchIndexByNodeId(key, nodeID, query)
  }
}

export const wSearchIndexWithRanking = async (key: Indexes, query: ISearchQuery) => {
  if (childIframe) {
    return await childIframe.searchIndexWithRanking(key, query)
  }
}

export const uploadImageToCDN = async (base64: string): Promise<string> => {
  if (childIframe) return childIframe.uploadImageToCDN(base64)
}

export const startSearchWorker = async (): Promise<void> => {
  if (childIframe) return childIframe.startSearchWorker()
}

export const getSearchIndexInitState = async (): Promise<boolean> => {
  if (childIframe) return childIframe.getSearchIndexInitState()
}

export const initSearchIndex = async (fileData: Partial<PersistentData>) => {
  if (childIframe) return childIframe.initSearchIndex(fileData)
}

export const initRequestClient = async (token: string, workspaceID: string) => {
  if (childIframe) return childIframe.initRequestClient(token, workspaceID)
}

export const wInitNamespaces = async (localILinks: ILink[]) => {
  if (childIframe) return childIframe.initNamespacesExtension(localILinks)
}

export const wInitSnippets = async (localSnippets: Snippets) => {
  if (childIframe) return childIframe.initSnippetsExtension(localSnippets)
}

export const startRequestsWorkerService = async () => {
  if (childIframe) return childIframe.startRequestsWorkerService()
}

export const wAddDoc = async (doc: IUpdateDoc) => {
  if (childIframe) return childIframe.addDoc(doc)
}

export const wUpdateDoc = async (doc: IUpdateDoc) => {
  if (childIframe) return childIframe.updateDoc(doc)
}

export const wUpdateOrAppendBlocks = async (doc: IUpdateDoc) => {
  if (childIframe) return childIframe.updateOrAppendBlocks(doc)
}

export const wRemoveDoc = async (key: Indexes, id: string) => {
  if (childIframe) return childIframe.removeDoc(key, id)
}

export const wInitHighlights = async () => {
  if (childIframe) return childIframe.initHighlightsExtension()
}

export const wInitLinks = async () => {
  if (childIframe) return childIframe.initLinksExtension()
}

export const wInitSmartCaptures = async () => {
  if (childIframe) return childIframe.initSmartCapturesExtension()
}
