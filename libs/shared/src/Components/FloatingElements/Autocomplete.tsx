import React, { useEffect, useMemo, useRef, useState } from 'react'

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole
} from '@floating-ui/react'

import { fuzzySearch, MenuListItemType } from '@mexit/core'

import { Loading } from '../../Style/Loading'
import { DisplayShortcut } from '../../Style/Tooltip'
import { IconDisplay } from '../IconDisplay'
import { DefaultMIcons } from '../Icons'

import {
  AutoCompleteActions,
  AutoCompleteInput,
  AutoCompleteSelector,
  AutoCompleteSuggestions,
  StyledLoading
} from './Autocomplete.style'
import { MenuItem } from './Dropdown'
import { MenuClassName, MenuItemClassName } from './Dropdown.classes'

export const AutoComplete: React.FC<{
  onEnter: any
  clearOnEnter?: boolean
  disableMenu?: boolean
  defaultItems: Array<MenuListItemType>
  defaultValue?: string
}> = ({ defaultItems = [], disableMenu, defaultValue, onEnter, clearOnEnter }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState(defaultValue ?? '')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const listRef = useRef<Array<HTMLElement | null>>([])

  const { x, y, strategy, refs, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [
      offset({ mainAxis: 15 }),
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`
          })
        },
        padding: 10
      })
    ]
  })

  const role = useRole(context, { role: 'listbox' })
  const dismiss = useDismiss(context)
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNav])

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setInputValue(value)

    if (value) {
      setOpen(true)
      setActiveIndex(0)
    }
  }

  useEffect(() => {
    setInputValue(defaultValue ?? '')
  }, [defaultValue])

  const items = useMemo(() => {
    if (!inputValue) return defaultItems

    const res = fuzzySearch(defaultItems, inputValue, (item) => item.label)
    return res
  }, [inputValue])

  const handleOnSelect = (item: MenuListItemType) => {
    setInputValue(item.label)
    setIsLoading(true)
    item.onSelect(() => {
      setIsLoading(false)
      setInputValue('')
    })
    setActiveIndex(null)
    setOpen(false)
  }

  return (
    <>
      <AutoCompleteSelector>
        <IconDisplay icon={DefaultMIcons.AI} />
        <AutoCompleteInput
          value={inputValue}
          {...getReferenceProps({
            ref: refs.setReference,
            onChange,
            placeholder: 'Ask me anything...',
            'aria-autocomplete': 'list',
            onKeyDown(event) {
              if (event.key === 'Enter') {
                if (activeIndex !== null && items[activeIndex] && !disableMenu) {
                  handleOnSelect(items[activeIndex])
                } else {
                  if (onEnter && inputValue) {
                    setIsLoading(true)
                    onEnter(inputValue).then(() => {
                      if (clearOnEnter) {
                        setInputValue('')
                        setActiveIndex(null)
                        setIsLoading(false)
                        setOpen(false)
                      }
                    })
                  }
                }
              }
            }
          })}
        />
        <AutoCompleteActions>
          {isLoading ? (
            <StyledLoading>
              <Loading dots={3} transparent />
            </StyledLoading>
          ) : (
            <>
              <DisplayShortcut shortcut="Enter" />
              <span>to send</span>
            </>
          )}
        </AutoCompleteActions>
      </AutoCompleteSelector>
      <FloatingPortal>
        {open && items.length > 0 && !disableMenu && (
          <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
            <AutoCompleteSuggestions
              {...getFloatingProps({
                className: MenuClassName,
                ref: refs.setFloating,
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0
                },
                onKeyDown(event) {
                  if (event.key === 'Tab') {
                    setOpen(false)
                  }
                }
              })}
            >
              {items.map((menuItem, index) => {
                return (
                  <MenuItem
                    key={menuItem.id}
                    icon={menuItem.icon}
                    // fontSize="small"
                    label={menuItem.label}
                    {...getItemProps({
                      role: 'menuitem',
                      className: MenuItemClassName,
                      ref(node) {
                        listRef.current[index] = node
                      },
                      onClick() {
                        handleOnSelect(menuItem)
                      }
                    })}
                    isActive={index === activeIndex}
                  />
                )
              })}
            </AutoCompleteSuggestions>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  )
}
