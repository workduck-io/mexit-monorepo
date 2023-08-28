import {
  AccessLevel,
  addAccessToUser,
  DefaultPermission,
  emptyAccessTable,
  InvitedUser,
  Mentionable,
  mog,
  SelfMention,
  ShareContext,
  useAuthStore,
  useDataStore,
  useMentionStore,
  useUserCacheStore
} from '@mexit/core'

import { mergeAccess } from '../Utils/merge'

export const useMentionsHook = (mentionAPIs?) => {
  const addInvitedUser = useMentionStore((s) => s.addInvitedUser)
  const addAccess = useMentionStore((s) => s.addAccess)
  const setInvited = useMentionStore((s) => s.setInvited)
  const setMentionable = useMentionStore((s) => s.setMentionable)

  // Add access level that is returned from the backend after permissions have been given
  const inviteUser = (email: string, alias: string, id: string, context: ShareContext, accessLevel: AccessLevel) => {
    const invited = useMentionStore.getState().invitedUsers
    const user = invited.find((u) => u.email === email)

    // if previously invited, update access level
    if (user) {
      addAccess(user.email, id, context, accessLevel)
    } else {
      addInvitedUser({
        type: 'invite',
        email,
        alias,
        access: mergeAccess(emptyAccessTable, {
          [context]: { [id]: accessLevel }
        })
      })
    }
  }

  // Used when inserting existing mention/invited to the editor
  const grantUserAccessOnMention = async (alias: string, nodeid: string, access: AccessLevel = DefaultPermission) => {
    const invitedUsers = useMentionStore.getState().invitedUsers
    const mentionable = useMentionStore.getState().mentionable
    const currentUserDetails = useAuthStore.getState().userDetails

    const invitedExists = invitedUsers.find((user) => user.alias === alias)
    const mentionExists = mentionable.find((user) => user.alias === alias)

    const mentionPerm = mentionExists && mentionExists.access[nodeid]
    const invitedPerm = invitedExists && invitedExists.access[nodeid]
    mog('GrantUserAccessOnMention', { alias, nodeid, access, mentionPerm, invitedPerm })
    // If the user has permission to node, no need to add it
    if (mentionPerm) return
    if (invitedPerm) return
    if (invitedExists && !mentionExists) {
      const newInvited: InvitedUser = addAccessToUser(invitedExists, nodeid, 'note', access)
      // As user not on mex no need to call backend and give permission
      setInvited([...invitedUsers.filter((user) => user.alias !== alias), newInvited])
      return newInvited
    } else if (!invitedExists && mentionExists) {
      if (currentUserDetails.id === mentionExists.id) return
      // We know it is guaranteed to be mentionable
      // Call backend and give permission
      const res = await mentionAPIs
        .grantUsersPermission(nodeid, [mentionExists.id], access)
        .then(() => {
          const newMentioned: Mentionable = addAccessToUser(mentionExists, nodeid, 'note', access) as Mentionable
          setMentionable([...mentionable.filter((user) => user.alias !== alias), newMentioned])
          return newMentioned
        })
        .catch((e) => {
          console.log('Granting permission to user failed', { e })
          return undefined
        })
      return res
    } else {
      // By design, the user should be in either invited or mentionable. The flow for new created user is different.
      console.error('SHOULD NOT RUN: grantUserAccessOnMention', { alias, nodeid, access })
      return 'notFound'
      //
    }
  }

  /**
   * Adds a new mentionable user
   *
   * If access details are not provided, it will be added without access,
   * this happens in the case of mentioning without sharing a note
   */
  const addMentionable = (
    alias: string,
    email: string,
    id: string,
    name: string,
    accessDetails?: {
      context: ShareContext
      id: string
      access: AccessLevel
    }
  ) => {
    const mentionable = useMentionStore.getState().mentionable
    const mentionExists = id ? mentionable.find((user) => user.id === id) : undefined

    mog('adding mentionable user ', { id, mentionExists, mentionable, accessDetails })
    if (mentionExists) {
      if (accessDetails.id && accessDetails.access) {
        mentionExists.access[accessDetails.context][accessDetails.id] = accessDetails.access
      }
      setMentionable([...mentionable.filter((u) => u.id !== id), mentionExists])
    } else {
      const newAccess = accessDetails
        ? {
            [accessDetails.context]: { [accessDetails.id]: accessDetails.access }
          }
        : emptyAccessTable
      const newMention: Mentionable = {
        type: 'mentionable',
        alias,
        name,
        email,
        access: mergeAccess(emptyAccessTable, newAccess),
        id
      }
      mog('new access', { id, newMention, newAccess, af: mergeAccess(emptyAccessTable, newAccess) })

      setMentionable([...mentionable, newMention])
    }
  }

  const getUsernameFromUserid = (id: string): string | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.id === id)
    if (user) {
      return user.alias
    } else return undefined
  }

  /** Context is note level access */
  const getUserAccessLevelForNode = (id: string, nodeid: string): AccessLevel | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const localUserDetails = useAuthStore.getState().userDetails

    const user = mentionable.find((mention) => mention?.id === id)

    if (user && user.access.note[nodeid]) {
      return user.access.note[nodeid]
    }

    const sharedNodes = useDataStore.getState().sharedNodes
    const sharedNode = sharedNodes.find((node) => node.nodeid === nodeid)

    if (id === localUserDetails?.id) {
      if (sharedNode) {
        return sharedNode.currentUserAccess
      } else {
        return 'OWNER'
      }
    }

    // const isShared = isSharedNode(nodeid)
    return undefined
  }

  /** Context is note level access */
  const getSharedUsersForNode = (nodeid: string): Mentionable[] => {
    const mentionable = useMentionStore.getState().mentionable
    const users = mentionable
      .filter((mention) => mention.access.note[nodeid] !== undefined)
      // Get the owner to the top
      .sort((a, b) => (a.access.note[nodeid] === 'OWNER' ? -1 : b.access.note[nodeid] === 'OWNER' ? 1 : 0))

    return users
  }

  const getSharedUsersOfNodeOfSpace = (nodeid: string, spaceId: string) => {
    const mentionable = useMentionStore.getState().mentionable
    const users = mentionable
      .filter((mention) => {
        const access = mention.access
        return access.note[nodeid] !== undefined || access.space[spaceId] !== undefined
      })
      .sort((a, b) => (a.access.note[nodeid] === 'OWNER' ? -1 : b.access.note[nodeid] === 'OWNER' ? 1 : 0))

    return users
  }

  const getInvitedUsers = (id: string, context: ShareContext): InvitedUser[] => {
    const invitedUsers = useMentionStore.getState().invitedUsers
    const users = invitedUsers.filter((mention) => mention.access[context][id] !== undefined)
    return users
  }

  const getUserFromUserid = (userid: string): Mentionable | InvitedUser | SelfMention | undefined => {
    const currentUser = useAuthStore.getState().userDetails
    if (currentUser?.id === userid) {
      return {
        type: 'self',
        ...currentUser
      }
    }

    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable?.find((mention) => mention.id === userid)

    if (user) {
      return user
    } else {
      // If the user is invited only, the userid is the alias
      const invited = useMentionStore.getState().invitedUsers
      const invitedUser = invited?.find((u) => u.alias === userid)
      if (invitedUser) {
        return invitedUser
      }
    }
    const cache = useUserCacheStore.getState().cache
    const userFromCache = cache?.find((u) => u.id === userid)

    if (userFromCache) {
      return { ...userFromCache, type: 'mentionable', access: emptyAccessTable }
    }

    return undefined
  }

  const applyChangesMentionable = (
    newPermissions: { [id: string]: AccessLevel },
    revoked: string[],
    context: ShareContext,
    id: string
  ) => {
    mog('applyChanges', { newPermissions, revoked })

    const oldMentionable = useMentionStore.getState().mentionable

    const afterRevoked = oldMentionable.map((u) => {
      if (revoked.includes(u.id)) {
        delete u.access[context][id]
        return u
      }
      return u
    })
    const afterAccessChange = afterRevoked.map((u) => {
      if (Object.keys(newPermissions).includes(u.id))
        return {
          ...u,
          access: mergeAccess(u.access, {
            [context]: { [id]: newPermissions[u.id] }
          })
        }
      return u
    })

    mog('AfterApplying the changes', { context, oldMentionable, afterRevoked, afterAccessChange })

    setMentionable(afterAccessChange)
  }

  return {
    getUsernameFromUserid,
    getUserFromUserid,
    inviteUser,
    addMentionable,
    getUserAccessLevelForNode,
    getSharedUsersForNode,
    getSharedUsersOfNodeOfSpace,
    getInvitedUsers,
    grantUserAccessOnMention,
    applyChangesMentionable
  }
}

export const getAccessValue = (access: AccessLevel): { value: AccessLevel; label: string } => {
  // mog('getAccessValue', { access })
  switch (access) {
    case 'READ':
      return { value: 'READ', label: 'Can view' }
    case 'WRITE':
      return { value: 'WRITE', label: 'Can edit' }
    case 'MANAGE':
      return { value: 'MANAGE', label: 'Can manage' }
    default:
      return { value: 'MANAGE', label: 'Can manage' }
  }
}
