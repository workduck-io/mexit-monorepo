/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'

import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'

import { Button, IconButton } from '@workduck-io/mex-components'

import { AccessLevel, DefaultPermissionValue, Mentionable, mog, permissionOptions } from '@mexit/core'
import { StyledCreatatbleSelect } from '@mexit/shared'

import { usePermission } from '../../Hooks/API/usePermission'
import { getAccessValue, useMentions } from '../../Hooks/useMentions'
import { useNodes } from '../../Hooks/useNodes'
import { useAuthStore } from '../../Stores/useAuth'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { ModalControls, ModalHeader, ModalSection, ModalSectionScroll } from '../../Style/Refactor'
import ShareOptions from '../EditorInfobar/ShareOptions'
import { ProfileImage } from '../User/ProfileImage'
import { InvitedUsersContent } from './InvitedUsersContent'
import { MultiEmailInviteModalContent } from './MultiEmailInvite'
import {
  ShareAlias,
  ShareAliasWithImage,
  SharedPermissionsTable,
  ShareEmail,
  ShareOwnerTag,
  SharePermission,
  ShareRow,
  ShareRowAction,
  ShareRowActionsWrapper,
  ShareRowHeading
} from './styles'
import { useNamespaces } from '../../Hooks/useNamespaces'

interface PermissionModalProps {
  type: 'node' | 'space'
}

