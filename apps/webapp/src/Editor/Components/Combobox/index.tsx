import React, { useCallback, useEffect, useState } from 'react'

import { flip, offset, shift } from '@floating-ui/react-dom-interactions'
import { Icon } from '@iconify/react'
import { getRangeBoundingClientRect, PortalBody, usePlateEditorRef, useVirtualFloating } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { DisplayShortcut } from '@workduck-io/mex-components'

import { mog, NodeEditorContent } from '@mexit/core'
import {
  ActionTitle,
  ComboboxItem,
  ComboboxItemTitle,
  ComboboxRoot,
  ComboboxShortcuts,
  ComboSeperator,
  IconDisplay,
  ItemCenterWrapper,
  ItemDesc,
  ItemRightIcons,
  ItemsContainer,
  PreviewMeta,
  SectionSeparator,
  ShortcutText
} from '@mexit/shared'

import { PrimaryText } from '../../../Components/EditorInfobar/BlockInfobar'
import { useNamespaces } from '../../../Hooks/useNamespaces'
import { useSnippets } from '../../../Hooks/useSnippets'
import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { useContentStore } from '../../../Stores/useContentStore'
import { Shortcut } from '../../../Stores/useHelpStore'
import { useMetadataStore } from '../../../Stores/useMetadataStore'
import { CategoryType, QuickLinkType } from '../../constants'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import { useComboboxControls } from '../../Hooks/useComboboxControls'
import { useComboboxIsOpen } from '../../Hooks/useComboboxIsOpen'
import { replaceFragment } from '../../Hooks/useComboboxOnKeyDown'
import { ComboboxProps } from '../../Types/Combobox'

import BlockCombo from './BlockCombo'

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
  Tab: {
    title: 'Create new quick note',
    keystrokes: 'Tab',
    category: 'Action'
  }
}

export const ElementTypeBasedShortcut: Record<string, Record<string, Shortcut>> = {
  [QuickLinkType.backlink]: {
    link: {
      ...spotlightShortcuts.open,
      title: 'to Link'
    },
    inlineBlock: {
      ...spotlightShortcuts.Tab,
      title: 'to Embed'
    }
  },
  [QuickLinkType.snippet]: {
    snippet: {
      ...spotlightShortcuts.open,
      title: 'to Insert'
    }
  },
  [CategoryType.action]: {
    action: {
      ...spotlightShortcuts.open,
      title: 'to Insert'
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
  const preview = useComboboxStore((store) => store.preview)
  const setPreview = useComboboxStore((store) => store.setPreview)
  const search = useComboboxStore((store) => store.search)
  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()
  const { getNamespace } = useNamespaces()
  const allMetadata = useMetadataStore((s) => s.metadata)
  const { textAfterTrigger, textAfterBlockTrigger } = useComboboxStore((store) => store.search)
  const getContent = useContentStore((store) => store.getContent)
  const { getSnippetContent } = useSnippets()
  const setIsSlash = useComboboxStore((store) => store.setIsSlash)
  const [metaData, setMetaData] = useState(undefined)
  const editor = usePlateEditorRef()
  const theme = useTheme()

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
      /*
         * else if (key === 'remind') {
        // mog('reminderItem', { comboItem, search })
        const searchTerm = search.textAfterTrigger.slice(key.length)
        const parsed = getTimeInText(searchTerm)
        if (parsed) {
          const time = toLocaleString(parsed.time)
          const text = parsed.textWithoutTime
          const newContent = getReminderPreview(time, text)
          mog('getCommandExtendedInRenderItem', { parsed, search, newContent })
          content = newContent
        }
        }
        */
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
                <ItemsContainer id="items-container">
                  {items.map((item, index) => {
                    const Item = onRenderItem ? onRenderItem({ item }) : item.text
                    const lastItem = index > 0 ? items[index - 1] : undefined
                    const namespace = getNamespace(item.namespace)?.name
                    const isSnippet = item.type === QuickLinkType.snippet
                    const metadata = allMetadata[isSnippet ? 'snippets' : 'notes']?.[item.key]
                    const icon = metadata?.icon ?? item?.icon
                    mog('COMBOBOX', { item, metadata, icon })

                    return (
                      <span key={`${item.key}-${String(index)}`}>
                        {item.type !== lastItem?.type && (
                          <>
                            {index !== 0 && <SectionSeparator />}
                            <ActionTitle>{item.type}</ActionTitle>
                          </>
                        )}
                        <ComboboxItem
                          className={index === itemIndex ? 'highlight' : ''}
                          {...comboProps(item, index)}
                          onMouseEnter={() => {
                            setItemIndex(index)
                          }}
                          center={!namespace}
                          onMouseDown={() => {
                            editor && onSelectItem(editor, item)
                          }}
                        >
                          {icon && <IconDisplay icon={icon} size={namespace ? 16 : 18} />}
                          <ItemCenterWrapper>
                            {!item.prefix ? (
                              <ComboboxItemTitle>{Item}</ComboboxItemTitle>
                            ) : (
                              <ComboboxItemTitle>
                                {item.prefix} <PrimaryText>{Item}</PrimaryText>
                              </ComboboxItemTitle>
                            )}
                            {namespace && <ItemDesc>{namespace}</ItemDesc>}
                          </ItemCenterWrapper>
                          {item.rightIcons && (
                            <ItemRightIcons>
                              {item.rightIcons.map((i: string) => (
                                <Icon key={item.key + i} icon={i} />
                              ))}
                            </ItemRightIcons>
                          )}
                        </ComboboxItem>
                      </span>
                    )
                  })}
                </ItemsContainer>
                {itemShortcut && (
                  <ComboboxShortcuts>
                    {Object.entries(itemShortcut).map(([key, shortcut]) => {
                      return (
                        <ShortcutText key={key}>
                          <DisplayShortcut shortcut={shortcut.keystrokes} />{' '}
                          <div className="text">{shortcut.title}</div>
                        </ShortcutText>
                      )
                    })}
                  </ComboboxShortcuts>
                )}
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
            {((preview && listItem?.type && !isBlockTriggered) ||
              (isBlockTriggered && textAfterBlockTrigger && preview)) && (
              <ComboSeperator fixedWidth>
                <section>
                  <EditorPreviewRenderer
                    noMouseEvents
                    content={preview?.content || preview}
                    readOnly
                    draftView
                    editorId={
                      isBlockTriggered && activeBlock ? activeBlock?.blockId : `${items[itemIndex]?.key}_Preview_Block`
                    }
                  />
                </section>
                {preview && <PreviewMeta meta={metaData} />}
              </ComboSeperator>
            )}
          </>
        </ComboboxRoot>
      )}
    </PortalBody>
  )
}
