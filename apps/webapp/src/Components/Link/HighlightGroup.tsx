import React, { useMemo } from 'react'
import { toast } from 'react-hot-toast'

import arrowDownSLine from '@iconify/icons-ri/arrow-down-s-line'
import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import arrowUpSLine from '@iconify/icons-ri/arrow-up-s-line'
import markPenLine from '@iconify/icons-ri/mark-pen-line'
import { Icon } from '@iconify/react'

import {
  getHighlightBlockMap,
  getHighlightContent,
  Highlight,
  Highlights,
  Link,
  useHighlightStore,
  useLinkStore,
  useMetadataStore,
  useRecentsStore,
  userPreferenceStore as useUserPreferenceStore
} from '@mexit/core'
import {
  DefaultMIcons,
  getMIcon,
  Group,
  HighlightCollapsedToggle,
  HighlightCount,
  HighlightGroupsWrapper,
  HighlightGroupToggleButton,
  HighlightText,
  InsertMenu,
  SingleHighlightWrapper
} from '@mexit/shared'

import useUpdateBlock from '../../Editor/Hooks/useUpdateBlock'
import { useApi } from '../../Hooks/API/useNodeAPI'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { useHighlights } from '../../Hooks/useHighlights'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'
import useLoad from '../../Hooks/useLoad'
import { useNavigation } from '../../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

interface HighlightGroupProps {
  highlights?: Highlights
  link: Link
  setOpen: (open: boolean) => void
  open: boolean
}

export const HighlightGroupToggle = ({ highlights, open, setOpen }: HighlightGroupProps) => {
  const highlightCount = (highlights ?? []).length

  const toggleOpen = () => {
    setOpen(!open)
  }

  return highlightCount > 0 ? (
    <HighlightGroupToggleButton onClick={() => toggleOpen()}>
      <Icon icon={markPenLine} />
      Highlights <HighlightCount>{highlightCount}</HighlightCount>
      <Icon icon={open ? arrowUpSLine : arrowDownSLine} />
    </HighlightGroupToggleButton>
  ) : null
}

export const SingleHighlightWithToggle = ({ highlight, link }: { highlight: Highlight; link: Link }) => {
  const { loadNode } = useLoad()
  const { goTo } = useRouting()
  const { getHighlightMap } = useHighlights()
  const { getPathFromNodeid } = useLinks()
  const { addBlockInContent } = useUpdateBlock()
  const { appendToNode } = useApi()
  const highlightBlockMap = useHighlightStore((store) => store.highlightBlockMap)
  const updateHighlightBlockMap = useHighlightStore((store) => store.updateHighlightBlockMap)
  const { push } = useNavigation()
  const addRecent = useRecentsStore((store) => store.addRecent)

  const [open, setOpen] = React.useState(false)
  const highlightMap = getHighlightMap(highlight.entityId) ?? {}
  const setLinks = useLinkStore((store) => store.setLinks)
  const links = useLinkStore((store) => store.links)
  const setInitializationTime = useRecentsStore((store) => store.setInitializationTime)
  const setLastOpened = useUserPreferenceStore((state) => state.setLastOpened)
  const { updateUserPreferences } = useUserService()

  const handleAddtoRecents = async (link: Link) => {
    setInitializationTime(Date.parse(new Date().toISOString()))
    link.updatedAt = Date.parse(new Date().toISOString())
    addRecent(undefined, link)

    const lastOpened = useRecentsStore.getState().lastOpened
    setLastOpened(lastOpened)

    const newLinks = links.filter((l) => l.url !== link.url)
    newLinks.push(link)
    setLinks(newLinks)
    updateUserPreferences()
  }

  const handleAddToNote = async (noteId: string) => {
    const content = getHighlightContent(highlight)
    const highlightBlockMap = getHighlightBlockMap(noteId, content)

    try {
      await appendToNode(noteId, content)
      updateHighlightBlockMap(highlight.entityId, highlightBlockMap)
      addBlockInContent(noteId, content)
      toast('Added To Note!')
      handleAddtoRecents(link)
    } catch (err) {
      toast('Error adding highlight to note')
    }
  }

  const openLinkWithScroll = (e) => {
    e.stopPropagation()

    const url = new URL(highlight.properties.sourceUrl)
    url.searchParams.append('scrollToCapture', highlight.entityId)
    window.open(url, '_blank')
  }

  const linkedNotes = useMemo(() => {
    const editableMap = getHighlightMap(highlight.entityId) ?? {}

    return Object.keys(editableMap).map((noteId) => {
      const label = getTitleFromPath(getPathFromNodeid(noteId))
      const icon = useMetadataStore.getState().metadata.notes[noteId]?.icon ?? DefaultMIcons.SHARED_NOTE

      return {
        id: noteId,
        label,
        icon
      }
    })
  }, [highlightBlockMap])

  const highlightText = highlight?.properties?.saveableRange?.text ?? ''

  const willCollapse = highlightText.length > 300

  const strippedText = highlightText.substring(0, 300) + (willCollapse ? '...' : '')

  const toShowText = willCollapse ? (open ? highlightText : strippedText) : highlightText

  const openHighlightLocation = (noteId: string) => {
    const blockId = highlightMap[noteId][0]
    loadNode(noteId, { highlightBlockId: blockId })
    goTo(ROUTE_PATHS.node, NavigationType.push, noteId)
    push(noteId)
  }

  return (
    <SingleHighlightWrapper onClick={openLinkWithScroll} padding>
      <HighlightText>{toShowText}</HighlightText>
      {willCollapse ? (
        <HighlightCollapsedToggle onClick={() => setOpen(!open)}>
          <Icon icon={open ? arrowUpSLine : arrowRightSLine} />
          {open ? 'Less' : 'More'}
        </HighlightCollapsedToggle>
      ) : null}
      <Group>
        {linkedNotes?.length > 0 && (
          <InsertMenu
            isMenu
            title={`Linked Notes (${linkedNotes.length})`}
            items={linkedNotes}
            onClick={openHighlightLocation}
            icon={getMIcon('ICON', 'ri:eye-line')}
          />
        )}
        <InsertMenu onClick={handleAddToNote} isMenu title="Add to Note" icon={DefaultMIcons.ADD} />
      </Group>
    </SingleHighlightWrapper>
  )
}

const HighlightGroups = ({ highlights, link, open, setOpen }: HighlightGroupProps) => {
  return open && highlights ? (
    <HighlightGroupsWrapper>
      {highlights.map((highlight) => {
        return <SingleHighlightWithToggle key={`${highlight.entityId}`} highlight={highlight} link={link} />
      })}
    </HighlightGroupsWrapper>
  ) : null
}

export default HighlightGroups
