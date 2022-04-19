import React, { useEffect, useState } from 'react'
import hashtagIcon from '@iconify-icons/ri/hashtag'
import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { useTags } from '../../Hooks/useTags'
import useDataStore from '../../Stores/useDataStore'
import { HoverSubtleGlow } from '../../Style/Helpers'
import { InfoWidgetScroll, InfoWidgetWrapper } from '../../Style/Infobar'
import { Note } from '@mexit/shared'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { DataInfoHeader } from '../../Style/Backlinks'
import NodeLink from './NodeLink'

const TagFlex = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};
  margin-right: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};

  ${HoverSubtleGlow}
`

const TagsFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const InfoSubHeading = styled.h2`
  margin: ${({ theme }) => theme.spacing.large};
  font-size: 1.2rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.fade};
`

interface TagsRelated {
  nodeid: string
}

const TagsRelated = ({ nodeid }: TagsRelated) => {
  const { getRelatedNodes, getTags } = useTags()
  const tagsCache = useDataStore((state) => state.tagsCache)
  const [relNodes, setRelNodes] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const { goTo } = useRouting()

  useEffect(() => {
    setRelNodes(getRelatedNodes(nodeid))
  }, [nodeid, tagsCache])

  useEffect(() => {
    setTags(getTags(nodeid))
  }, [nodeid, tagsCache])

  const navigateToTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  return (
    <InfoWidgetWrapper>
      <DataInfoHeader>
        <Icon icon={hashtagIcon}></Icon>
        Tags
      </DataInfoHeader>
      <InfoWidgetScroll>
        {tags.length > 0 ? (
          <>
            <TagsFlex>
              {tags.map((t) => (
                <TagFlex
                  key={`info_tags_${nodeid}_${t}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigateToTag(t)
                  }}
                >
                  #{t}
                </TagFlex>
              ))}
            </TagsFlex>
            {relNodes.length > 0 ? <InfoSubHeading>Related Nodes</InfoSubHeading> : null}
            {relNodes.map((n) => (
              <NodeLink key={`info_tag_related_${nodeid}_${n}`} keyStr={`info_tag_related_${nodeid}_${n}`} nodeid={n} />
            ))}
          </>
        ) : (
          <>
            <Note>No Tags found.</Note>
            <Note>Create tags with # view them and related nodes here.</Note>
          </>
        )}
      </InfoWidgetScroll>
    </InfoWidgetWrapper>
  )
}

export default TagsRelated
