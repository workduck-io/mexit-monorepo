import { client } from '@workduck-io/dwindle'

import { mog, USER_SERVICE_EMAIL_URL } from '@mexit/core'

export const useUserService = () => {
  const getUserDetails = async (email: string) => {
    return await client
      .get(USER_SERVICE_EMAIL_URL(email))
      .then((resp: any) => {
        mog('Response', { resp })
        return { email, userId: resp.data.userId }
      })
      .catch(() => {
        return { email, userId: undefined }
      })
  }

  return { getUserDetails }
}
