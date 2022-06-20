import create from 'zustand'
import { Mentionable } from '../Types/Mentions'

type ShareModalMode = 'invite' | 'permission'

// To denote what has changed
// Alias changes should not require a network call
type UserChange = 'permission' | 'alias' | 'revoke'

interface ChangedUser extends Mentionable {
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
  }
  openModal: (mode: ShareModalMode) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  setChangedUsers: (users: ChangedUser[]) => void
  prefillModal: (mode: ShareModalMode, alias?: string, fromEditor?: boolean) => void
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  open: false,
  focus: true,
  mode: 'permission',
  data: {
    changedUsers: []
  },
  openModal: (mode: ShareModalMode) =>
    set({
      mode,
      open: true
    }),
  closeModal: () => {
    set({
      open: false,
      focus: false
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  setChangedUsers: (users: ChangedUser[]) => set({ data: { changedUsers: users.filter((u) => u.change.length > 0) } }),
  prefillModal: (mode: ShareModalMode, alias?: string, fromEditor?: boolean) =>
    set({
      mode,
      open: true,
      data: {
        alias,
        fromEditor
      },
      focus: false
    })
}))
