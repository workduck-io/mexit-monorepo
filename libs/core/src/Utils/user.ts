import { useMentionStore } from '../Stores'
import { AccessLevel, Mentionable, ShareContext, UserAccessTable } from '../Types'

export const addAccessToUser = (user: any, id: string, context: ShareContext, accessLevel: AccessLevel) => {
  const access: UserAccessTable = user.access || {
    note: {},
    space: {}
  }
  access[context][id] = accessLevel
  user.access = access
  return user
}

export const getUserFromUseridHookless = (userId: string): Mentionable | undefined => {
  const mentionable = useMentionStore.getState().mentionable

  const user = mentionable.find((user) => user.id === userId)

  return user
}
