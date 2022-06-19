import { client } from '@workduck-io/dwindle'

import { mog, USER_SERVICE_EMAIL_URL } from '@mexit/core'

export const useUserService = () => {
  const getUserDetails = (email: string) => {
    client.get(USER_SERVICE_EMAIL_URL(email)).then((resp) => {
      mog('Response', { resp })
    })
  }

  return { getUserDetails }
}
