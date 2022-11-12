import React, { useEffect, useMemo, useState } from 'react'

import timeLine from '@iconify-icons/ri/time-line'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { MexIcon } from '@workduck-io/mex-components'

import { mog, NodeMetadata } from '@mexit/core'
import { FlexBetween, Menu, MenuItem, ProfileIcon } from '@mexit/shared'
import { DataGroup, DataWrapper, MetadataWrapper } from '@mexit/shared'
import { RelativeTime } from '@mexit/shared'

import { useMentions } from '../../Hooks/useMentions'
import { useAuthStore } from '../../Stores/useAuth'
import { useContentStore } from '../../Stores/useContentStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import useRouteStore from '../../Stores/useRouteStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import AvatarGroups from '../AvatarGroups'
import { ProfileImageWithToolTip } from '../User/ProfileImage'

export const Data = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  color: ${({ theme }) => theme.colors.text.fade};
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
  // const node = useEditorStore((state) => state.node)
  const getContent = useContentStore((state) => state.getContent)
  const location = useLocation()
  const content = getContent(nodeId)
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
    if (content === undefined || content.metadata === undefined) return
    const { metadata: contentMetadata } = content
    setMetadata(contentMetadata)
  }, [nodeId, content, content?.metadata])

  const sharedUsers = useMemo(() => {
    const sharedUsersOfNode = getSharedUsersOfNodeOfSpace(nodeId, namespaceId)
    const currentUser = useAuthStore.getState().userDetails
    mog('ACTIVE USERS', { activeUsers, mentionable })

    const usersWithStatus = sharedUsersOfNode
      .map((user) => {
        const isUserActive = currentUser?.userID === user.userID || activeUsers?.includes(user.userID)
        return { userId: user.userID, active: isUserActive }
      })
      .sort((a, b) => Number(a.active) - Number(b.active))

    return usersWithStatus
  }, [location, activeUsers, mentionable, namespaceId, nodeId])

  if (!publicMetadata && (content === undefined || content.metadata === undefined || metadata === undefined || isEmpty))
    return null

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
            <Menu values={<MexIcon noHover icon="bi:three-dots-vertical" width={20} height={20} />}>
              <MenuItem
                key="share-menu"
                icon={{ type: 'ICON', value: 'ri:share-line' }}
                onClick={() => openShareModal('permission', 'note', nodeId)}
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
