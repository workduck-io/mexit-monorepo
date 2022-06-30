import React, { useEffect, useState } from 'react'
import timeLine from '@iconify-icons/ri/time-line'
import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

import useLayout from '../../Hooks/useLayout'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { DataGroup, DataWrapper, MetadataWrapper } from '@mexit/shared'
import { Label } from '@mexit/shared'
import { ProfileIcon } from '@mexit/shared'
import { mog, NodeMetadata, NodeProperties } from '@mexit/core'
import { RelativeTime } from '@mexit/shared'
import { ProfileImageWithToolTip } from '../User/ProfileImage'
import { useContentStore } from '../../Stores/useContentStore'

const Data = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
`

interface MetadataProps {
  node: NodeProperties
  fadeOnHover?: boolean
}

const Metadata = ({ node, fadeOnHover = true }: MetadataProps) => {
  // const node = useEditorStore((state) => state.node)
  const focusMode = useLayoutStore((s) => s.focusMode)
  const getContent = useContentStore((state) => state.getContent)
  const content = getContent(node.nodeid)
  const { getFocusProps } = useLayout()
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(undefined)

  const isEmpty =
    metadata &&
    metadata.createdAt === undefined &&
    metadata.createdBy === undefined &&
    metadata.updatedAt === undefined &&
    metadata.lastEditedBy === undefined

  useEffect(() => {
    // mog({ content })
    if (content === undefined || content.metadata === undefined) return
    const { metadata: contentMetadata } = content
    setMetadata(contentMetadata)
  }, [node, content])

  mog('METADATA OF THIS NODE', { node, metadata })

  // mog({ node, metadata })

  if (content === undefined || content.metadata === undefined || metadata === undefined || isEmpty) return null
  return (
    <MetadataWrapper {...getFocusProps(focusMode)} fadeOnHover={fadeOnHover}>
      <DataGroup>
        {metadata.createdBy !== undefined && (
          <DataWrapper interactive={metadata.createdAt !== undefined}>
            {metadata.createdBy !== undefined ? (
              <ProfileIcon>
                <ProfileImageWithToolTip props={{ userId: metadata.createdBy, size: 32 }} placement="bottom" />
              </ProfileIcon>
            ) : (
              <Icon icon={timeLine}></Icon>
            )}
            <div>
              {metadata.createdAt !== undefined ? <Label>Created</Label> : null}
              {metadata.createdAt !== undefined && (
                <Data>
                  <RelativeTime dateNum={metadata.createdAt} />
                </Data>
              )}
            </div>
          </DataWrapper>
        )}
      </DataGroup>

      <DataGroup>
        {metadata.lastEditedBy !== undefined && (
          <DataWrapper interactive={metadata.updatedAt !== undefined}>
            {metadata.lastEditedBy !== undefined ? (
              <ProfileIcon data-title={metadata.lastEditedBy}>
                <ProfileImageWithToolTip props={{ userId: metadata.lastEditedBy, size: 32 }} placement="bottom" />
              </ProfileIcon>
            ) : (
              <Icon icon={timeLine}></Icon>
            )}
            <div>
              {metadata.updatedAt !== undefined ? <Label>Updated</Label> : null}
              {metadata.updatedAt !== undefined && (
                <Data>
                  <RelativeTime dateNum={metadata.updatedAt} />
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
