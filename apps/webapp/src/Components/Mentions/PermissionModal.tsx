import React, { useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { mog, AccessLevel, DefaultPermissionValue, permissionOptions, DefaultPermission } from '@mexit/core'
import { Label, StyledCreatatbleSelect, ButtonFields, IconButton, Title, Button, SelectWrapper } from '@mexit/shared'

import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'

import { useMentions, getAccessValue } from '../../Hooks/useMentions'
import { useEditorStore } from '../../Stores/useEditorStore'
import { ModalHeader, ModalControls } from '../../Style/Refactor'
import { getEmailStart, MultiEmailValidate } from '../../Utils/constants'
import { LoadingButton } from '../Buttons/Buttons'
import { InputFormError } from '../Input'
import {
  InviteFormWrapper,
  InviteWrapper,
  ShareAlias,
  SharedPermissionsTable,
  SharedPermissionsWrapper,
  ShareEmail,
  SharePermission,
  ShareRowAction,
  ShareRow,
  ShareRowHeading,
  ShareRowActionsWrapper,
  InviteFormFieldset,
  ShareProfileImage
} from './styles'
import { usePermission } from '../../Hooks/API/usePermission'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { InviteModalData, useShareModalStore } from '../../Stores/useShareModalStore'
import { InvitedUsersContent } from './InvitedUsersContent'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useAuthStore } from '../../Stores/useAuth'
import { ProfileImage } from '../User/ProfileImage'
import { useNodes } from '../../Hooks/useNodes'

