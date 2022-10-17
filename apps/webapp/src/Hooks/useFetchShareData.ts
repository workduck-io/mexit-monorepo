import { AccessLevel, mog, runBatch, ShareContext } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { useDataStore } from '../Stores/useDataStore'
import { getEmailStart } from '../Utils/constants'
import { useNamespaceApi } from './API/useNamespaceAPI'
import { useNodeShareAPI } from './API/useNodeShareAPI'
import { useUserService } from './API/useUserAPI'
import { useMentions } from './useMentions'

interface UsersRaw {
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
  const { getAllSharedNodes, getUsersOfSharedNode } = useNodeShareAPI()
  const { getAllSharedUsers } = useNamespaceApi()
  const { getUserDetailsUserId } = useUserService()
  const { addMentionable } = useMentions()
  const setSharedNodes = useDataStore((s) => s.setSharedNodes)

  const fetchSharedUsers = async (id: string, context: ShareContext) => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const node = sharedNodes.find((n) => n.nodeid === id)
    // Then fetch the users with access to the shared node
    if (context === 'note' && !node) return
    const sharedItemDetails = [context === 'note' ? getUsersOfSharedNode(id) : getAllSharedUsers(id)]

    const itemDetails = (await runBatch(sharedItemDetails)).fulfilled

    const usersWithAccess = itemDetails
      // .filter((p) => p.status === 'fulfilled')
      .map((p: any) => {
        mog('p', { p })
        return p as UsersRaw
      })

    // mog('getUserAccess', { usersWithAccess, itemDetails })
    const UserAccessDetails = usersWithAccess.reduce((p, n) => {
      const rawUsers = Object.entries(n.users).map(([uid, access]) => ({ id, userid: uid, access }))
      return [...p, ...rawUsers]
    }, [])

    // Then finally fetch the user detail: email
    const mentionableU = (
      await runBatch([
        ...UserAccessDetails.map(async (u) => {
          const uDetails = await getUserDetailsUserId(u.userid)
          return { ...u, email: uDetails.email, alias: uDetails.alias }
        }),

        ...(context === 'note' ? [node] : []).map(async (node) => {
          const uDetails = await getUserDetailsUserId(node.owner)
          return {
            access: 'OWNER',
            userid: uDetails.userID,
            id,
            email: uDetails.email,
            name: uDetails.name,
            alias: uDetails.alias
          }
        })
      ])
    ).fulfilled
      // .filter((p) => p.status === 'fulfilled')
      .reduce((arr, p: any) => {
        mog('p2', { p })
        return [...arr, p as MUsersRaw]
      }, [])
    // .filter((u) => u.userid !== userDetails?.userID)

    mog('Fetched users for the shared item', { id, context, mentionableU })
    mentionableU.forEach((u) =>
      addMentionable(u.alias ?? getEmailStart(u.email), u.email, u.userid, u.name, {
        context,
        id: id,
        access: u.access
      })
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

  return { fetchShareData, fetchSharedUsers }
}
