import { StoreIdentifier } from '../Types'
import { createStore } from '../Utils/storeCreator'

interface Invite {
  id: string
  workspaceId: string
  properties?: InviteProperties
}

type InviteProperties = {
  inviteeId: string
  permission?: string
  domain?: string
}

const inviteStoreConfig = (set, get) => ({
  invites: [] as Invite[],
  setInvites: (invites: Invite[]) => set({ invites }),
  addInvite: (invite: Invite) => {
    const oldinvites = get().invites

    set({ invites: [invite, ...oldinvites] })
  }
})

export const useInviteStore = createStore(inviteStoreConfig, StoreIdentifier.INVITE, false)
