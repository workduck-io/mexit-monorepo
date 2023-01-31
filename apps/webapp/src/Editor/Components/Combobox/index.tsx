import React, { useCallback, useEffect, useState } from 'react'

import { flip, offset, shift } from '@floating-ui/react-dom-interactions'
import { getRangeBoundingClientRect, PortalBody, usePlateEditorRef, useVirtualFloating } from '@udecode/plate'

import { NodeEditorContent } from '@mexit/core'
import { ComboboxRoot } from '@mexit/shared'

import { useSnippets } from '../../../Hooks/useSnippets'
import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { useContentStore } from '../../../Stores/useContentStore'
import { Shortcut } from '../../../Stores/useHelpStore'
import { useMetadataStore } from '../../../Stores/useMetadataStore'
import { CategoryType, QuickLinkType } from '../../constants'
import { useComboboxControls } from '../../Hooks/useComboboxControls'
import { useComboboxIsOpen } from '../../Hooks/useComboboxIsOpen'
import { replaceFragment } from '../../Hooks/useComboboxOnKeyDown'
import { ComboboxProps } from '../../Types/Combobox'

import BlockCombo from './BlockCombo'
import ItemPreview from './ItemPreview'
import ItemsContainer from './ItemsContainer'
import ItemShortcuts from './ItemShortcuts'

export const spotlightShortcuts = {
  save: {
    title: 'Save changes',
    keystrokes: '$mod+Enter',
    category: 'Action'
  },
  open: {
    title: 'Open item',
    keystrokes: 'Enter',
    category: 'Action'
  },
  escape: {
    title: 'Save and Escape',
    keystrokes: 'Escape',
    category: 'Navigation'
  },
  ShiftTab: {
    title: 'Previous',
    keystrokes: 'Shift+Tab',
    category: 'Action'
  },
  Tab: {
    title: 'Create new quick note',
    keystrokes: 'Tab',
    category: 'Action'
  },
  AltEnter: {
    title: 'Generate',
    keystrokes: 'Alt+Enter',
    category: 'Action'
  }
}

export const ElementTypeBasedShortcut: Record<string, Record<string, Shortcut>> = {
  [QuickLinkType.backlink]: {
    link: {
      ...spotlightShortcuts.open,
      title: 'Link'
    },
    inlineBlock: {
      ...spotlightShortcuts.Tab,
      title: 'Embed'
    }
  },
  [QuickLinkType.taskView]: {
    link: {
      ...spotlightShortcuts.open,
      title: 'Link'
    },
    inlineBlock: {
      ...spotlightShortcuts.Tab,
      title: 'Embed'
    }
  },
  [QuickLinkType.snippet]: {
    snippet: {
      ...spotlightShortcuts.open,
      title: 'Insert'
    }
  },
  [QuickLinkType.prompts]: {
    snippet: {
      ...spotlightShortcuts.open,
      title: 'Insert'
    },
    generate: spotlightShortcuts.AltEnter
  },
  [QuickLinkType.webLinks]: {
    link: {
      ...spotlightShortcuts.open,
      title: 'to Insert'
    }
  },
  [CategoryType.action]: {
    action: {
      ...spotlightShortcuts.open,
      title: 'Insert'
    }
  }
}

export const Combobox = ({ onSelectItem, onRenderItem, isSlash, portalElement }: ComboboxProps) => {
  // TODO clear the error-esque warnings for 'type inference'

  const items = useComboboxStore((state) => state.items)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const targetRange = useComboboxStore((state) => state.targetRange)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)
  const activeBlock = useComboboxStore((store) => store.activeBlock)
  const setPreview = useComboboxStore((store) => store.setPreview)
  const search = useComboboxStore((store) => store.search)
  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()

  const { textAfterTrigger, textAfterBlockTrigger } = useComboboxStore((store) => store.search)
  const getContent = useContentStore((store) => store.getContent)
  const { getSnippetContent } = useSnippets()
  const setIsSlash = useComboboxStore((store) => store.setIsSlash)
  const [metaData, setMetaData] = useState(undefined)
  const editor = usePlateEditorRef()

  const menuProps = combobox ? combobox.getMenuProps({}, { suppressRefError: true }) : { ref: null }

  const comboProps = (item, index) => {
    if (combobox) {
      return combobox.getItemProps({
        item,
        index
      })
    }
  }

  useEffect(() => {
    if (items?.[itemIndex]?.type === QuickLinkType.snippet) {
      setIsSlash(true)
    } else {
      setIsSlash(false)
    }
  }, [itemIndex])

  useEffect(() => {
    if (editor && items?.[itemIndex] && textAfterTrigger.trim() && isBlockTriggered) {
      replaceFragment(editor, targetRange, `[[${items[itemIndex].text}:`)
      setItemIndex(0)
    }

    if (isBlockTriggered) {
      setPreview(undefined)
    }
  }, [isBlockTriggered])

  useEffect(() => {
    return () => closeMenu()
  }, [])

  useEffect(() => {
    const comboItem = items[itemIndex]

    if (comboItem && comboItem.type && isOpen) {
      const { key, type } = comboItem

      let content: NodeEditorContent | undefined

      if (type === QuickLinkType.backlink) {
        const nodeContent = getContent(key)
        content = nodeContent?.content
        const metadata = useMetadataStore.getState().metadata.notes[key]
        setMetaData(metadata)
      } else if (type === QuickLinkType.snippet) {
        content = getSnippetContent(key)
      }

      if (!activeBlock) setPreview(content)
      if (isBlockTriggered && !textAfterBlockTrigger) {
        setPreview(undefined)
      }
    }
  }, [itemIndex, items, activeBlock, isOpen, search])

  const getBoundingClientRect = useCallback(() => {
    return getRangeBoundingClientRect(editor, targetRange)
  }, [editor, targetRange])

  // Update popper position
  const { style, floating } = useVirtualFloating({
    placement: 'bottom-start',
    getBoundingClientRect,
    middleware: [offset(4), shift(), flip()]
  })

  if (!combobox) return null

  const listItem = items[itemIndex]
  const itemShortcut = listItem?.type ? ElementTypeBasedShortcut[listItem?.type] : undefined

  return (
    <PortalBody>
      {isOpen && (
        <ComboboxRoot {...menuProps} ref={floating} style={style} isOpen={isOpen}>
          <>
            {!isBlockTriggered && (
              <div id="List" style={{ flex: 1 }}>
                <ItemsContainer
                  items={items}
                  comboProps={comboProps}
                  onRenderItem={onRenderItem}
                  onSelectItem={(item) => editor && onSelectItem(editor, item)}
                />
                <ItemShortcuts shortcuts={itemShortcut} />
              </div>
            )}
            <BlockCombo
              onSelect={() => {
                const item = items[itemIndex]
                if (item?.type === QuickLinkType.backlink) {
                  editor && onSelectItem(editor, items[itemIndex])
                }
              }}
              shortcuts={itemShortcut}
              nodeId={items[itemIndex]?.key}
              isNew={items[itemIndex]?.data}
            />
            <ItemPreview item={items[itemIndex]} metadata={metaData} />
          </>
        </ComboboxRoot>
      )}
    </PortalBody>
  )
}
