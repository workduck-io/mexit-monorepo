import create from 'zustand'
import { InvitedUser, Mentionable, mog } from '@mexit/core'

type ShareModalMode = 'invite' | 'permission'

// To denote what has changed
// Alias changes should not require a network call
type UserChange = 'permission' | 'alias' | 'revoke'

interface ChangedUser extends Mentionable {
  change: UserChange[]
}

interface ChangedInvitedUser extends InvitedUser {
  change: UserChange[]
}

export interface InviteModalData {
  alias: string
  email: string
  access: string
}

interface ShareModalState {
  open: boolean
  focus: boolean
  mode: ShareModalMode
  data: {
    alias?: string
    fromEditor?: boolean
    changedUsers?: ChangedUser[]
    changedInvitedUsers?: ChangedInvitedUser[]
  }
  openModal: (mode: ShareModalMode) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  setChangedUsers: (users: ChangedUser[]) => void
  setChangedInvitedUsers: (users: ChangedInvitedUser[]) => void
  prefillModal: (mode: ShareModalMode, alias?: string, fromEditor?: boolean) => void
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  open: false,
  focus: true,
  mode: 'permission',
  data: {
    changedUsers: [],
    changedInvitedUsers: []
  },
  openModal: (mode: ShareModalMode) =>
    set({
      mode,
      open: true
    }),
  closeModal: () => {
    set({
      open: false,
      focus: false,
      data: {
        changedUsers: [],
        changedInvitedUsers: []
      }
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  setChangedUsers: (users: ChangedUser[]) => set({ data: { changedUsers: users.filter((u) => u.change.length > 0) } }),
  setChangedInvitedUsers: (users: ChangedInvitedUser[]) =>
    set({ data: { changedInvitedUsers: users.filter((u) => u.change.length > 0) } }),
  prefillModal: (mode: ShareModalMode, alias?: string, fromEditor?: boolean) => {
    mog('PrefillModal', { mode, alias, fromEditor })
    set({
      mode,
      open: true,
      data: {
        alias,
        fromEditor
      },
      focus: false
    })
  }
}))
