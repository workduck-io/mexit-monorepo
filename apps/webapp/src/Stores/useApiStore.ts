import { sub } from 'date-fns'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface RequestData {
  time: number
  url: string
  method: string
  // headers: string;
}

interface ApiStore {
  requests: { [URL: string]: RequestData }
  setRequest(url: string, data: RequestData): void
  clearRequests(): void
}

export const useApiStore = create<ApiStore>(
  persist(
    (set, get) => ({
      requests: {},
      setRequest(url, data) {
        if (!url.includes('linkhierarchy')) {
          set({
            requests: {
              ...get().requests,
              [url]: data
            }
          })
        }
      },
      clearRequests() {
        set({
          requests: {}
        })
      }
    }),
    { name: 'api-store' }
  )
)

export const isRequestedWithin = (minutes: number, url: string) => {
  const now = Date.now()
  const backMinutes = sub(now, { minutes })

  const requests = useApiStore.getState().requests
  const request = requests[url]
  if (!request) return false
  return request.time > backMinutes.getTime()
}
