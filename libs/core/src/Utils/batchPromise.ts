import { mog } from './mog'

const BATCH_SIZE = 6

const batchArray = (array: any[], batchSize: number): any[][] => {
  const batches = []
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize))
  }
  return batches
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
