/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'

import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'

import { Button, IconButton } from '@workduck-io/mex-components'

import { AccessLevel, DefaultPermissionValue, Mentionable, mog, permissionOptions } from '@mexit/core'
import { StyledCreatatbleSelect } from '@mexit/shared'

import { useNodeShareAPI } from '../../Hooks/API/useNodeShareAPI'
import { getAccessValue, useMentions } from '../../Hooks/useMentions'
import { useNodes } from '../../Hooks/useNodes'
import { useAuthStore } from '../../Stores/useAuth'
import { useEditorStore } from '../../Stores/useEditorStore'
import { mergeAccess, useMentionStore } from '../../Stores/useMentionsStore'
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
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { usePermissions } from '../../Hooks/usePermissions'
import { useNamespaceApi } from '../../Hooks/API/useNamespaceAPI'
import { useFetchShareData } from '../../Hooks/useFetchShareData'

export const PermissionModalContent = () => {
  const closeModal = useShareModalStore((s) => s.closeModal)
  const open = useShareModalStore((s) => s.open)
  const context = useShareModalStore((s) => s.context)
  const { getSharedUsersForNode, getInvitedUsers, applyChangesMentionable } = useMentions()
  const { getSharedUsersForNamespace, getNamespace } = useNamespaces()
  const mentionable = useMentionStore((s) => s.mentionable)
  const node = useEditorStore((state) => state.node)
  const currentUserDetails = useAuthStore((s) => s.userDetails)
  const changedUsers = useShareModalStore((state) => state.data.changedUsers)
  const setChangedUsers = useShareModalStore((state) => state.setChangedUsers)
  const { changeUserPermission, revokeUserAccess } = useNodeShareAPI()
  const { getAllSharedUsers, revokeNamespaceShare, updateNamespaceShare } = useNamespaceApi()
  const { accessWhenShared } = usePermissions()
  const { fetchSharedUsers } = useFetchShareData()
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)

  const modalData = useShareModalStore((state) => state.data)
  const nodeid = useMemo(() => modalData?.nodeid ?? node?.nodeid, [modalData.nodeid, node])
  const namespaceid = useMemo(() => modalData?.namespaceid ?? currentSpace, [modalData.namespaceid, node, currentSpace])

  const id = useMemo(() => {
    if (context === 'note') return modalData?.nodeid ?? node?.nodeid
    else return modalData?.namespaceid ?? currentSpace
  }, [modalData.nodeid, node, modalData.namespaceid, currentSpace, context])

  const readOnly = useMemo(() => {
    // to test: return true
    if (context === 'note') {
      const access = accessWhenShared(id)
      if (access) return access.note !== 'MANAGE' || access.space !== 'MANAGE'
      return false
    } else if (context === 'space') {
      const ns = getNamespace(id)
      if (ns.access) return ns.access !== 'MANAGE'
      return false
    }
    return false
  }, [id])

  useEffect(() => {
    if (open && context === 'space') {
      // Fetch all user details for the space
      fetchSharedUsers(id, 'space')
    }
  }, [open, context, id])

  const [sharedUsers, setSharedUsers] = useState<Mentionable[]>([])

  useEffect(() => {
    if (nodeid || namespaceid) {
      const sUsers = context === 'note' ? getSharedUsersForNode(nodeid) : getSharedUsersForNamespace(namespaceid)
      setSharedUsers(sUsers)
    }
  }, [nodeid, namespaceid, context, mentionable, open])

  const invitedUsers = useMemo(() => {
    if (id) {
      return getInvitedUsers(id, context)
    }
    return []
  }, [id, context])

  const onRevokeAccess = (userid: string) => {
    mog('onrevokeAccess', { userid })

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
    mog('onPermissionChange', { userid, access })
    // Change the user and add to changedUsers
    const changedUser = changedUsers?.find((u) => u.userID === userid)
    const dataUser = sharedUsers?.find((u) => u.userID === userid)

    // TODO: Filter for the case when user permission is reverted to the og one
    if (changedUser) {
      const prevAccess = changedUser?.access[context][id]
      const ogAccess = dataUser?.access[context][id]
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
        changedUser.access[context][id] = access
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
      const prevAccess = dataUser?.access[context][id]
      // mog('onPermissionChange only DataUser', { userid, access, dataUser, prevAccess, node })
      // return
      if (prevAccess !== access) {
        const changeUser = {
          ...dataUser,
          change: ['permission' as const],
          access: mergeAccess(dataUser.access, { [context]: { [id]: access } })
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
        return { ...acc, [user.userID]: user.access[context][id] }
      }, {})

    const revokedUsers = changedUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.userID)
        return acc
      }, [])

    // mog('Updating after the table changes ', { revokedUsers, newPermissions })

    const applyPermissions = async () => {
      if (Object.keys(newPermissions).length > 0) {
        if (context === 'note') {
          await changeUserPermission(node.nodeid, newPermissions)
        } else {
          mog('applyPermissions for namespace', { context, node, newPermissions, revokedUsers })
          await updateNamespaceShare(namespaceid, newPermissions)
        }
      }

      if (revokedUsers.length > 0) {
        if (context === 'note') {
          await revokeUserAccess(node.nodeid, revokedUsers)
        } else {
          mog('revokeAccess for namespace', { context, node, newPermissions, revokedUsers })
          await revokeNamespaceShare(namespaceid, revokedUsers)
        }
      }
      // mog('set new permissions', { userRevoke })
      applyChangesMentionable(newPermissions, revokedUsers, context, id)
    }

    await applyPermissions()

    closeModal()

    mog('onSave', { changedUsers, newPermissions, revokedUsers })
  }

  // mog('render', { context, id, changedUsers, sharedUsers, invitedUsers })

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
          <SharedPermissionsTable>
            <caption>Users with access to this {context}</caption>
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
                const access = hasChanged ? hasChanged.access[context][id] : user.access[context][id]
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
                      {user.access[context][id] === 'OWNER' ? (
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
          <ShareOptions context={context} id={id} />
        </ModalSection>
      )}
    </>
  )
}
