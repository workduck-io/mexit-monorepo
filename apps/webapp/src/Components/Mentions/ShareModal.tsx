import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Modal from 'react-modal'
import create from 'zustand'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'

import { Label, StyledCreatatbleSelect, ButtonFields, IconButton, Button } from '@mexit/shared'
import { useMentions, getAccessValue } from '../../Hooks/useMentions'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { ModalHeader, ModalControls } from '../../Style/Refactor'
import { AccessLevel, DefaultPermissionValue, permissionOptions } from '../../Types/Mentions'
import { EMAIL_REG } from '../../Utils/constants'
import { LoadingButton } from '../Buttons/Buttons'
import { InputFormError } from '../Input'

import {
  ShareAlias,
  SharedPermissionsWrapper,
  ShareEmail,
  SharePermission,
  ShareRemove,
  ShareRow,
  ShareRowHeading
} from './styles'

type ShareModalMode = 'invite' | 'permission'

interface ShareModalState {
  open: boolean
  focus: boolean
  mode: ShareModalMode
  data: {
    alias?: string
    fromEditor?: boolean
  }
  openModal: (mode: ShareModalMode) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  prefillModal: (mode: ShareModalMode, alias?: string, fromEditor?: boolean) => void
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  open: false,
  focus: true,
  mode: 'permission',
  data: {},
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
  const node = useEditorStore((state) => state.node)
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = (data: InviteModalData) => {
    console.log('data', data)

    if (node && node.nodeid) {
      addInvitedUser({
        type: 'invite',
        alias: data.alias,
        email: data.email,
        access: {
          [node.nodeid]: (data.access as AccessLevel) ?? 'READ'
        }
      })
    }
  }

  return (
    <div>
      <h1>Invite</h1>
      <p>Invite your friends to join your team.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <Label htmlFor="access">Permission of the user</Label>
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

        <ButtonFields>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Invite User
          </LoadingButton>
        </ButtonFields>
      </form>
    </div>
  )
}

interface PermissionModalContentProps {
  handleSubmit: () => void
  handleCopyLink: () => void
}

const PermissionModalContent = ({ handleSubmit, handleCopyLink }: PermissionModalContentProps) => {
  const { getSharedUsersForNode } = useMentions()
  const node = useEditorStore((state) => state.node)

  const sharedUsers = useMemo(() => {
    if (node && node.nodeid) {
      return getSharedUsersForNode(node.nodeid)
    }
    return []
  }, [node, getSharedUsersForNode])

  const onNewInvite = (alias: string, email: string, access: AccessLevel) => {
    console.log('new invite', { alias, email, access })
  }

  const onPermissionChange = (user: string, access: AccessLevel) => {
    console.log('onPermissionChange', { user, access })
  }

  const onUserRemove = (userid: string) => {
    console.log('onUserRemove', { userid })
  }

  return (
    <>
      <ModalHeader>Share Note</ModalHeader>

      <SharedPermissionsWrapper>
        <caption>Users with permission to this note</caption>
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
          return (
            <ShareRow key={`${user.userid}`}>
              <ShareAlias>{user.alias}</ShareAlias>
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
      </SharedPermissionsWrapper>

      <ModalControls>
        <Button large onClick={handleCopyLink}>
          Copy Link
        </Button>
        <Button primary autoFocus={!window.focus} large onClick={handleSubmit}>
          Save
        </Button>
      </ModalControls>
    </>
  )
}

const ShareModal = () => {
  const open = useShareModalStore((store) => store.open)
  const focus = useShareModalStore((store) => store.focus)
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
