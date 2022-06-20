import { client } from '@workduck-io/dwindle'

import { mog, USER_SERVICE_EMAIL_URL } from '@mexit/core'

export const useUserService = () => {
  const getUserDetails = async (email: string) => {
    return await client.get(USER_SERVICE_EMAIL_URL(email)).then((resp) => {
      mog('Response', { resp })
      return resp
    })
  }

  return { getUserDetails }
}
