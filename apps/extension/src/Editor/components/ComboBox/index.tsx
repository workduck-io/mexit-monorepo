import { Icon } from '@iconify/react'
import useMergedRef from '@react-hook/merged-ref'
import { getPreventDefaultHandler, PortalBody, useEditorState } from '@udecode/plate'
import React, { useEffect } from 'react'
import { useComboboxControls } from '../../hooks/useComboboxControls'
import { useComboboxIsOpen } from '../../hooks/useComboboxIsOpen'
import { useComboboxStore } from '../../store/combobox'
import { ComboboxItem, ComboboxRoot, ItemCenterWrapper, ItemDesc, ItemRightIcons, ItemTitle } from './styled'
import { setElementPositionByRange } from '../../utils/setElementPositionByRange'
import { ComboboxProps } from './types'
import { mog } from '../../utils'
import { CategoryType, QuickLinkType, Shortcut } from '@mexit/core'

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
  const at = useComboboxStore((state) => state.targetRange)
  const items = useComboboxStore((state) => state.items)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()
  const search = useComboboxStore((state) => state.search)

  const ref = React.useRef<any>(null) // eslint-disable-line @typescript-eslint/no -explicit-any
  const editor = useEditorState()

  useEffect(() => {
    // Throws error when the combobox is open and editor is switched or removed
    try {
      if (editor) setElementPositionByRange(editor, { ref, at })
    } catch (e) {
      closeMenu()
      console.error(e)
    }
  }, [at, editor])

  const menuProps = combobox ? combobox.getMenuProps() : { ref: null }

  const multiRef = useMergedRef(menuProps.ref, ref)

  if (!combobox) return null

  const comboProps = (item, index) => {
    if (combobox) {
      return combobox.getItemProps({
        item,
        index
      })
    }
  }

  return (
    <PortalBody element={portalElement}>
      <ComboboxRoot {...menuProps} ref={multiRef} isOpen={isOpen}>
        {isOpen &&
          items.map((item, index) => {
            mog('ITEM', { item })
            const Item = onRenderItem ? onRenderItem({ item }) : item.text
            const text = item.text

            return (
              <ComboboxItem
                key={`${item.key}-${String(index)}`}
                highlighted={index === itemIndex}
                {...comboProps(item, index)}
                onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, isSlash ? item : search)}
              >
                {item.icon && <Icon height={18} key={`${item.key}_${item.icon}`} icon={item.icon} />}
                <ItemCenterWrapper>
                  <ItemTitle>{Item}</ItemTitle>
                  {item.desc && <ItemDesc>{item.desc}</ItemDesc>}
                </ItemCenterWrapper>
                {item.rightIcons && (
                  <ItemRightIcons>
                    {item.rightIcons.map((i: string) => (
                      <Icon key={item.key + i} icon={i} />
                    ))}
                  </ItemRightIcons>
                )}
              </ComboboxItem>
            )
          })}
      </ComboboxRoot>
    </PortalBody>
  )
}
