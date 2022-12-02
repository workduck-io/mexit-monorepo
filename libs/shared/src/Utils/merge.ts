import merge from 'deepmerge'

import { UserAccessTable } from '@mexit/core'

export const mergeAccess = (access: UserAccessTable, access2: Partial<UserAccessTable>): UserAccessTable => {
  return merge(access, access2)
}
