const BATCH_SIZE = 25
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
  for await (const batch of batches) {
    const result = await Promise.allSettled(batch)
    fulfilled.push(result.filter((val) => val.status === 'fulfilled'))
    rejected.push(result.filter((val) => val.status === 'rejected'))
  }
  return {
    fulfilled,
    rejected
  }
}
