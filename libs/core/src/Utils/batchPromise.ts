import { ILink } from '../Types/Editor'
import { SingleNamespace } from '../Types/Store'

const BATCH_SIZE = 6

export const batchArray = (array: any[], batchSize = BATCH_SIZE): any[][] => {
  const batches = []
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize))
  }
  return batches
}

export const batchArrayWithNamespaces = (ilinks: ILink[], namespaces: SingleNamespace[], batchSize = BATCH_SIZE) => {
  const sharedNamespaces = new Set(namespaces.filter((ns) => ns.granterID !== undefined).map((ns) => ns.id))
  const nsMap: Record<string, string[]> = { NOT_SHARED: [] }

  ilinks.forEach((ilink) => {
    const { nodeid, namespace } = ilink
    if (sharedNamespaces.has(namespace)) {
      if (nsMap[namespace]) nsMap[namespace].push(nodeid)
      else nsMap[namespace] = [nodeid]
    } else {
      nsMap['NOT_SHARED'].push(nodeid)
    }
  })

  const batchMap: Record<string, string[][]> = {}
  Object.entries(nsMap).forEach(([nsID, nodeids]) => {
    batchMap[nsID] = batchArray(nodeids, batchSize)
  })

  return batchMap
}

export const runBatch = async <T>(promises: Promise<T>[], batchSize = BATCH_SIZE) => {
  const batches = batchArray(promises, batchSize)
  const fulfilled = []
  const rejected = []

  for (const batch of batches) {
    const result = await Promise.allSettled(batch)
    fulfilled.push(
      ...result.filter((val) => val.status === 'fulfilled').map((val: PromiseFulfilledResult<any>) => val.value)
    )
    rejected.push(...result.filter((val) => val.status === 'rejected'))
  }

  return {
    fulfilled,
    rejected
  }
}
