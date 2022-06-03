import React, { useEffect, useState } from 'react'
import hashtagIcon from '@iconify/icons-ri/hashtag'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

import { Note } from '@mexit/shared'

import { TagsHelp } from '../../Data/defaultText'
import { useTags } from '../../Hooks/useTags'
import { InfoWidgetWrapper } from '../../Style/Infobar'

import Collapse from '../../Layout/Collapse'
import NodeLink from './NodeLink'
import { HoverSubtleGlow } from '../../Style/Helpers'

import { useAnalysisStore } from '../../Stores/useAnalysis'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useDataStore } from '../../Stores/useDataStore'

export const TagFlex = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};

  ${HoverSubtleGlow}
`

export const TagsFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
`

export const InfoSubHeading = styled.h2`
  margin: ${({ theme }) => theme.spacing.large};
  font-size: 1.2rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.fade};
`

export const ResultCardFooter = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};
  ${TagFlex} {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    ${HoverSubtleGlow}
  }
  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.colors.primary};
    `}
`
interface TagsRelated {
  nodeid: string
  fromAnalysis?: boolean
}

export const PublicTagsView = ({ nodeid, tags }) => {
  return (
    <InfoWidgetWrapper>
      <Collapse
        icon={hashtagIcon}
        infoProps={{
          text: TagsHelp
        }}
        title="Tags"
        defaultOpen
        maximumHeight="40vh"
      >
        {tags.length > 0 ? (
          <TagsFlex>
            {tags.map((t) => (
              <TagFlex key={`info_tags_${nodeid}_${t}`}>#{t}</TagFlex>
            ))}
          </TagsFlex>
        ) : (
          <>
            <Note>No Tags found.</Note>
            <Note>Create tags with # view them and related nodes here.</Note>
          </>
        )}
      </Collapse>
    </InfoWidgetWrapper>
  )
}

const TagsRelated = ({ nodeid, fromAnalysis }: TagsRelated) => {
  const { getRelatedNodes, getTags } = useTags()
  const tagsCache = useDataStore((state) => state.tagsCache)
  const analysisTags = useAnalysisStore((state) => state.analysis.tags)
  const [relNodes, setRelNodes] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const { goTo } = useRouting()

  useEffect(() => {
    setRelNodes(getRelatedNodes(nodeid, fromAnalysis))
  }, [nodeid, tagsCache, analysisTags])

  useEffect(() => {
    setTags(getTags(nodeid, fromAnalysis))
  }, [nodeid, tagsCache, analysisTags])

  const navigateToTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  // mog('TagsRelated', { nodeid, relNodes, tags, analysisTags })

  return (
    <InfoWidgetWrapper>
      <Collapse
        icon={hashtagIcon}
        infoProps={{
          text: TagsHelp
        }}
        title="Tags"
        defaultOpen
        maximumHeight="40vh"
      >
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
      </Collapse>
    </InfoWidgetWrapper>
  )
}

export const TagsRelatedTiny = ({ nodeid }: TagsRelated) => {
  const { getTags } = useTags()
  const tagsCache = useDataStore((state) => state.tagsCache)
  const [tags, setTags] = useState<string[]>([])
  const { goTo } = useRouting()

  useEffect(() => {
    setTags(getTags(nodeid))
  }, [nodeid, tagsCache])

  const navigateToTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  // mog('TagsRelated', { nodeid, tags })

  return tags.length > 0 ? (
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
  ) : null
}

export default TagsRelated
