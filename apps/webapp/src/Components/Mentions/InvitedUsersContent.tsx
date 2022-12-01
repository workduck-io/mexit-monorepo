import React, { useMemo } from 'react'

import { Button,IconButton } from '@workduck-io/mex-components'

import { AccessLevel, DefaultPermissionValue, InvitedUser, mog, permissionOptions } from '@mexit/core'
import { StyledCreatatbleSelect } from '@mexit/shared'

import { useNodeShareAPI } from '../../Hooks/API/useNodeShareAPI'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { getAccessValue,useMentions } from '../../Hooks/useMentions'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { ModalControls,ModalHeader } from '../../Style/Refactor'
import {
  ShareAlias,
  ShareAliasInput,
  SharedPermissionsTable,
  SharedPermissionsWrapper,
  ShareEmail,
  SharePermission,
  ShareRow,
  ShareRowAction,
  ShareRowActionsWrapper,
  ShareRowHeading} from './styles'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import repeatLine from '@iconify/icons-ri/repeat-line'

// Here since we don't have a specific userid we take email to be a unique key.
export const InvitedUsersContent = (/*{}: PermissionModalContentProps*/) => {
  const { getInvitedUsers } = useMentions()
  const node = useEditorStore((state) => state.node)
  const { grantUsersPermission } = useNodeShareAPI()
  const { getUserDetails } = useUserService()
  const invitedUsers = useMentionStore((s) => s.invitedUsers)
  const changedIUsers = useShareModalStore((state) => state.data.changedInvitedUsers)
  const setChangedIUsers = useShareModalStore((state) => state.setChangedInvitedUsers)

  const modalData = useShareModalStore((state) => state.data)
  const context = useShareModalStore((state) => state.context)
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)

  const id = useMemo(() => {
    if (context === 'note') return modalData?.nodeid ?? node?.nodeid
    else return modalData?.namespaceid ?? currentSpace
  }, [modalData.nodeid, node, modalData.namespaceid, currentSpace, context])

  const sharedIUsers = useMemo(() => {
    if (id) {
      return getInvitedUsers(id, context)
    }
    return []
  }, [id, context, invitedUsers])

  // This is called for every keystroke
  const onAliasChange = (email: string, alias: string) => {
    mog('onAliasCHange', { email, alias })

    // Change the user and add to changedUsers
    const changedUser = changedIUsers?.find((u) => u.email === email)
    const dataUser = sharedIUsers?.find((u) => u.email === email)

    if (changedUser) {
      changedUser.alias = alias
      changedUser.change.push('alias')
      setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
    } else if (dataUser) {
      dataUser.alias = alias
      const changeUser = { ...dataUser, change: ['alias' as const] }
      setChangedIUsers([...changedIUsers, changeUser])
    }
  }

  // This is called for every keystroke
  const onRevokeAccess = (email: string) => {
    // mog('onPermissionChange', { userid, email })

    // Change the user and add to changedUsers
    const changedUser = changedIUsers.find((u) => u.email === email)
    const dataUser = sharedIUsers.find((u) => u.email === email)

    if (changedUser) {
      const hasBeenRevoked = changedUser.change.includes('revoke')
      if (hasBeenRevoked) {
        changedUser.change = changedUser.change.filter((p) => p !== 'revoke')
        setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
      } else {
        changedUser.change.push('revoke')
        setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
      }
    } else if (dataUser) {
      const changeUser = { ...dataUser, change: ['revoke' as const] }
      setChangedIUsers([...changedIUsers, changeUser])
    }
  }

  const onPermissionChange = (email: string, access: AccessLevel) => {
    // Change the user and add to changedUsers
    const changedUser = changedIUsers.find((u) => u.email === email)
    const dataUser = sharedIUsers.find((u) => u.email === email)
    mog('onPermissionChange', { email, access, changedIUsers, changedUser, dataUser })

    // TODO: Filter for the case when user permission is reverted to the og one
    if (changedUser) {
      const prevAccess = changedUser?.access[node.nodeid]
      const ogAccess = dataUser?.access[node.nodeid]
      if (ogAccess && access === ogAccess) {
        mog('removing user from changedUsers', { changedUser, access, ogAccess })
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
          } else {
            setChangedIUsers([...changedIUsers.filter((u) => u.email !== email)])
          }
        }
      } else if (prevAccess !== access) {
        changedUser.access[node.nodeid] = access
        changedUser.change.push('permission')
        setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
      } else {
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
          } else {
            setChangedIUsers([...changedIUsers.filter((u) => u.email !== email)])
          }
        }
      }
    } else if (dataUser) {
      const prevAccess = dataUser?.access[node.nodeid]
      if (prevAccess !== access) {
        dataUser.access[node.nodeid] = access
        const changeUser = { ...dataUser, change: ['permission' as const] }
        setChangedIUsers([...changedIUsers, changeUser])
      }
    }
  }

  const onReinviteUser = async (user: InvitedUser) => {
    const uDetails = await getUserDetails(user.email)
    mog('Reinviting that damn user', { user, uDetails })
    const changedUser = changedIUsers.find((u) => u.email === user.email)
    const dataUser = sharedIUsers.find((u) => u.email === user.email)
    const access = changedUser ? changedUser.access[node.nodeid] : dataUser.access[node.nodeid] ?? undefined
    if (uDetails && access) {
      const res = await grantUsersPermission(node.nodeid, [uDetails.userID], access)
      mog('ReinviteUser', { res })
    }
  }

  const onSave = async () => {
    // Only when change is done to permission

    // We change for users that have not been revoked
    const withoutRevokeChanges = changedIUsers.filter((u) => !u.change.includes('revoke'))
    const newPermissions: { [email: string]: AccessLevel } = withoutRevokeChanges
      .filter((u) => u.change.includes('permission'))
      .reduce((acc, user) => {
        return { ...acc, [user.email]: user.access[node.nodeid] }
      }, {})

    const newAliases = withoutRevokeChanges
      .filter((u) => u.change.includes('alias'))
      .reduce((acc, user) => {
        acc.push({
          email: user.email,
          alias: user.alias
        })
        return acc
      }, [])

    const revokedUsers = changedIUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.email)
        return acc
      }, [])

    // const applyPermissions = async () => {
    //   const userChangePerm = await changeUserPermission(node.nodeid, newPermissions)
    //   const userRevoke = await revokeUserAccess(node.nodeid, revokedUsers)
    //   mog('set new permissions', { userChangePerm, userRevoke })
    // }

    // await applyPermissions()

    // closeModal()

    mog('onSave', { changedIUsers, newPermissions, newAliases, revokedUsers })
  }

  // mog('ShareInvitedPermissions go brrr', {
  //   sharedIUsers
  // })

  return (
    <SharedPermissionsWrapper>
      <ModalHeader>Invited Users</ModalHeader>

      <SharedPermissionsTable>
        <caption>
          Users invited to this note <em>that are not on Mex</em>
        </caption>
        <ShareRowHeading>
          <tr>
            <td>Alias</td>
            <td>Email</td>
            <td>Permission</td>
            <td></td>
          </tr>
        </ShareRowHeading>

        {sharedIUsers.map((user) => {
          const access = user.access[node.nodeid]
          const hasChanged = changedIUsers && changedIUsers.find((u) => u.email === user.email)
          const isRevoked = !!hasChanged && hasChanged.change.includes('revoke')
          return (
            <ShareRow hasChanged={!!hasChanged} key={`${user.email}`} isRevoked={isRevoked}>
              <ShareAlias hasChanged={!!hasChanged}>
                <ShareAliasInput
                  type="text"
                  defaultValue={user.alias}
                  onChange={(e) => onAliasChange(user.email, e.target.value)}
                />
              </ShareAlias>
              <ShareEmail>{user.email}</ShareEmail>

              <SharePermission>
                <StyledCreatatbleSelect
                  onChange={(access) => onPermissionChange(user.email, access.value)}
                  defaultValue={getAccessValue(access) ?? DefaultPermissionValue}
                  options={permissionOptions}
                  closeMenuOnSelect={true}
                  closeMenuOnBlur={true}
                />
              </SharePermission>
              <ShareRowAction>
                <ShareRowActionsWrapper>
                  <IconButton
                    transparent={false}
                    onClick={() => onReinviteUser(user)}
                    icon={repeatLine}
                    title="Reinvite User"
                  />
                  <IconButton onClick={() => onRevokeAccess(user.email)} icon={deleteBin6Line} title="Remove" />
                </ShareRowActionsWrapper>
              </ShareRowAction>
            </ShareRow>
          )
        })}
      </SharedPermissionsTable>

      <ModalControls>
        <Button
          primary
          autoFocus={!window.focus}
          large
          onClick={onSave}
          disabled={changedIUsers && changedIUsers.length === 0}
        >
          Save
        </Button>
      </ModalControls>
    </SharedPermissionsWrapper>
  )
}
