import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Modal from 'react-modal'
import create from 'zustand'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'

import { mog } from '@mexit/core'
import { Label, StyledCreatatbleSelect, ButtonFields, IconButton, Button, Title } from '@mexit/shared'

import { useMentions, getAccessValue } from '../../Hooks/useMentions'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { ModalHeader, ModalControls } from '../../Style/Refactor'
import {
  AccessLevel,
  DefaultPermission,
  DefaultPermissionValue,
  Mentionable,
  permissionOptions
} from '../../Types/Mentions'
import { EMAIL_REG, MultiEmailValidate } from '../../Utils/constants'
import { LoadingButton } from '../Buttons/Buttons'
import { InputFormError } from '../Input'
import {
  InviteFormWrapper,
  InviteWrapper,
  SelectWrapper,
  ShareAlias,
  ShareAliasInput,
  SharedPermissionsTable,
  SharedPermissionsWrapper,
  ShareEmail,
  SharePermission,
  ShareRemove,
  ShareRow,
  ShareRowHeading
} from './styles'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { usePermission } from '../../Hooks/API/usePermission'

type ShareModalMode = 'invite' | 'permission'

// To denote what has changed
// Alias changes should not require a network call
type UserChange = 'permission' | 'alias' | 'revoke'

interface ChangedUser extends Mentionable {
  change: UserChange[]
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
  setChangedUsers: (users: ChangedUser[]) => set({ data: { changedUsers: users } }),
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

interface InviteModalData {
  alias: string
  email: string
  access: string
}

const InviteModalContent = () => {
  const data = useShareModalStore((state) => state.data)
  const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const { getUserDetails } = useUserService()
  const node = useEditorStore((state) => state.node)
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = async (data: InviteModalData) => {
    mog('data', data)

    if (node && node.nodeid) {
      const allMails = data.email.split(',')

      const userDetailPromises = allMails.map((email) => {
        return getUserDetails(email)
      })

      const userDetails = await Promise.allSettled(userDetailPromises)

      mog('userDetails', { userDetails })
    }
  }

  return (
    <InviteWrapper>
      <Title>Invite</Title>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InputFormError
          name="alias"
          label="Alias"
          inputProps={{
            defaultValue: data.alias ?? '',
            ...register('alias', {
              required: true
            })
          }}
          errors={errors}
        ></InputFormError>
        <InputFormError
          name="email"
          label="Email"
          inputProps={{
            autoFocus: true,
            ...register('email', {
              required: true,
              pattern: EMAIL_REG
            })
          }}
          errors={errors}
        ></InputFormError>

        <SelectWrapper>
          <Label htmlFor="access">Permission</Label>
          <Controller
            control={control}
            render={({ field }) => (
              <StyledCreatatbleSelect
                {...field}
                defaultValue={DefaultPermissionValue}
                options={permissionOptions}
                closeMenuOnSelect={true}
                closeMenuOnBlur={true}
              />
            )}
            name="access"
          />
        </SelectWrapper>

        <ButtonFields>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Invite
          </LoadingButton>
        </ButtonFields>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}

const MultiEmailInviteModalContent = () => {
  const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const { getUserDetails } = useUserService()
  const node = useEditorStore((state) => state.node)
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = (data: InviteModalData) => {
    mog('data', data)

    if (node && node.nodeid) {
      const allMails = data.email.split(',')
      allMails.forEach((email) => {
        getUserDetails(email)
      })
      // addInvitedUser({
      //   type: 'invite',
      //   alias: data.alias,
      //   email: data.email,
      //   access: {
      //     [node.nodeid]: (data.access as AccessLevel) ?? DefaultPermission
      //   }
      // })
    }
  }

  mog('MultiEmailInvite', { errors })

  return (
    <InviteWrapper>
      <Title>Invite</Title>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InputFormError
          name="email"
          label="Email"
          inputProps={{
            autoFocus: true,
            type: 'email',
            multiple: true,
            ...register('email', {
              required: true,
              validate: MultiEmailValidate
            })
          }}
          errors={errors}
        ></InputFormError>

        <SelectWrapper>
          <Label htmlFor="access">Permission</Label>
          <Controller
            control={control}
            render={({ field }) => (
              <StyledCreatatbleSelect
                {...field}
                defaultValue={DefaultPermissionValue}
                options={permissionOptions}
                closeMenuOnSelect={true}
                closeMenuOnBlur={true}
              />
            )}
            name="access"
          />
        </SelectWrapper>

        <ButtonFields>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Invite
          </LoadingButton>
        </ButtonFields>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}

interface PermissionModalContentProps {
  handleSubmit: () => void
  handleCopyLink: () => void
}

const PermissionModalContent = ({ handleSubmit, handleCopyLink }: PermissionModalContentProps) => {
  const { getSharedUsersForNode } = useMentions()
  const node = useEditorStore((state) => state.node)
  const changedUsers = useShareModalStore((state) => state.data.changedUsers)
  const setChangedUsers = useShareModalStore((state) => state.setChangedUsers)
  const { changeUserPermission, revokeUserAccess } = usePermission()

  const sharedUsers = useMemo(() => {
    if (node && node.nodeid) {
      return getSharedUsersForNode(node.nodeid)
    }
    return []
  }, [node, getSharedUsersForNode])

  const onNewInvite = (alias: string, email: string, access: AccessLevel) => {
    mog('new invite', { alias, email, access })
  }

  // This is called for every keystroke
  const onAliasChange = (userid: string, alias: string) => {
    // mog('onPermissionChange', { userid, alias })

    // Change the user and add to changedUsers
    const changedUser = changedUsers.find((u) => u.userid === userid)
    const dataUser = sharedUsers.find((u) => u.userid === userid)

    if (changedUser) {
      changedUser.alias = alias
      changedUser.change.push('alias')
      setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
    } else if (dataUser) {
      dataUser.alias = alias
      const changeUser = { ...dataUser, change: ['alias' as const] }
      setChangedUsers([...changedUsers, changeUser])
    }
  }
  const onPermissionChange = (userid: string, access: AccessLevel) => {
    // Change the user and add to changedUsers
    const changedUser = changedUsers.find((u) => u.userid === userid)
    const dataUser = sharedUsers.find((u) => u.userid === userid)
    mog('onPermissionChange', { userid, access, changedUsers, changedUser, dataUser })

    // TODO: Filter for the case when user permission is reverted to the og one
    if (changedUser) {
      const prevAccess = changedUser?.access[node.nodeid]
      const ogAccess = dataUser?.access[node.nodeid]
      if (ogAccess && access === ogAccess) {
        mog('removing user from changedUsers', { changedUser, access, ogAccess })
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.userid !== userid)])
          }
        }
      } else if (prevAccess !== access) {
        changedUser.access[node.nodeid] = access
        changedUser.change.push('permission')
        setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
      } else {
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.userid !== userid)])
          }
        }
      }
    } else if (dataUser) {
      const prevAccess = dataUser?.access[node.nodeid]
      if (prevAccess !== access) {
        dataUser.access[node.nodeid] = access
        const changeUser = { ...dataUser, change: ['permission' as const] }
        setChangedUsers([...changedUsers, changeUser])
      }
    }
  }

  const onUserRemove = (userid: string) => {
    mog('onUserRemove', { userid })
  }

  const onSave = async () => {
    // Only when change is done to permission

    // We change for users that have not been revoked
    const withoutRevokeChanges = changedUsers.filter((u) => !u.change.includes('revoke'))
    const newPermissions: { [userid: string]: AccessLevel } = withoutRevokeChanges
      .filter((u) => u.change.includes('permission'))
      .reduce((acc, user) => {
        return { ...acc, [user.userid]: user.access[node.nodeid] }
      }, {})

    const newAliases = withoutRevokeChanges
      .filter((u) => u.change.includes('alias'))
      .reduce((acc, user) => {
        acc.push({
          userid: user.userid,
          alias: user.alias
        })
        return acc
      }, [])

    const revokedUsers = changedUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.userid)
        return acc
      }, [])

    const applyPermissions = async () => {
      const userChangePerm = await changeUserPermission(node.nodeid, newPermissions)
      const userRevoke = await revokeUserAccess(node.nodeid, revokedUsers)
      mog('setting new permissions', { userChangePerm, userRevoke })
    }

    await applyPermissions()

    mog('onSave', { changedUsers, newPermissions, newAliases, revokedUsers })
  }

  return (
    <SharedPermissionsWrapper>
      <ModalHeader>Share Note</ModalHeader>

      <MultiEmailInviteModalContent />

      <SharedPermissionsTable>
        <caption>Users with access to this note</caption>
        <ShareRowHeading>
          <tr>
            <td>Alias</td>
            <td>Email</td>
            <td>Permission</td>
            <td></td>
          </tr>
        </ShareRowHeading>

        {sharedUsers.map((user) => {
          const access = user.access[node.nodeid]
          const hasChanged = changedUsers.find((u) => u.userid === user.userid)
          return (
            <ShareRow hasChanged={!!hasChanged} key={`${user.userid}`}>
              <ShareAlias hasChanged={!!hasChanged}>
                <ShareAliasInput
                  type="text"
                  defaultValue={user.alias}
                  onChange={(e) => onAliasChange(user.userid, e.target.value)}
                />
              </ShareAlias>
              <ShareEmail>{user.email}</ShareEmail>

              <SharePermission>
                <StyledCreatatbleSelect
                  onChange={(access) => onPermissionChange(user.userid, access.value)}
                  defaultValue={getAccessValue(access) ?? DefaultPermissionValue}
                  options={permissionOptions}
                  closeMenuOnSelect={true}
                  closeMenuOnBlur={true}
                />
              </SharePermission>
              <ShareRemove>
                <IconButton onClick={() => onUserRemove(user.userid)} icon={deleteBin6Line} title="Remove" />
              </ShareRemove>
            </ShareRow>
          )
        })}
      </SharedPermissionsTable>

      <ModalControls>
        <Button large onClick={handleCopyLink}>
          Copy Link
        </Button>
        <Button primary autoFocus={!window.focus} large onClick={onSave} disabled={changedUsers.length === 0}>
          Save
        </Button>
      </ModalControls>
    </SharedPermissionsWrapper>
  )
}

