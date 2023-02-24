import { AccessLevel, mog, runBatch, ShareContext } from '@mexit/core'

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
    // if (context === 'note' && !node) return
    const sharedItemDetails = [context === 'note' ? getUsersOfSharedNode(id) : getAllSharedUsers(id)]

    const usersWithAccess = (await runBatch(sharedItemDetails)).fulfilled

    // mog('getUserAccess', { usersWithAccess })
    const UserAccessDetails = usersWithAccess.reduce((p, n) => {
      const rawUsers = Object.entries(n.users).map(([uid, access]) => ({ id, userId: uid, access }))
      return [...p, ...rawUsers]
    }, [])

    mog('USER ACCESS DETAILS', { UserAccessDetails })

    // Then finally fetch the user detail: email
    const mentionableU = (
      await runBatch([
        ...UserAccessDetails.map(async (u) => {
          const uDetails = await getUserDetailsUserId(u.userId)
          return { ...u, email: uDetails.email, name: uDetails.name, alias: uDetails.alias }
        }),

        ...(context === 'note' && node ? [node] : []).map(async (node) => {
          const uDetails = await getUserDetailsUserId(node.owner)
          return {
            access: 'OWNER',
            id,
            email: uDetails.email,
            name: uDetails.name,
            alias: uDetails.alias
          }
        })
      ])
    ).fulfilled.reduce((arr, p: any) => {
      return [...arr, p as MUsersRaw]
    }, [])
    // .filter((u) => u.userid !== userDetails?.id)

    mog('Fetched users for the shared item', { id, context, mentionableU })
    mentionableU.forEach((u) =>
      addMentionable(u.alias ?? getEmailStart(u.email), u.email, u.userId, u.name, {
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
