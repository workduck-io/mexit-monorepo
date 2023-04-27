import React, { useMemo } from 'react'

import { useTheme } from 'styled-components'

import { camelCase, DrawerType, Highlight, Highlights, useLayoutStore } from '@mexit/core'
import {
  CardFooter,
  Container,
  DefaultMIcons,
  FooterFlexButton,
  GenericFlex,
  getMIcon,
  HighlightGroupsWrapper,
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

const LinkedNotes = ({ entityId }) => {
  const openDrawer = useLayoutStore((store) => store.setDrawer)

  const { getEditableMap } = useHighlights()
  const { getILinkFromNodeid } = useLinks()

  const editableMap = getEditableMap(entityId)

  const editNodes = useMemo(() => {
    return Object.keys(editableMap).map((nodeId) => {
      const node = getILinkFromNodeid(nodeId, true)
      return node
    })
  }, [editableMap])

  const handleOnClick = (e) => {
    e.stopPropagation()
    // * Open Quick Action Drawer
    openDrawer(DrawerType.LINKED_NOTES)
  }

  if (!editNodes?.length) return null

  return (
    <>
      <FooterFlexButton onClick={handleOnClick}>
        <IconDisplay icon={getMIcon('ICON', 'ri:eye-line')} /> Linked Notes ({editNodes?.length})
      </FooterFlexButton>
      {/* <HighlightNotes>
          {isEditable
            ? editNodes.map((node: any) => (
                <HighlightNote onClick={() => handleOpenNote(node.nodeid)}>
                  <Icon icon={fileList2Line} />
                  {getTitleFromPath(node.path)}
                </HighlightNote>
              ))
            : null}
        </HighlightNotes> */}
      <VerticalSeperator />
    </>
  )
}

const AddToNote = () => {
  const theme = useTheme()
  const openDrawer = useLayoutStore((store) => store.setDrawer)

  const handleOnClick = (e) => {
    e.stopPropagation()

    // Open Quick Action Drawer
    openDrawer(DrawerType.ADD_TO_NOTE)
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
          {/* <MexIcon onClick={onClick} icon={fileCopyLine} height={16} width={16} /> */}
        </NodeCardHeader>
        <SnippetContentPreview>{toShowText}</SnippetContentPreview>
      </Container>
      <CardFooter>
        <LinkedNotes entityId={highlight.entityId} />
        <AddToNote />
      </CardFooter>
    </SingleHighlightWrapper>
  )
}

export const HighlightGroups = ({ highlights }: { highlights: Highlights }) => {
  return open && highlights ? (
    <HighlightGroupsWrapper>
      {highlights.map((highlight) => {
        console.log('HIGHLIGHT IS ', { highlight })

        if (!highlight) return null

        return <SingleHighlightWithToggle key={`${highlight.entityId}`} highlight={highlight} />
      })}
    </HighlightGroupsWrapper>
  ) : null
}
