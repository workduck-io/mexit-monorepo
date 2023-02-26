import { AccessLevel, InvitedUser, Mentionable } from '../Types/Mentions';
import { StoreIdentifier } from '../Types/Store';
import { createStore } from '../Utils/storeCreator'

// The invite mode is only when the editor is open and used to open on new combobox invite
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
  access: {
    value: AccessLevel | 'NONE'
    label: string
  }
}

export const shareModalConfig = (set, get) => ({
  open: false,
  focus: true,
  context: 'note',
  mode: 'permission',
  data: {
    changedUsers: [],
    changedInvitedUsers: []
  },
  openModal: (mode: ShareModalMode, context, id) =>
    set({
      mode,
      context,
      open: true,
      data: {
        nodeid: context === 'note' ? id : undefined,
        namespaceid: context === 'space' ? id : undefined
      }
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
  prefillModal: (mode: ShareModalMode, context, data) =>
    set({
      mode,
      open: true,
      context,
      data: {
        ...get().data,
        ...data
      },
      focus: false
    })
})
export const useShareModalStore = createStore(shareModalConfig, StoreIdentifier.SHAREMODAL, false)
