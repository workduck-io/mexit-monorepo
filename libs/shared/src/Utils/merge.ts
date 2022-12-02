import { UserAccessTable } from '@mexit/core'

import merge from 'deepmerge'

export const mergeAccess = (access: UserAccessTable, access2: Partial<UserAccessTable>): UserAccessTable => {
  return merge(access, access2)
}
