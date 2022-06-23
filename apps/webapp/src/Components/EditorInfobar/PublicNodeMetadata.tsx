import React, { useEffect, useState } from 'react'
import timeLine from '@iconify-icons/ri/time-line'
import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

import { DataGroup, DataWrapper, Label, MetadataWrapper } from '@mexit/shared'
import { ProfileIcon } from '@mexit/shared'
import { RelativeTime } from '@mexit/shared'
import { ProfileImageWithToolTip } from '../User/ProfileImage'

const Data = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
`

const PublicNodeMetadata = ({ metadata }) => {
  // console.log(metadata)
  const isEmpty =
    metadata &&
    metadata.createdAt === undefined &&
    metadata.createdBy === undefined &&
    metadata.updatedAt === undefined &&
    metadata.lastEditedBy === undefined

  if (isEmpty) return null

  return (
    <MetadataWrapper fadeOnHover={true}>
      <DataGroup>
        {metadata.createdBy !== undefined && (
          <DataWrapper interactive={metadata.createdAt !== undefined}>
            {metadata.createdBy !== undefined ? (
              <ProfileIcon>
                <ProfileImageWithToolTip props={{ email: metadata.createdBy, size: 32 }} placement="bottom" />
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
                <ProfileImageWithToolTip props={{ email: metadata.lastEditedBy, size: 32 }} placement="bottom" />
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

export default PublicNodeMetadata
