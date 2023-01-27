export interface Invite {
  id: string
  workspaceId: string
  properties?: InviteProperties
}

type InviteProperties = {
  inviteeId: string
  permission?: string
  domain?: string
}

export interface InviteStore {
  invites: Invite[]
  setInvites: (invite: Invite[]) => void
  addInvite: (invite: Invite) => void
}

export const inviteStoreConstructor = (set, get) => ({
  invites: [],
  setInvites: (invites) => set({ invites }),
  addInvite: (invite) => {
    const oldinvites = get().invites

    set({ invites: [...oldinvites, invite] })
  }
})
