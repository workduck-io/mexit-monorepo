import React, { useMemo } from 'react'

import { useTheme } from 'styled-components'

import { camelCase, DrawerType, Highlight, Highlights, useHighlightStore, useLayoutStore } from '@mexit/core'
import {
  CardFooter,
  Container,
  DefaultMIcons,
  FooterFlexButton,
  GenericFlex,
  getMIcon,
  IconDisplay,
  MexIcon,
  PrimaryText,
  SingleHighlightWrapper,
  SnippetContentPreview,
  VerticalSeperator
} from '@mexit/shared'

import { useHighlights } from '../../Hooks/useHighlights'
import { useLinks } from '../../Hooks/useLinks'

import { NodeCardHeader } from './NodeCard'

const HIGHLIGHT_TEXT_MAX_LENGTH = 300

const LinkedNotes: React.FC<{ highlight: Highlight }> = ({ highlight }) => {
  const openDrawer = useLayoutStore((store) => store.setDrawer)
  const highlightBlockMap = useHighlightStore((store) => store.highlightBlockMap)

  const { getEditableMap } = useHighlights()
  const { getILinkFromNodeid } = useLinks()

  const linkedNotes = useMemo(() => {
    const editableMap = getEditableMap(highlight.entityId)

    return Object.keys(editableMap).map((nodeId) => {
      const node = getILinkFromNodeid(nodeId, true)
      return node
    })
  }, [highlight?.entityId, highlightBlockMap])

  const handleOnClick = (e) => {
    e.stopPropagation()
    // * Open Quick Action Drawer
    openDrawer({ type: DrawerType.LINKED_NOTES, data: highlight })
  }

  if (!linkedNotes?.length) return null

  return (
    <>
      <FooterFlexButton onClick={handleOnClick}>
        <IconDisplay icon={getMIcon('ICON', 'ri:eye-line')} /> Linked Notes ({linkedNotes?.length})
      </FooterFlexButton>
      <VerticalSeperator />
    </>
  )
}

const AddToNote: React.FC<{ highlight: Highlight }> = ({ highlight }) => {
  const theme = useTheme()
  const openDrawer = useLayoutStore((store) => store.setDrawer)

  const handleOnClick = (e) => {
    e.stopPropagation()
    // Open Quick Action Drawer
    openDrawer({
      type: DrawerType.ADD_TO_NOTE,
      data: highlight
    })
  }

  return (
    <FooterFlexButton onClick={handleOnClick}>
      <IconDisplay color={theme.tokens.colors.primary.default} icon={DefaultMIcons.ADD} />{' '}
      <PrimaryText>Add To Note</PrimaryText>
    </FooterFlexButton>
  )
}

export const SingleHighlightWithToggle = ({ highlight }: { highlight: Highlight }) => {
  const [open, setOpen] = React.useState(false)
  const highlightText = highlight.properties.saveableRange.text

  const theme = useTheme()

  const willCollapse = highlightText?.length > HIGHLIGHT_TEXT_MAX_LENGTH

  const strippedText = highlightText?.substring(0, HIGHLIGHT_TEXT_MAX_LENGTH) + (willCollapse ? '...' : '')

  const toShowText = willCollapse ? (open ? highlightText : strippedText) : highlightText

  const openHighlight = () => {
    const element = document.querySelector(`[data-highlight-id="${highlight.entityId}"]`)

    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const title = camelCase(toShowText.slice(0, 35))

  return (
    <SingleHighlightWrapper onClick={() => openHighlight()}>
      <Container>
        <NodeCardHeader>
          <GenericFlex
            onClick={() => {
              //
            }}
          >
            <MexIcon color={theme.tokens.colors.primary.default} icon={DefaultMIcons.HIGHLIGHT.value} />
            <PrimaryText>{title}</PrimaryText>
          </GenericFlex>
        </NodeCardHeader>
        <SnippetContentPreview>{toShowText}</SnippetContentPreview>
      </Container>
      <CardFooter>
        <LinkedNotes highlight={highlight} />
        <AddToNote highlight={highlight} />
      </CardFooter>
    </SingleHighlightWrapper>
  )
}

export const HighlightGroups = ({ highlights }: { highlights: Highlights }) => {
  return open && highlights ? (
    <>
      {highlights.map((highlight) => {
        if (!highlight) return null

        return <SingleHighlightWithToggle key={`${highlight.entityId}`} highlight={highlight} />
      })}
    </>
  ) : null
}
