import { AccessLevel, mog, runBatch } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { useDataStore } from '../Stores/useDataStore'
import { getEmailStart } from '../Utils/constants'
import { usePermission } from './API/usePermission'
import { useUserService } from './API/useUserAPI'
import { useMentions } from './useMentions'

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

  const fetchSharedNodeUsers = async (nodeid: string) => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const node = sharedNodes.find((n) => n.nodeid === nodeid)
    // Then fetch the users with access to the shared node
    if (!node) return
    const sharedNodeDetails = [getUsersOfSharedNode(nodeid)]

    const nodeDetails = (await runBatch(sharedNodeDetails)).fulfilled

    const usersWithAccess = nodeDetails
      // .filter((p) => p.status === 'fulfilled')
      .map((p: any) => {
        // mog('p', { p })
        return p[0].value as UsersRaw
      })

    // mog('getUserAccess', { usersWithAccess, nodeDetails })
    const UserAccessDetails = usersWithAccess.reduce((p, n) => {
      const rawUsers = Object.entries(n.users).map(([uid, access]) => ({ nodeid: n.nodeid, userid: uid, access }))
      return [...p, ...rawUsers]
    }, [])

    // Then finally fetch the user detail: email
    const mentionableU = (
      await runBatch([
        ...UserAccessDetails.map(async (u) => {
          const uDetails = await getUserDetailsUserId(u.userid)
          return { ...u, email: uDetails.email, alias: uDetails.alias }
        }),

        ...[node].map(async (node) => {
          const uDetails = await getUserDetailsUserId(node.owner)
          return {
            access: 'OWNER',
            userid: uDetails.userID,
            nodeid: node.nodeid,
            email: uDetails.email,
            name: uDetails.name,
            alias: uDetails.alias
          }
        })
      ])
    ).fulfilled
      // .filter((p) => p.status === 'fulfilled')
      .reduce((arr, p: any) => {
        // mog('p', { p })
        return [...arr, ...p.map((u) => u.value as MUsersRaw)]
      }, [])
    // .filter((u) => u.userid !== userDetails?.userID)

    // mog('mentionableU', { mentionableU })
    mentionableU.forEach((u) =>
      addMentionable(u.alias ?? getEmailStart(u.email), u.email, u.userid, u.name, u.nodeid, u.access)
    )
  }

  const fetchShareData = async () => {
    // First fetch the shared nodes
    const sharedNodesPreset = await getAllSharedNodes()
    // mog('SharedNode', { sharedNodes })
    if (sharedNodesPreset.status === 'error') return

    const sharedNodes = sharedNodesPreset.data

    setSharedNodes(sharedNodes)
  }

  return { fetchShareData, fetchSharedNodeUsers }
}
