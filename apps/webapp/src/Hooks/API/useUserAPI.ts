import { client } from '@workduck-io/dwindle'

import { apiURLs, mog } from '@mexit/core'
import { useUserCacheStore } from '../../Stores/useUserCacheStore'

export const useUserService = () => {
  const addUser = useUserCacheStore((s) => s.addUser)
  const getUser = useUserCacheStore((s) => s.getUser)
  const getUserDetails = async (email: string): Promise<{ email: string; userId?: string }> => {
    const user = getUser({ email })
    if (user) return user

    try {
      return await client.get(apiURLs.user.getFromEmail(email)).then((resp: any) => {
        mog('Response', { resp })
        if (resp?.data?.userId) {
          addUser({ email, userId: resp?.data?.userId })
        }
        return { email, userId: resp?.data?.userId ?? undefined }
      })
    } catch (e) {
      mog('Error Fetching User Details', { error: e, email })
      return { email, userId: undefined }
    }
  }

  const getUserDetailsUserId = async (userId: string): Promise<{ email?: string; userId: string }> => {
    const user = getUser({ userId })
    if (user) return user
    try {
      return await client.get(apiURLs.user.getFromUserId(userId)).then((resp: any) => {
        mog('Response', { resp })
        if (resp?.data?.email) {
          addUser({ userId, email: resp?.data?.email })
        }
        return { userId, email: resp?.data?.email ?? undefined }
      })
    } catch (e) {
      mog('Error Fetching User Details', { error: e, userId })
      return { userId, email: undefined }
    }
  }
  return { getUserDetails, getUserDetailsUserId }
}
