import { AccessLevel, InvitedUser, Mentionable, ShareContext } from '../Types/Mentions'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

// The invite mode is only when the editor is open and used to open on new combobox invite
type ShareModalMode = 'invite' | 'permission' | 'publish'

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

interface ShareModalData {
  //  Used only for share permissions mode
  nodeid?: string
  alias?: string

  // Used only for share permissions of namespace
  namespaceid?: string
  id?: string
  share?: boolean

  fromEditor?: boolean
  // When sharing to a preexisting user from a mention
  userid?: string
  changedUsers?: ChangedUser[]
  changedInvitedUsers?: ChangedInvitedUser[]
}

const shareModalConfig = (set, get) => ({
  open: false,
  focus: true,
  context: 'note' as ShareContext,
  mode: 'permission' as ShareModalMode,
  data: {
    changedUsers: [] as ChangedUser[],
    changedInvitedUsers: [] as ChangedInvitedUser[]
  } as ShareModalData,
  openModal: (mode: ShareModalMode, context: ShareContext, id) =>
    set({
      mode,
      context,
      open: true,
      data: {
        nodeid: context === 'note' ? id : undefined,
        namespaceid: context === 'space' ? id : undefined,
        id: context === 'view' ? id : undefined
      }
    }),
  updateData: (data: Partial<ShareModalData>) => {
    const updatedData = {
      ...get().data,
      ...data
    }

    set({ data: updatedData })
  },
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
  prefillModal: (mode: ShareModalMode, context: ShareContext, data: ShareModalData) =>
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
