import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import timeLine from '@iconify-icons/ri/time-line'
import styled from 'styled-components'

import { IconButton, MexIcon } from '@workduck-io/mex-components'

import {
  FeatureFlags,
  NodeMetadata,
  useAuthStore,
  useEditorStore,
  useMentionStore,
  useMetadataStore,
  useRouteStore,
  useShareModalStore
} from '@mexit/core'
import {
  DataGroup,
  DataWrapper,
  FlexBetween,
  MetadataWrapper,
  ProfileIcon,
  RelativeTime,
  useFeatureFlag
} from '@mexit/shared'

import { useMentions } from '../../Hooks/useMentions'
import { compareAccessLevel, usePermissions } from '../../Hooks/usePermissions'
import AvatarGroups from '../AvatarGroups'
import { ProfileImageWithToolTip } from '../User/ProfileImage'

export const Data = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  color: ${({ theme }) => theme.tokens.text.fade};
`

interface MetadataProps {
  nodeId: string
  namespaceId: string
  fadeOnHover?: boolean
  publicMetadata?: NodeMetadata
  hideShareDetails?: boolean
}

const Metadata = ({ nodeId, namespaceId, fadeOnHover = true, publicMetadata }: MetadataProps) => {
  const noteMetadata = useMetadataStore((state) => state.metadata.notes[nodeId])
  const { isEnabled } = useFeatureFlag(FeatureFlags.PRESENTATION)

  const location = useLocation()
  const openShareModal = useShareModalStore((store) => store.openModal)
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(publicMetadata)
  const isUserEditing = useEditorStore((state) => state.isEditing)
  const mentionable = useMentionStore((s) => s.mentionable)
  const activeUsers = useRouteStore((s) => s.routes[location.pathname]?.users ?? [])
  const { getSharedUsersOfNodeOfSpace } = useMentions()
  const { accessWhenShared } = usePermissions()

  const getIsSharedDisabled = () => {
    const access = accessWhenShared(nodeId)
    const accessPriority = compareAccessLevel(access?.note, access?.space)

    return accessPriority !== 'MANAGE' && accessPriority !== 'OWNER'
  }

  const navigate = useNavigate()

  const hideShareDetails = getIsSharedDisabled()

  const isEmpty =
    metadata &&
    metadata.createdAt === undefined &&
    metadata.createdBy === undefined &&
    metadata.updatedAt === undefined &&
    metadata.lastEditedBy === undefined

  useEffect(() => {
    if (noteMetadata === undefined) return
    setMetadata(noteMetadata)
  }, [nodeId, noteMetadata])

  const sharedUsers = useMemo(() => {
    const sharedUsersOfNode = getSharedUsersOfNodeOfSpace(nodeId, namespaceId)
    const currentUser = useAuthStore.getState().userDetails

    const usersWithStatus = sharedUsersOfNode
      .map((user) => {
        const isUserActive = currentUser?.id === user.id || activeUsers?.includes(user.id)
        return { userId: user.id, active: isUserActive }
      })
      .sort((a, b) => Number(a.active) - Number(b.active))

    return usersWithStatus
  }, [location, activeUsers, mentionable, namespaceId, nodeId])

  const onNoteShareClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    openShareModal('permission', 'note', nodeId)
  }

  const onPresentNoteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // * Show element in full screen mode
    navigate({ search: '?present=true' }, { replace: true })
  }

  if (!publicMetadata && (noteMetadata === undefined || metadata === undefined || isEmpty)) return null

  return (
    <MetadataWrapper $isVisible={!isUserEditing}>
      <FlexBetween>
        <DataGroup>
          {metadata.lastEditedBy !== undefined && (
            <DataWrapper interactive={metadata.updatedAt !== undefined}>
              {metadata.lastEditedBy !== undefined ? (
                <ProfileIcon data-title={metadata.lastEditedBy}>
                  <ProfileImageWithToolTip props={{ userid: metadata.lastEditedBy, size: 16 }} placement="bottom" />
                </ProfileIcon>
              ) : (
                <MexIcon noHover height={20} width={20} icon={timeLine}></MexIcon>
              )}
              <div>
                {metadata.updatedAt !== undefined && (
                  <Data>
                    <RelativeTime prefix="Last Edited" dateNum={metadata.updatedAt} />
                  </Data>
                )}
              </div>
            </DataWrapper>
          )}
        </DataGroup>
        <Data>
          {!publicMetadata && !hideShareDetails && (
            <>
              <AvatarGroups users={sharedUsers} limit={5} margin="0 1.5rem 0" />
              <IconButton title="Share Note" icon={'ri:share-line'} onClick={onNoteShareClick} />
            </>
          )}
          {isEnabled && <IconButton title="Present Note" icon={'bx:slideshow'} onClick={onPresentNoteClick} />}
        </Data>
      </FlexBetween>
    </MetadataWrapper>
  )
}

export default Metadata
