import { useAuthStore } from '@mexit/core'

export const useBroadcastAPI = () => {
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  const getAllPastEvents = async (timestamp: string) => {
    const request = {
      type: 'BROADCAST_EVENT',
      subType: 'GET_PAST_EVENTS',
      data: {
        searchParams: `timestamp=${timestamp}`,
        workspaceID: workspaceDetails.id
      }
    }

    const res = await chrome.runtime.sendMessage(request)

    return res
  }

  return {
    getAllPastEvents
  }
}
