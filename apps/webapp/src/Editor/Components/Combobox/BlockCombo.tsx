import React, { useEffect, useState } from 'react'
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { getPlateEditorRef } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { mog } from '@mexit/core'
import { MexIcon, IconButton } from '@mexit/shared'

import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { replaceFragment } from '../../Hooks/useComboboxOnKeyDown'
import { useSearch } from '../../../Hooks/useSearch'
import { KEYBOARD_KEYS } from '../../constants'
import { ActionTitle, ComboboxShortcuts, ComboSeperator, StyledComboHeader, ShortcutText } from '../../Styles/Combobox'
import { getPathFromNodeIdHookless } from '../../../Hooks/useLinks'
import { ComboboxItem, ItemTitle, ItemDesc, ItemCenterWrapper } from '../../Styles/TagCombobox.styles'
import { PrimaryText } from '../../../Components/EditorInfobar/BlockInfobar'
import { DisplayShortcut } from '../../../Components/Shortcuts'
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

    if (trimmedSearch) {
      if (nodeId && trimmedNodeText) {
        queryIndexByNodeId(['node'], nodeId, trimmedSearch).then((res) => {
          const topFiveBlocks = res
            ?.filter((block) => block.blockId !== 'undefined')
            ?.map((block) => {
              const { matchField, ...restBlock } = block
              return restBlock
            })
            ?.slice(0, 5)

          // mog('BLOCKS OF NODEID', { topFiveBlocks })

          setBlocks(topFiveBlocks)
          setIndex(0)
          // setBlocks(res)
        })
      } else {
        queryIndex(['node'], trimmedSearch).then((res) => {
          const topFiveBlocks = res
            ?.filter((block) => block.blockId !== 'undefined')
            ?.map((block) => {
              const { matchField, ...restBlock } = block
              return restBlock
            })
            ?.slice(0, 5)
          // mog('BLOCKS', { topFiveBlocks })

          setBlocks(topFiveBlocks)
          setIndex(0)
        })
      }
    } else {
      setBlocks(undefined)
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
      const content = block.data
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
    <ComboSeperator>
      <StyledComboHeader className="" key="random">
        <IconButton
          size={16}
          shortcut={`Esc`}
          icon={arrowLeftLine}
          onClick={clearBlockSearch}
          title={'Back to Quick links'}
        />
        <ItemTitle>{textAfterTrigger ? `In ${textAfterTrigger}` : `Search`}</ItemTitle>
      </StyledComboHeader>
      {blocks?.length === 0 && (
        <ComboboxItem key={`search-text`} className="highlight">
          <MexIcon fontSize={16} icon="ri:add-circle-line" color={theme.colors.primary} />
          <ItemCenterWrapper>
            <ItemTitle>
              No results:&nbsp;
              <PrimaryText>{textAfterBlockTrigger}</PrimaryText>
            </ItemTitle>
          </ItemCenterWrapper>
        </ComboboxItem>
      )}

      {blocks?.map((block, i) => {
        const lastItem = i > 0 ? blocks[i - 1] : undefined
        return (
          <span key={`${block.blockId}-${String(i)}`}>
            {block.id !== lastItem?.id && !textAfterTrigger && (
              <ActionTitle>{getPathFromNodeIdHookless(block.id)}</ActionTitle>
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
              <MexIcon fontSize={16} icon={BlockIcons[block?.data?.type]} color={theme.colors.primary} />
              <ItemCenterWrapper>{block.text && <ItemDesc>{block.text}</ItemDesc>}</ItemCenterWrapper>
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
