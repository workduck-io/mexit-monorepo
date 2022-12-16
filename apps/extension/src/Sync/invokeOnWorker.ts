import { idxKey, ILink, PersistentData, SearchRepExtra, Snippets } from '@mexit/core'

import { childIframe } from './iframeConnector'

export const wSearchIndex = async (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
  if (childIframe) {
    return childIframe.searchIndex(key, query, tags)
  }
}

export const wSearchIndexByNodeId = async (key: idxKey | idxKey[], nodeID: string, query: string) => {
  if (childIframe) {
    return childIframe.searchIndexByNodeId(key, nodeID, query)
  }
}

export const wSearchIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
  if (childIframe) {
    return childIframe.searchIndexWithRanking(key, query)
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

export const wAddDoc = async (
  key: idxKey,
  nodeID: string,
  contents: any[],
  title: string,
  tags?: Array<string>,
  extra?: SearchRepExtra
) => {
  if (childIframe) return childIframe.addDoc(key, nodeID, contents, title, tags, extra)
}

export const wUpdateDoc = async (
  key: idxKey,
  nodeID: string,
  contents: any[],
  title: string,
  tags?: Array<string>,
  extra?: SearchRepExtra
) => {
  if (childIframe) return childIframe.updateDoc(key, nodeID, contents, title, tags, extra)
}

export const wRemoveDoc = async (key: idxKey, id: string) => {
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
