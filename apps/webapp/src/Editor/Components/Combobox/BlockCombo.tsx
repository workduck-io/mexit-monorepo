import React, { useEffect, useState } from 'react'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { ELEMENT_DEFAULT, ELEMENT_PARAGRAPH, getPlateEditorRef } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { DisplayShortcut, IconButton } from '@workduck-io/mex-components'
import { Indexes } from '@workduck-io/mex-search'

import { generateTempId, useComboboxStore } from '@mexit/core'
import {
  ActionTitle,
  ComboboxItem,
  ComboboxItemTitle,
  ComboboxShortcuts,
  ComboSeperator,
  getPathFromNodeIdHookless,
  ItemDesc,
  ItemsContainer,
  MexIcon,
  ShortcutText,
  StyledComboHeader,
  useQuery
} from '@mexit/shared'

import { PrimaryText } from '../../../Components/EditorInfobar/BlockInfobar'
import { useSearch } from '../../../Hooks/useSearch'
import { KEYBOARD_KEYS } from '../../constants'
import { replaceFragment } from '../../Hooks/useComboboxOnKeyDown'
import { ItemCenterWrapper } from '../../Styles/TagCombobox.styles'
import { BlockIcons } from '../Blocks/BlockIcons'

type BlockComboProps = {
  onSelect
  nodeId?: string
  shortcuts: Record<string, any> | undefined
  isNew?: boolean
}

const BlockCombo = ({ nodeId, onSelect, isNew, shortcuts }: BlockComboProps) => {
  const [index, setIndex] = useState<number>(0)
  const [blocks, setBlocks] = useState<Array<any>>(undefined)
  const { generateSearchQuery } = useQuery()

  const blockRange = useComboboxStore((store) => store.blockRange)
  const setPreview = useComboboxStore((store) => store.setPreview)
  const setActiveBlock = useComboboxStore((store) => store.setActiveBlock)
  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)
  const { textAfterBlockTrigger, textAfterTrigger } = useComboboxStore((store) => store.search)

  const theme = useTheme()
  const { queryIndexByNodeId, queryIndex } = useSearch()

  const clearBlockSearch = () => {
    if (blockRange && isBlockTriggered) {
      replaceFragment(getPlateEditorRef(), blockRange, '')
    }
    setBlocks(undefined)
  }

  useEffect(() => {
    const trimmedSearch = textAfterBlockTrigger?.trim()
    const trimmedNodeText = textAfterTrigger?.trim()

    if (nodeId && trimmedNodeText) {
      const query = generateSearchQuery(trimmedSearch)
      queryIndexByNodeId(Indexes.MAIN, nodeId, query).then((res) => {
        const topFiveBlocks = res?.slice(0, 5)
        setBlocks(topFiveBlocks)
        setIndex(0)
      })
    } else {
      const query = generateSearchQuery(trimmedSearch)

      queryIndex(Indexes.MAIN, query).then((res) => {
        const topFiveBlocks = res?.slice(0, 5)

        setBlocks(topFiveBlocks)
        setIndex(0)
      })
    }
  }, [textAfterBlockTrigger])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === KEYBOARD_KEYS.Escape) {
        event.preventDefault()
        clearBlockSearch()
      }
      if (event.key === KEYBOARD_KEYS.ArrowDown) {
        event.preventDefault()

        if (blocks) {
          setIndex((index) => {
            const nextIndex = index < blocks.length - 1 ? index + 1 : index
            return nextIndex
          })
        }
      }

      if (event.key === KEYBOARD_KEYS.ArrowUp) {
        event.preventDefault()

        if (blocks) {
          setIndex((index) => {
            const nextIndex = index > 0 ? index - 1 : index
            return nextIndex
          })
        }
      }
    }

    if (blocks) window.addEventListener('keydown', handler)
    else window.removeEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [blocks, isBlockTriggered])

  useEffect(() => {
    onClickSetActiveBlock(blocks, index)
    return () => setActiveBlock(undefined)
  }, [index, blocks])

  const onClickSetActiveBlock = (blocks: Array<any>, index: number) => {
    if (blocks && index <= blocks.length - 1) {
      const block = blocks[index]
      const content = [{ children: [{ text: block.text }], id: generateTempId(), type: ELEMENT_PARAGRAPH }]
      setActiveBlock({
        ...block,
        content
      })

      if (content) {
        setPreview([content])
      }
    }
  }

  if (!isBlockTriggered) return null

  return (
    <ComboSeperator id="List">
      <StyledComboHeader key="random">
        <IconButton
          size={16}
          shortcut={`Esc`}
          icon={arrowLeftLine}
          onClick={clearBlockSearch}
          title={'Back to Quick links'}
        />
        <ComboboxItemTitle>{textAfterTrigger ? `In ${textAfterTrigger}` : `Search`}</ComboboxItemTitle>
      </StyledComboHeader>
      {/* <SectionSeparator /> */}

      {blocks?.length === 0 && (
        <ItemsContainer>
          <ComboboxItem key={`search-text`} className="highlight" center>
            <ItemCenterWrapper>
              <ItemDesc>
                No results:&nbsp;
                <PrimaryText>{textAfterBlockTrigger}</PrimaryText>
              </ItemDesc>
            </ItemCenterWrapper>
          </ComboboxItem>
        </ItemsContainer>
      )}

      {blocks?.map((block, i) => {
        const lastItem = i > 0 ? blocks[i - 1] : undefined
        return (
          <span key={`${block.id}-${String(i)}`}>
            {block.parent !== lastItem?.id && !textAfterTrigger && (
              <ActionTitle>{getPathFromNodeIdHookless(block.parent)}</ActionTitle>
            )}
            <ComboboxItem
              onMouseEnter={() => setIndex(i)}
              className={index === i ? 'highlight' : ''}
              onClick={() => {
                onClickSetActiveBlock(blocks, index)
                // if (comboItem.type === QuickLinkType.ilink) {
                onSelect()
                // }
              }}
            >
              <MexIcon fontSize={20} icon={BlockIcons[ELEMENT_DEFAULT]} color={theme.colors.primary} />
              {block.text && <ComboboxItemTitle>{block.text}</ComboboxItemTitle>}
            </ComboboxItem>
          </span>
        )
      })}
      {shortcuts && blocks?.length !== 0 && textAfterBlockTrigger?.trim() && (
        <ComboboxShortcuts>
          {Object.entries(shortcuts).map(([key, shortcut]) => {
            return (
              <ShortcutText key={key}>
                <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
              </ShortcutText>
            )
          })}
        </ComboboxShortcuts>
      )}
    </ComboSeperator>
  )
}

export default BlockCombo
