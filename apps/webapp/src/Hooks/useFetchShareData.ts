import { AccessLevel, mog } from '@mexit/core'

import { useMentions } from './useMentions'
import { useAuthStore } from '../Stores/useAuth'
import { useDataStore } from '../Stores/useDataStore'
import { usePermission } from './API/usePermission'
import { useUserService } from './API/useUserAPI'
import { getEmailStart } from '../Utils/constants'

interface UsersRaw {
  nodeid: string
  users: Record<string, string>
}

interface MUsersRaw {
  nodeid: string
  email: string
  alias: string
  name: string
  userid: string
  access: AccessLevel
}

export const useFetchShareData = () => {
  const { getAllSharedNodes, getUsersOfSharedNode } = usePermission()
  const { getUserDetailsUserId } = useUserService()
  const { addMentionable } = useMentions()
  const setSharedNodes = useDataStore((s) => s.setSharedNodes)

  const fetchShareData = async () => {
    const sharedNodesPreset = await getAllSharedNodes()
    if (sharedNodesPreset.status === 'error') return

    const sharedNodes = sharedNodesPreset.data

    setSharedNodes(sharedNodes)
    // Then fetch the users with access to the shared node
    const sharedNodeDetails = sharedNodes.map((node) => {
      return getUsersOfSharedNode(node.nodeid)
    })

    const nodeDetails = await Promise.allSettled(sharedNodeDetails)

    const usersWithAccess = nodeDetails
      .filter((p) => p.status === 'fulfilled')
      .map((p: any) => {
        return p.value as UsersRaw
      })

    const UserAccessDetails = usersWithAccess.reduce((p, n) => {
      // mog('getUserAccess', { p, n })
      const rawUsers = Object.entries(n.users).map(([uid, access]) => ({ nodeid: n.nodeid, userid: uid, access }))
      return [...p, ...rawUsers]
    }, [])

    // Then finally fetch the user detail: email
    const mentionableU = (
      await Promise.allSettled([
        ...UserAccessDetails.map(async (u) => {
          const uDetails = await getUserDetailsUserId(u.userid)
          return { ...u, email: uDetails.email, alias: uDetails.alias }
        }),

        ...sharedNodes.map(async (node) => {
          const uDetails = await getUserDetailsUserId(node.owner)
          return {
            access: 'OWNER',
            userid: uDetails.userID,
            nodeid: node.nodeid,
            name: uDetails.name,
            email: uDetails.email,
            alias: uDetails.alias
          }
        })
      ])
    )
      .filter((p) => p.status === 'fulfilled')
      .map((p: any) => p.value as MUsersRaw)

    mentionableU.forEach((u) =>
      addMentionable(u.alias ?? getEmailStart(u.email), u.email, u.userid, u.name, u.nodeid, u.access)
    )

    mog('SharedNode', { sharedNodes, usersWithAccess, mentionableU, UserAccessDetails })
  }

  return { fetchShareData }
}