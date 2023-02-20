/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'

import { AccessLevel, DefaultPermissionValue, Mentionable, mog, permissionOptions } from '@mexit/core'
import {
  Center,
  copyTextToClipboard,
  DefaultMIcons,
  GenericFlex,
  IconDisplay,
  mergeAccess,
  StyledCreatatbleSelect
} from '@mexit/shared'

import { useNamespaceApi } from '../../Hooks/API/useNamespaceAPI'
import { useNodeShareAPI } from '../../Hooks/API/useNodeShareAPI'
import { useFetchShareData } from '../../Hooks/useFetchShareData'
import { getAccessValue, useMentions } from '../../Hooks/useMentions'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNodes } from '../../Hooks/useNodes'
import { getUserAccess, usePermissions } from '../../Hooks/usePermissions'
import { useAuthStore } from '../../Stores/useAuth'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { ModalActions, ModalFooter } from '../../Style/Refactor'
import ShareOptions from '../EditorInfobar/ShareOptions'
import { ProfileImage } from '../User/ProfileImage'

import { MultiEmailInviteModalContent } from './MultiEmailInvite'
import {
  ShareAlias,
  ShareAliasWithImage,
  SharedPermissionsTable,
  ShareEmail,
  ShareOwnerTag,
  SharePermission,
  ShareRow,
  StyledSaveButton,
  TableBody,
  TableContainer
} from './styles'

