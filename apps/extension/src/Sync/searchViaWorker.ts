import { idxKey } from '@mexit/core'

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