export const MultiEmailInviteModalContent = ({ disabled }: { disabled?: boolean }) => {
  const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const addMentionable = useMentionStore((state) => state.addMentionable)
  // const closeModal = useShareModalStore((state) => state.closeModal)
  const { getUserDetails } = useUserService()
  const { grantUsersPermission } = usePermission()
  const localuserDetails = useAuthStore((s) => s.userDetails)
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
      const allMails = data.email.split(',').map((e) => e.trim())
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const userDetailPromises = allMails
        .filter((e) => e !== localuserDetails.email)
        .map((email) => {
          return getUserDetails(email)
        })

      const userDetails = await Promise.allSettled(userDetailPromises)

      mog('userDetails', { userDetails })

      // Typescript has some weird thing going on with promises.
      // Try to improve the type (if you can that is)
      const existing = userDetails.filter((p) => p.status === 'fulfilled' && p.value.userID !== undefined) as any[]
      const absent = userDetails.filter((p) => p.status === 'fulfilled' && p.value.userID === undefined) as any[]

      const givePermToExisting = existing
        .reduce((p, c) => {
          return [...p, c.value.userID]
        }, [])
        .filter((u) => u !== localuserDetails.userID)

      // Only share with users registered,
      if (givePermToExisting.length > 0) {
        const permGiven = await grantUsersPermission(node.nodeid, givePermToExisting, access)
        mog('userDetails', { userDetails, permGiven, existing, absent, givePermToExisting })
      }

      existing.forEach((u) => {
        addMentionable({
          type: 'mentionable',
          alias: u?.value?.alias ?? '',
          email: u?.value?.email,
          userid: u?.value?.userID,
          access: {
            [node?.nodeid]: access
          }
        })
      })

      // Add the rest to invited users
      absent.forEach((u) => {
        addInvitedUser({
          type: 'invite',
          alias: getEmailStart(u?.value?.email),
          email: u?.value?.email,
          access: {
            [node?.nodeid]: access
          }
        })
      })
    }
  }

  // mog('MultiEmailInvite', { errors })

  return (
    <InviteWrapper>
      <Title>Invite</Title>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InviteFormFieldset disabled={disabled}>
          <InputFormError
            name="email"
            label="Emails"
            inputProps={{
              autoFocus: true,
              placeholder: 'alice@email.com, bob@email.com',
              type: 'email',
              // Accepts multiple emails
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
        </InviteFormFieldset>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}

export const PermissionModalContent = (/*{}: PermissionModalContentProps*/) => {
  const closeModal = useShareModalStore((s) => s.closeModal)
  const { getSharedUsersForNode, getInvitedUsersForNode, applyChangesMentionable } = useMentions()
  const mentionable = useMentionStore((s) => s.mentionable)
  const node = useEditorStore((state) => state.node)
  const currentUserDetails = useAuthStore((s) => s.userDetails)
  const changedUsers = useShareModalStore((state) => state.data.changedUsers)
  const setChangedUsers = useShareModalStore((state) => state.setChangedUsers)
  const { changeUserPermission, revokeUserAccess } = usePermission()
  const { accessWhenShared } = useNodes()

  const readOnly = useMemo(() => {
    // to test: return true
    const access = accessWhenShared(node.nodeid)
    if (access) return access !== 'MANAGE'
    return false
  }, [node])

  const sharedUsers = useMemo(() => {
    if (node && node.nodeid) {
      return getSharedUsersForNode(node.nodeid)
    }
    return []
  }, [node, getSharedUsersForNode, mentionable])

  const invitedUsers = useMemo(() => {
    if (node && node.nodeid) {
      return getInvitedUsersForNode(node.nodeid)
    }
    return []
  }, [node, getInvitedUsersForNode])

  const onCopyLink = () => {
    closeModal()
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

  // This is called for every keystroke
  const onRevokeAccess = (userid: string) => {
    // mog('onPermissionChange', { userid, alias })

    // Change the user and add to changedUsers
    const changedUser = changedUsers.find((u) => u.userid === userid)
    const dataUser = sharedUsers.find((u) => u.userid === userid)

    if (changedUser) {
      const hasBeenRevoked = changedUser.change.includes('revoke')
      if (hasBeenRevoked) {
        changedUser.change = changedUser.change.filter((p) => p !== 'revoke')
        setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
      } else {
        changedUser.change.push('revoke')
        setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
      }
    } else if (dataUser) {
      const changeUser = { ...dataUser, change: ['revoke' as const] }
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
        return { ...acc, [user.userid]: user.alias }
      }, {})

    const revokedUsers = changedUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.userid)
        return acc
      }, [])

    mog('Updating after the table changes ', { newAliases, revokedUsers, newPermissions })

    const applyPermissions = async () => {
      if (Object.keys(newPermissions).length > 0) await changeUserPermission(node.nodeid, newPermissions)

      if (revokedUsers.length > 0) await revokeUserAccess(node.nodeid, revokedUsers)
      // mog('set new permissions', { userRevoke })
      applyChangesMentionable(newPermissions, newAliases, revokedUsers, node.nodeid)
    }

    await applyPermissions()

    // Update Aliases
    // Update Permissions
    // Delete Revoked

    closeModal()

    mog('onSave', { changedUsers, newPermissions, newAliases, revokedUsers })
  }

  // mog('ShareInvitedPermissions go brrr', {
  //   sharedUsers,
  //   changedUsers
  // })

  return (
    <SharedPermissionsWrapper>
      <ModalHeader>Share Note</ModalHeader>

      {!readOnly && <MultiEmailInviteModalContent />}

      {sharedUsers.length > 0 && (
        <>
          <SharedPermissionsTable>
            <caption>Users with access to this note</caption>
            <ShareRowHeading>
              <tr>
                <td></td>
                <td>Alias</td>
                <td>Email</td>
                <td>Permission</td>
                <td></td>
              </tr>
            </ShareRowHeading>

            {sharedUsers.map((user) => {
              const access = user.access[node.nodeid]
              const hasChanged = changedUsers.find((u) => u.userid === user.userid)
              const isRevoked = !!hasChanged && hasChanged.change.includes('revoke')
              const isCurrent = user.userid === currentUserDetails.userID
              return (
                <ShareRow hasChanged={!!hasChanged} key={`${user.userid}`} isRevoked={isRevoked}>
                  <ShareProfileImage>
                    <ProfileImage email={user.email} size={24} />
                  </ShareProfileImage>
                  <ShareAlias hasChanged={!!hasChanged}>
                    {/*<ShareAliasInput
                      type="text"
                      disabled={true}
                      defaultValue={`${user.alias}${isCurrent ? ' (you)' : ''}`}
                      onChange={(e) => onAliasChange(user.userid, e.target.value)}
                    /> */}
                    {`${user.alias}${isCurrent ? ' (you)' : ''}`}
                  </ShareAlias>
                  <ShareEmail>{user.email}</ShareEmail>

                  <SharePermission disabled={readOnly}>
                    <StyledCreatatbleSelect
                      onChange={(access) => onPermissionChange(user.userid, access.value)}
                      defaultValue={getAccessValue(access) ?? DefaultPermissionValue}
                      options={permissionOptions}
                      closeMenuOnSelect={true}
                      closeMenuOnBlur={true}
                    />
                  </SharePermission>
                  <ShareRowAction>
                    <ShareRowActionsWrapper>
                      <IconButton
                        disabled={readOnly}
                        onClick={() => onRevokeAccess(user.userid)}
                        icon={deleteBin6Line}
                        title="Remove"
                      />
                    </ShareRowActionsWrapper>
                  </ShareRowAction>
                </ShareRow>
              )
            })}
          </SharedPermissionsTable>

          <ModalControls>
            <Button disabled={readOnly} large onClick={onCopyLink}>
              Copy Link
            </Button>
            <Button
              primary
              autoFocus={!window.focus}
              large
              onClick={onSave}
              disabled={readOnly || (changedUsers && changedUsers.length === 0)}
            >
              Save
            </Button>
          </ModalControls>
        </>
      )}

      {!readOnly && invitedUsers.length > 0 && <InvitedUsersContent />}
    </SharedPermissionsWrapper>
  )
}
