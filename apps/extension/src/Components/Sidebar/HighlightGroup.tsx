import React, { useMemo } from 'react'

import { useTheme } from 'styled-components'

import {
  appendQueryParams,
  camelCase,
  deleteQueryParams,
  DrawerType,
  getFavicon,
  Highlight,
  Highlights,
  mog,
  useHighlightStore,
  useLayoutStore
} from '@mexit/core'
import {
  CardFooter,
  Container,
  DefaultMIcons,
  DrawerHeaderDesc,
  FlexBetween,
  FooterFlexButton,
  GenericFlex,
  getMIcon,
  Group,
  HighlightGroupWrapper,
  IconDisplay,
  MexIcon,
  PrimaryText,
  SingleHighlightWrapper,
  SnippetContentPreview,
  StickyHeader,
  useLinks,
  VerticalSeperator
} from '@mexit/shared'

import { useHighlights } from '../../Hooks/useHighlights'

import { NodeCardHeader } from './NodeCard'
import { DomainWithHighlight } from './styled'

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

  const handleOpenHighlight = (e) => {
    e.stopPropagation()

    const onSamePage = highlight.properties?.sourceUrl == deleteQueryParams(window.location.href)
    if (onSamePage) {
      const element = document.querySelector(`[data-highlight-id="${highlight.entityId}"]`)

      if (element) {
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } else {
      if (highlight.properties?.sourceUrl == null) return
      window.open(appendQueryParams(highlight.properties.sourceUrl, { scrollToCapture: highlight.entityId }))
    }
  }

  const title = camelCase(toShowText.slice(0, 35))

  return (
    <SingleHighlightWrapper onClick={handleOpenHighlight}>
      <Container>
        <NodeCardHeader>
          <GenericFlex>
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

export const HighlightGroups = ({ highlights, all }: { highlights: Highlights; all?: boolean }) => {
  // group by sourceUrl
  const groupedHighlights = useMemo(() => {
    const groupedHighlights = {} as Record<string, Highlight[]>

    highlights.forEach((highlight) => {
      if (!highlight) return

      try {
        const sourceUrl = new URL(highlight.properties?.sourceUrl)?.origin

        if (!groupedHighlights[sourceUrl]) {
          groupedHighlights[sourceUrl] = []
        }

        groupedHighlights[sourceUrl].push(highlight)
      } catch (err) {
        mog('Unable to group highlights', { highlight })
        console.error('Unable to group highlights', err)
      }
    })

    return groupedHighlights
  }, [highlights])

  const highlightWithDomains = Object.entries(groupedHighlights)

  return (
    <>
      {highlightWithDomains.map(([origin, highlightList]) => {
        if (highlightList.length === 0) return null
        const faviconURL = getFavicon(origin)

        return (
          <DomainWithHighlight>
            {highlightWithDomains.length > 1 && (
              <StickyHeader>
                <FlexBetween>
                  <Group
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(highlightList.at(0).properties.sourceUrl, '_blank')
                    }}
                  >
                    <img src={faviconURL} />
                    <DrawerHeaderDesc>{origin}</DrawerHeaderDesc>&nbsp;
                  </Group>
                  <DrawerHeaderDesc fade>{highlightList.length}&nbsp;</DrawerHeaderDesc>
                </FlexBetween>
              </StickyHeader>
            )}
            <HighlightGroupWrapper>
              {highlightList.map((highlight) => {
                return <SingleHighlightWithToggle highlight={highlight} />
              })}
            </HighlightGroupWrapper>
          </DomainWithHighlight>
        )
      })}
    </>
  )
}
