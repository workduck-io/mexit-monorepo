import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import timeLine from '@iconify-icons/ri/time-line'
import styled from 'styled-components'

import { MexIcon } from '@workduck-io/mex-components'

import { NodeMetadata } from '@mexit/core'
import {
  DataGroup,
  DataWrapper,
  FlexBetween,
  getMIcon,
  Menu,
  MenuItem,
  MetadataWrapper,
  ProfileIcon,
  RelativeTime
} from '@mexit/shared'

import { useMentions } from '../../Hooks/useMentions'
import { useAuthStore } from '../../Stores/useAuth'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useMetadataStore } from '../../Stores/useMetadataStore'
import useRouteStore from '../../Stores/useRouteStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
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

const Metadata = ({
  nodeId,
  namespaceId,
  hideShareDetails = false,
  fadeOnHover = true,
  publicMetadata
}: MetadataProps) => {
  const noteMetadata = useMetadataStore((state) => state.metadata.notes[nodeId])
  const location = useLocation()
  const openShareModal = useShareModalStore((store) => store.openModal)
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(publicMetadata)
  const isUserEditing = useEditorStore((state) => state.isEditing)
  const mentionable = useMentionStore((s) => s.mentionable)
  const activeUsers = useRouteStore((s) => s.routes[location.pathname]?.users ?? [])
  const { getSharedUsersOfNodeOfSpace } = useMentions()

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
    // mog('ACTIVE USERS', { activeUsers, mentionable })

    const usersWithStatus = sharedUsersOfNode
      .map((user) => {
        const isUserActive = currentUser?.userID === user.userID || activeUsers?.includes(user.userID)
        return { userId: user.userID, active: isUserActive }
      })
      .sort((a, b) => Number(a.active) - Number(b.active))

    return usersWithStatus
  }, [location, activeUsers, mentionable, namespaceId, nodeId])

  const onNoteShareClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    openShareModal('permission', 'note', nodeId)
  }

  if (!publicMetadata && (noteMetadata === undefined || metadata === undefined || isEmpty)) return null
  // mog('METADATA', { metadata, isEmpty, isUserEditing, sharedUsers })

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
        {!publicMetadata && !hideShareDetails && (
          <Data>
            <AvatarGroups users={sharedUsers} limit={5} margin="0 1.5rem 0" />
            <Menu
              key={`Share-modal-menu-${nodeId}`}
              values={<MexIcon noHover icon="bi:three-dots-vertical" width={20} height={20} />}
            >
              <MenuItem
                key="share-menu"
                icon={getMIcon('ICON', 'ri:share-line')}
                onClick={onNoteShareClick}
                label="Share"
              />
            </Menu>
          </Data>
        )}
      </FlexBetween>
    </MetadataWrapper>
  )
}

export default Metadata