export const PermissionModalContent = () => {
  const open = useShareModalStore((s) => s.open)
  const node = useEditorStore((state) => state.node)
  const context = useShareModalStore((s) => s.context)
  const mentionable = useMentionStore((s) => s.mentionable)
  const closeModal = useShareModalStore((s) => s.closeModal)
  const modalData = useShareModalStore((state) => state.data)
  const currentUserDetails = useAuthStore((s) => s.userDetails)
  const changedUsers = useShareModalStore((state) => state.data.changedUsers)
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)
  const setChangedUsers = useShareModalStore((state) => state.setChangedUsers)

  const { getNoteCopyUrl } = useNodes()
  const { accessWhenShared } = usePermissions()
  const { fetchSharedUsers } = useFetchShareData()
  const { changeUserPermission, revokeUserAccess } = useNodeShareAPI()
  const { revokeNamespaceShare, updateNamespaceShare } = useNamespaceApi()
  const { getSharedUsersForNamespace, getNamespace, getSpaceCopyUrl, getNamespaceOfNodeid } = useNamespaces()
  const { getSharedUsersOfNodeOfSpace, getInvitedUsers, applyChangesMentionable } = useMentions()

  const nodeid = useMemo(() => modalData?.nodeid ?? node?.nodeid, [modalData.nodeid, node])

  const namespaceid = useMemo(() => {
    if (modalData.nodeid) return getNamespaceOfNodeid(modalData.nodeid)?.id

    return modalData?.namespaceid ?? currentSpace
  }, [modalData.namespaceid, node, currentSpace])

  const id = useMemo(() => {
    if (context === 'note') return modalData?.nodeid ?? node?.nodeid
    else return modalData?.namespaceid ?? currentSpace
  }, [modalData.nodeid, node, modalData.namespaceid, currentSpace, context])

  const readOnly = useMemo(() => {
    // to test: return true
    if (context === 'note') {
      const access = accessWhenShared(id)
      if (access) {
        if (access.note) return access.note !== 'OWNER' && access.note !== 'MANAGE'
        if (access.space) return access.space !== 'OWNER' && access.space !== 'MANAGE'
      }
      return false
    } else if (context === 'space') {
      const ns = getNamespace(id)
      if (ns?.access) return ns.access !== 'OWNER' && ns.access !== 'MANAGE'
      return false
    }
    return false
  }, [id])

  useEffect(() => {
    if (open) {
      // Fetch all user details for the space
      fetchSharedUsers(context === 'space' ? id : node.namespace, 'space')
    }
  }, [open, context, id])

  const [sharedUsers, setSharedUsers] = useState<Mentionable[]>([])

  useEffect(() => {
    if (nodeid || namespaceid) {
      const sUsers =
        context === 'note' ? getSharedUsersOfNodeOfSpace(nodeid, namespaceid) : getSharedUsersForNamespace(namespaceid)
      setSharedUsers(sUsers)
    }
  }, [nodeid, namespaceid, context, mentionable, open])

  const onRevokeAccess = (userid: string) => {
    // Change the user and add to changedUsers
    const changedUser = changedUsers?.find((u) => u.id === userid)
    const dataUser = sharedUsers?.find((u) => u.id === userid)

    if (changedUser) {
      const hasBeenRevoked = changedUser.change.includes('revoke')
      if (hasBeenRevoked) {
        changedUser.change = changedUser.change.filter((p) => p !== 'revoke')
        setChangedUsers([...changedUsers.filter((u) => u.id !== userid), changedUser])
      } else {
        changedUser.change.push('revoke')
        setChangedUsers([...changedUsers.filter((u) => u.id !== userid), changedUser])
      }
    } else if (dataUser) {
      const changeUser = { ...dataUser, change: ['revoke' as const] }
      setChangedUsers([...(changedUsers ?? []), changeUser])
    }
  }

  const onPermissionChange = (userid: string, access: AccessLevel | 'Revoke') => {
    mog('onPermissionChange', { userid, access })
    // Change the user and add to changedUsers
    const changedUser = changedUsers?.find((u) => u.id === userid)
    const dataUser = sharedUsers?.find((u) => u.id === userid)

    if (access === 'Revoke') {
      onRevokeAccess(userid)
      return
    }

    // TODO: Filter for the case when user permission is reverted to the og one
    if (changedUser) {
      const prevAccess = changedUser?.access[context][id]
      const ogAccess = dataUser?.access[context][id]

      if (ogAccess && access === ogAccess) {
        // mog('removing user from changedUsers', { changedUser, access, ogAccess })
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.id !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.id !== userid)])
          }
        }
      } else if (prevAccess !== access) {
        changedUser.access[context][id] = access
        changedUser.change.push('permission')
        setChangedUsers([...changedUsers.filter((u) => u.id !== userid), changedUser])
      } else {
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.id !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.id !== userid)])
          }
        }
      }
    } else if (dataUser) {
      const prevAccess = dataUser?.access[context][id]
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
        return { ...acc, [user.id]: user.access[context][id] }
      }, {})

    const revokedUsers = changedUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.id)
        return acc
      }, [])

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

  const handleCopyLink = () => {
    const url = context === 'note' ? getNoteCopyUrl(id) : getSpaceCopyUrl(id)
    copyTextToClipboard(url, 'Public Link Copied!')
  }

  /**
   * Toggle Share/Public Button
   * Invite Input Box - inline elements
   * Users List with Access
   */

  return (
    <>
      {!readOnly && (
        <Center>
          <ShareOptions context={context} id={id} />
        </Center>
      )}

      {!readOnly && <MultiEmailInviteModalContent />}

      {sharedUsers.length > 0 ? (
        <TableContainer id="table">
          <SharedPermissionsTable>
            <TableBody>
              {sharedUsers.map((user) => {
                const hasChanged = changedUsers?.find((u) => u.id === user.id)
                const access = getUserAccess(hasChanged ?? user, context, id, namespaceid)
                const isRevoked = !!hasChanged && hasChanged.change.includes('revoke')
                const isCurrent = user.id === currentUserDetails.id

                const options = [
                  ...permissionOptions,
                  ...(!isCurrent && access !== 'OWNER' ? [{ value: 'Revoke', label: 'Revoke' }] : [])
                ]

                return (
                  <ShareRow hasChanged={!!hasChanged} key={`${user.id}`} isRevoked={isRevoked}>
                    <ShareAlias hasChanged={!!hasChanged}>
                      <ShareAliasWithImage>
                        <ProfileImage email={user.email} size={24} />
                        {`${user.alias}${isCurrent ? ' (you)' : ''}`}
                      </ShareAliasWithImage>
                    </ShareAlias>
                    <ShareEmail>{user.email}</ShareEmail>

                    <SharePermission disabled={readOnly || isCurrent}>
                      {access === 'OWNER' ? (
                        <ShareOwnerTag>Owner</ShareOwnerTag>
                      ) : (
                        <StyledCreatatbleSelect
                          isSearchable={false}
                          menuPortalTarget={document.getElementById('table')}
                          onChange={(access) => onPermissionChange(user.id, access.value)}
                          defaultValue={getAccessValue(access) ?? DefaultPermissionValue}
                          options={options}
                          style={{ transparent: true }}
                          isDisabled={readOnly || isCurrent}
                          closeMenuOnSelect={true}
                          closeMenuOnBlur={true}
                        />
                      )}
                    </SharePermission>
                  </ShareRow>
                )
              })}
            </TableBody>
          </SharedPermissionsTable>
        </TableContainer>
      ) : (
        <></>
      )}

      <ModalFooter>
        <ModalActions>
          <StyledSaveButton onClick={handleCopyLink}>
            <GenericFlex>
              <IconDisplay icon={DefaultMIcons.WEB_LINK} />
              Copy Link
            </GenericFlex>
          </StyledSaveButton>
          <StyledSaveButton autoFocus={!window.focus} disabled={readOnly || !changedUsers?.length} onClick={onSave}>
            Save
          </StyledSaveButton>
        </ModalActions>
      </ModalFooter>
    </>
  )
}