const ShareModal = () => {
  const open = useShareModalStore((store) => store.open)
  // const focus = useShareModalStore((store) => store.focus)
  const closeModal = useShareModalStore((store) => store.closeModal)
  const mode = useShareModalStore((store) => store.mode)
  // const openModal = useShareModalStore((store) => store.openModal)

  // const shortcuts = useHelpStore((store) => store.shortcuts)
  // const { push } = useNavigation()
  // const { shortcutDisabled, shortcutHandler } = useKeyListener()

  // TODO: Add Share Modal shortcut
  // useEffect(() => {
  //   const unsubscribe = tinykeys(window, {
  //     [shortcuts.showShareModal.keystrokes]: (event) => {
  //       event.preventDefault()
  //       shortcutHandler(shortcuts.showShareModal, () => {
  //         openModal()
  //       })
  //     }
  //   })
  //   return () => {
  //     unsubscribe()
  //   }
  // }, [shortcuts, shortcutDisabled])

  const handleCopyLink = () => {
    closeModal()
  }

  const handleSave = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      {mode === 'invite' ? (
        <InviteModalContent />
      ) : (
        <PermissionModalContent handleSubmit={handleSave} handleCopyLink={handleCopyLink} />
      )}
    </Modal>
  )
}

export default ShareModal
