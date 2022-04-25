import { client } from '@workduck-io/dwindle'
import { mog } from '@mexit/core'
import { useApiStore } from '../Stores/useApiStore'

export const clientInterceptor = client.interceptors.response.use(
  async (response) => {
    const setRequest = useApiStore.getState().setRequest
    mog('setRequest', {
      response
    })
    setRequest(response.config.url, {
      url: response.config.url,
      time: Date.now(),
      method: response.config.method
    })
    return response
  },
  (error) => {
    throw error
  }
)
