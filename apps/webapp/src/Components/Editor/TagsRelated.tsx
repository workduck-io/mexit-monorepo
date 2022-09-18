import React, { useEffect, useState } from 'react'

import hashtagIcon from '@iconify/icons-ri/hashtag'

import { mog } from '@mexit/core'
import { InfoSubHeading, Note, TagFlex, TagsFlex } from '@mexit/shared'
import { InfoWidgetWrapper } from '@mexit/shared'

import { TagsHelp } from '../../Data/defaultText'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useTags } from '../../Hooks/useTags'
import Collapse from '../../Layout/Collapse'
import { useAnalysisStore } from '../../Stores/useAnalysis'
import { useDataStore } from '../../Stores/useDataStore'
import { TagsLabel } from '../Sidebar/TagLabel'
import NodeLink from './NodeLink'

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

  useEffect(() => {
    setRelNodes(getRelatedNodes(nodeid, fromAnalysis))
  }, [nodeid, tagsCache, analysisTags])

  useEffect(() => {
    setTags(getTags(nodeid, fromAnalysis))
  }, [nodeid, tagsCache, analysisTags])

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
            <TagsLabel tags={tags.map((t) => ({ value: t }))} />
            {relNodes.length > 0 ? <InfoSubHeading>Related Notes</InfoSubHeading> : null}
            {relNodes.map((n) => (
              <NodeLink key={`info_tag_related_${nodeid}_${n}`} keyStr={`info_tag_related_${nodeid}_${n}`} nodeid={n} />
            ))}
          </>
        ) : (
          <>
            <Note>No Tags found.</Note>
            <Note>Create Tags with # view them and related Notes here.</Note>
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

  useEffect(() => {
    mog('TAGS ARE', { tagsCache, tags, t: getTags(nodeid) })
    setTags(getTags(nodeid))
  }, [nodeid, tagsCache])

  return tags.length > 0 ? <TagsLabel tags={tags.map((tag) => ({ value: tag }))} /> : null
}

export default TagsRelated