export const PermissionModalContent = ({ type = 'node' }: PermissionModalProps) => {
  const closeModal = useShareModalStore((s) => s.closeModal)
  const open = useShareModalStore((s) => s.open)
  const { getSharedUsersForNode, getInvitedUsersForNode, applyChangesMentionable } = useMentions()
  const { getSharedUsersForNamespace, getDefaultNamespace } = useNamespaces()
  const mentionable = useMentionStore((s) => s.mentionable)
  const node = useEditorStore((state) => state.node)
  const currentUserDetails = useAuthStore((s) => s.userDetails)
  const changedUsers = useShareModalStore((state) => state.data.changedUsers)
  const setChangedUsers = useShareModalStore((state) => state.setChangedUsers)
  const { changeUserPermission, revokeUserAccess } = usePermission()
  const { accessWhenShared } = useNodes()
  const defaultNamespace = getDefaultNamespace()

  const modalData = useShareModalStore((state) => state.data)
  const nodeid = useMemo(() => modalData?.nodeid ?? node?.nodeid, [modalData.nodeid, node])
  const namespaceid = useMemo(() => modalData?.namespaceid ?? defaultNamespace?.id, [modalData.namespaceid, node])

  const readOnly = useMemo(() => {
    // to test: return true
    const access = accessWhenShared(nodeid)
    if (access) return access !== 'MANAGE'
    return false
  }, [nodeid])

  const [sharedUsers, setSharedUsers] = useState<Mentionable[]>([])

  useEffect(() => {
    if (nodeid) {
      const sUsers = type === 'node' ? getSharedUsersForNode(nodeid) : getSharedUsersForNamespace(namespaceid)
      setSharedUsers(sUsers)
    }
  }, [nodeid, namespaceid, mentionable, open])

  const invitedUsers = useMemo(() => {
    if (nodeid) {
      return getInvitedUsersForNode(nodeid)
    }
    return []
  }, [nodeid])

  const onRevokeAccess = (userid: string) => {
    // mog('onPermissionChange', { userid, alias })

    // Change the user and add to changedUsers
    const changedUser = changedUsers?.find((u) => u.userID === userid)
    const dataUser = sharedUsers?.find((u) => u.userID === userid)

    if (changedUser) {
      const hasBeenRevoked = changedUser.change.includes('revoke')
      if (hasBeenRevoked) {
        changedUser.change = changedUser.change.filter((p) => p !== 'revoke')
        setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
      } else {
        changedUser.change.push('revoke')
        setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
      }
    } else if (dataUser) {
      const changeUser = { ...dataUser, change: ['revoke' as const] }
      setChangedUsers([...(changedUsers ?? []), changeUser])
    }
  }

  const onPermissionChange = (userid: string, access: AccessLevel) => {
    // Change the user and add to changedUsers
    const changedUser = changedUsers?.find((u) => u.userID === userid)
    const dataUser = sharedUsers?.find((u) => u.userID === userid)

    // TODO: Filter for the case when user permission is reverted to the og one
    if (changedUser) {
      const prevAccess = changedUser?.access[node.nodeid]
      const ogAccess = dataUser?.access[node.nodeid]
      if (ogAccess && access === ogAccess) {
        // mog('removing user from changedUsers', { changedUser, access, ogAccess })
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.userID !== userid)])
          }
        }
      } else if (prevAccess !== access) {
        changedUser.access[node.nodeid] = access
        changedUser.change.push('permission')
        setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
      } else {
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.userID !== userid)])
          }
        }
      }
    } else if (dataUser) {
      const prevAccess = dataUser?.access[node.nodeid]
      // mog('onPermissionChange only DataUser', { userid, access, dataUser, prevAccess, node })
      // return
      if (prevAccess !== access) {
        const changeUser = {
          ...dataUser,
          change: ['permission' as const],
          access: { ...dataUser.access, [node.nodeid]: access }
        }
        // changeUser.access[node.nodeid] = access
        setChangedUsers([...(changedUsers ?? []), changeUser])
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
        return { ...acc, [user.userID]: user.access[node.nodeid] }
      }, {})

    const newAliases = withoutRevokeChanges
      .filter((u) => u.change.includes('alias'))
      .reduce((acc, user) => {
        return { ...acc, [user.userID]: user.alias }
      }, {})

    const revokedUsers = changedUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.userID)
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

    closeModal()

    mog('onSave', { changedUsers, newPermissions, newAliases, revokedUsers })
  }

  return (
    <>
      {!readOnly && (
        <ModalSection>
          <MultiEmailInviteModalContent />
        </ModalSection>
      )}

      {sharedUsers.length > 0 && (
        <ModalSection>
          <ModalHeader>Manage Sharing</ModalHeader>
          <ModalSectionScroll>
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

              <tbody>
                {sharedUsers.map((user) => {
                  const hasChanged = changedUsers?.find((u) => u.userID === user.userID)
                  const access = hasChanged ? hasChanged.access[node.nodeid] : user.access[node.nodeid]
                  const isRevoked = !!hasChanged && hasChanged.change.includes('revoke')
                  const isCurrent = user.userID === currentUserDetails.userID

                  return (
                    <ShareRow hasChanged={!!hasChanged} key={`${user.userID}`} isRevoked={isRevoked}>
                      <ShareAlias hasChanged={!!hasChanged}>
                        <ShareAliasWithImage>
                          <ProfileImage email={user.email} size={24} />
                          {`${user.alias}${isCurrent ? ' (you)' : ''}`}
                        </ShareAliasWithImage>
                      </ShareAlias>
                      <ShareEmail>{user.email}</ShareEmail>

                      <SharePermission disabled={readOnly || isCurrent}>
                        {user.access[node.nodeid] === 'OWNER' ? (
                          <ShareOwnerTag>Owner</ShareOwnerTag>
                        ) : (
                          <StyledCreatatbleSelect
                            onChange={(access) => onPermissionChange(user.userID, access.value)}
                            defaultValue={getAccessValue(access) ?? DefaultPermissionValue}
                            options={permissionOptions}
                            closeMenuOnSelect={true}
                            closeMenuOnBlur={true}
                          />
                        )}
                      </SharePermission>
                      <ShareRowAction>
                        <ShareRowActionsWrapper>
                          {!isCurrent && access !== 'OWNER' && (
                            <IconButton
                              disabled={readOnly}
                              onClick={() => onRevokeAccess(user.userID)}
                              icon={deleteBin6Line}
                              title="Remove"
                            />
                          )}
                        </ShareRowActionsWrapper>
                      </ShareRowAction>
                    </ShareRow>
                  )
                })}
              </tbody>
            </SharedPermissionsTable>
          </ModalSectionScroll>

          <ModalControls>
            {/* <Button disabled={readOnly} large onClick={onCopyLink}>
              Copy Link
            </Button> */}
            <Button
              primary
              autoFocus={!window.focus}
              large
              onClick={onSave}
              disabled={readOnly || (changedUsers && changedUsers?.length === 0)}
            >
              Save
            </Button>
          </ModalControls>
        </ModalSection>
      )}

      {!readOnly && invitedUsers.length > 0 && <InvitedUsersContent />}

      {!readOnly && (
        <ModalSection>
          <ShareOptions />
        </ModalSection>
      )}
    </>
  )
}
