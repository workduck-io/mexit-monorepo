import { API } from '@mexit/core'

export const useBroadcastAPI = () => {
  const getAllPastEvents = async (timestamp: string) => {
    const response = await API.broadcast.getAll(undefined, { searchParams: `timestamp=${timestamp}` })

    return response
  }

  return {
    getAllPastEvents
  }
}
