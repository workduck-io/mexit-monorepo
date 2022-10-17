import React, { useEffect, useState } from 'react'

import timeLine from '@iconify-icons/ri/time-line'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import refreshLine from '@iconify/icons-ri/refresh-line'
import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

import { mog, NodeMetadata, NodeProperties } from '@mexit/core'
import { DataGroup, DataWrapper, FocusModeProp, MetadataWrapper } from '@mexit/shared'
import { Label } from '@mexit/shared'
import { ProfileIcon } from '@mexit/shared'
import { RelativeTime } from '@mexit/shared'

import useLayout from '../../Hooks/useLayout'
import { useContentStore } from '../../Stores/useContentStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { ProfileImageWithToolTip } from '../User/ProfileImage'

export const Data = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  color: ${({ theme }) => theme.colors.text.fade};
`

interface MetadataProps {
  node: NodeProperties
  fadeOnHover?: boolean
  publicMetadata?: NodeMetadata
}

const Metadata = ({ node, fadeOnHover = true, publicMetadata }: MetadataProps) => {
  // const node = useEditorStore((state) => state.node)
  const getContent = useContentStore((state) => state.getContent)
  const content = getContent(node.nodeid)
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(publicMetadata)
  const isUserEditing = useEditorStore((state) => state.isEditing)

  const isEmpty =
    metadata &&
    metadata.createdAt === undefined &&
    metadata.createdBy === undefined &&
    metadata.updatedAt === undefined &&
    metadata.lastEditedBy === undefined

  useEffect(() => {
    // mog('metadata Update', { content, node })
    if (content === undefined || content.metadata === undefined) return
    const { metadata: contentMetadata } = content
    setMetadata(contentMetadata)
  }, [node, content, content.metadata])

  if (!publicMetadata && (content === undefined || content.metadata === undefined || metadata === undefined || isEmpty))
    return null

  return (
    <MetadataWrapper $fadeOnHover={fadeOnHover} $isVisible={!isUserEditing}>
      <DataGroup>
        {metadata.createdBy !== undefined && (
          <DataWrapper interactive={metadata.createdAt !== undefined}>
            {metadata.createdBy !== undefined && !publicMetadata ? (
              <ProfileIcon>
                <ProfileImageWithToolTip props={{ userid: metadata.createdBy, size: 16 }} placement="bottom" />
              </ProfileIcon>
            ) : (
              <Icon icon={timeLine}></Icon>
            )}
            <div>
              {metadata.createdAt !== undefined && (
                <Data>
                  <Icon icon={addCircleLine} width={16} />
                  <RelativeTime prefix="Created" dateNum={metadata.createdAt} />
                </Data>
              )}
            </div>
          </DataWrapper>
        )}
      </DataGroup>

      <DataGroup>
        {metadata.lastEditedBy !== undefined && (
          <DataWrapper interactive={metadata.updatedAt !== undefined}>
            {metadata.lastEditedBy !== undefined && !publicMetadata ? (
              <ProfileIcon data-title={metadata.lastEditedBy}>
                <ProfileImageWithToolTip props={{ userid: metadata.lastEditedBy, size: 16 }} placement="bottom" />
              </ProfileIcon>
            ) : (
              <Icon icon={timeLine}></Icon>
            )}
            <div>
              {metadata.updatedAt !== undefined && (
                <Data>
                  <Icon icon={refreshLine} width={16} />
                  <RelativeTime prefix="Updated" dateNum={metadata.updatedAt} />
                </Data>
              )}
            </div>
          </DataWrapper>
        )}
      </DataGroup>
    </MetadataWrapper>
  )
}

export default Metadata
