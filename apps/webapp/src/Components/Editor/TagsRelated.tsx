import { useEffect, useState } from 'react'

import arrowGoBackLine from '@iconify/icons-ri/arrow-go-back-line'
import hashtagIcon from '@iconify/icons-ri/hashtag'
import { getPlateEditorRef, insertNodes, TElement } from '@udecode/plate'

import { IconButton } from '@workduck-io/mex-components'

import {
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  generateTempId,
  getContent,
  NodeEditorContent,
  useDataStore
} from '@mexit/core'
import {
  InfoWidgetWrapper,
  Note,
  SuggestionIconsGroup,
  TagFlex,
  TagsFlex,
  TagsHelp,
  TagsLabel,
  useLinks
} from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useTags } from '../../Hooks/useTags'
import Collapse from '../../Layout/Collapse'
import { useAnalysisStore } from '../../Stores/useAnalysis'

import NodeLink from './NodeLink'

interface TagsRelated {
  nodeid: string
  fromAnalysis?: boolean
  onClick?: any
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
  const { getTags } = useTags()
  const tagsCache = useDataStore((state) => state.tagsCache)
  const analysisTags = useAnalysisStore((state) => state.analysis?.tags)
  const [tags, setTags] = useState<string[]>([])
  const { goTo } = useRouting()

  const onTagClick = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }
  useEffect(() => {
    setTags(getTags(nodeid, fromAnalysis))
  }, [nodeid, tagsCache, fromAnalysis, analysisTags])

  // mog('TagsRelated', { nodeid, relNodes, tags, analysisTags })

  if (tags.length === 0) return
  return <TagsLabel tags={tags.map((t) => ({ value: t }))} onClick={onTagClick} />
}

export const TagsRelatedTiny = ({ nodeid, onClick }: TagsRelated) => {
  const { getTags } = useTags()
  const tagsCache = useDataStore((state) => state.tagsCache)
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    // mog('TAGS ARE', { tagsCache, tags, t: getTags(nodeid) })
    setTags(getTags(nodeid))
  }, [nodeid, tagsCache])

  return tags.length > 0 ? <TagsLabel onClick={onClick} tags={tags.map((tag) => ({ value: tag }))} /> : null
}

/**
 * On Webapp we are only showing suggestions related to tags
 */
export const TagsRelatedSuggestions = ({ nodeid, fromAnalysis }: TagsRelated) => {
  const { getRelatedNodes } = useTags()
  const tagsCache = useDataStore((state) => state?.tagsCache)
  const analysisTags = useAnalysisStore((state) => state?.analysis?.tags)
  const [relNodes, setRelNodes] = useState<string[]>([])
  const { getPathFromNodeid } = useLinks()

  const onSuggestionClick = (event: MouseEvent, nodeid: string, content?: NodeEditorContent, embed?: boolean): void => {
    event.stopPropagation()
    const editor = getPlateEditorRef()

    // * Meta + click
    if (event.metaKey || embed) {
      // * Insert Inline Embed
      insertNodes<TElement>(editor, {
        type: ELEMENT_INLINE_BLOCK,
        children: [{ text: '' }],
        value: nodeid
      })
    } else {
      // * Insert ILink
      // As link is inline, we add a p wrapper on it
      const link = {
        type: ELEMENT_ILINK,
        children: [{ text: ' ', id: generateTempId() }],
        value: nodeid,
        id: generateTempId()
      }
      insertNodes<TElement>(editor, link)
    }

    // insertNodes(editor, defaultContent.content)
  }

  const getSuggestionContent = (nodeid: string): { title: string; content: NodeEditorContent } => {
    return {
      title: getPathFromNodeid(nodeid, true),
      content: getContent(nodeid).content
    }
  }

  // mog('SuggestionInfoBar', { suggestions, pinnedSuggestions })
  //
  const SuggestionActions = (nodeid: string) => {
    const content = getSuggestionContent(nodeid)
    return (
      <SuggestionIconsGroup>
        <IconButton
          title="Insert Link"
          icon={arrowGoBackLine}
          onClick={(ev) => onSuggestionClick(ev.nativeEvent, nodeid, content.content, false)}
        />
        <IconButton
          title="Embed Note"
          icon="lucide:file-input"
          onClick={(ev) => onSuggestionClick(ev.nativeEvent, nodeid, content.content, true)}
        />
      </SuggestionIconsGroup>
    )
  }

  useEffect(() => {
    setRelNodes(getRelatedNodes(nodeid, fromAnalysis))
  }, [nodeid, tagsCache, analysisTags])

  // mog('TagsRelated', { nodeid, relNodes, tags, analysisTags })

  return (
    <InfoWidgetWrapper>
      <Collapse maximumHeight="25vh" defaultOpen icon={arrowGoBackLine} title="Suggestions">
        {relNodes.length === 0 && <Note>Use some tags, we will suggest you notes that might be useful.</Note>}
        {relNodes.map((l, i) => (
          <NodeLink
            RenderActions={() => SuggestionActions(l)}
            key={`suggestion_${l}_${i}`}
            keyStr={`suggestion_${l}_${i}`}
            nodeid={l}
          />
        ))}
      </Collapse>
    </InfoWidgetWrapper>
  )
}

export default TagsRelated
