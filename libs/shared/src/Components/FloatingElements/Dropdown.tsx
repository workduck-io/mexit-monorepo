import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { mergeRefs } from 'react-merge-refs'

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover, // useTypeahead,
  useInteractions,
  useListNavigation,
  useRole
} from '@floating-ui/react-dom-interactions'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import cx from 'classnames'
import { debounce } from 'lodash'

import { fuzzySearch, MIcon } from '@mexit/core'

import { FilterMenuDiv } from '../../Style/Filter'
import { SidebarListFilter } from '../../Style/SidebarList.style'
import { IconDisplay } from '../IconDisplay'

import { Input } from './../../Style/Form'
import { MenuClassName, MenuFilterInputClassName, MenuItemClassName, RootMenuClassName } from './Dropdown.classes'
import {
  ItemLabel,
  MenuItemCount,
  MenuItemWrapper,
  MenuWrapper,
  MultiSelectIcon,
  RootMenuWrapper
} from './Dropdown.style'

export const MenuItem = forwardRef<
  HTMLButtonElement,
  {
    label: string
    icon: MIcon
    count?: number
    multiSelect?: boolean
    selected?: boolean
    disabled?: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  }
>(({ label, disabled, count, icon, multiSelect, selected, ...props }, ref) => {
  // mog('MenuItem', { label, disabled, count, icon, multiSelect, selected, props })
  return (
    <MenuItemWrapper {...props} ref={ref} role="menuitem" disabled={disabled}>
      <FilterMenuDiv>
        {multiSelect && (
          <MultiSelectIcon selected={selected}>
            {selected ? <Icon icon="ri:checkbox-fill" /> : <Icon icon="ri:checkbox-blank-line" />}
          </MultiSelectIcon>
        )}
        <IconDisplay icon={icon} />
        <ItemLabel>{label}</ItemLabel>
      </FilterMenuDiv>
      {count && <MenuItemCount>{count}</MenuItemCount>}
    </MenuItemWrapper>
  )
})

MenuItem.displayName = 'MenuItem'

interface Props {
  className?: string
  label?: string
  /**
   * Is the menu nested
   */
  nested?: boolean
  /**
   * MenuItems or Menus
   */
  children?: React.ReactNode
  /**
   * Additional values to render in the menu trigger
   */
  values?: React.ReactNode
  /**
   * Whether to show search input?
   */
  allowSearch?: boolean
  /**
   * Placeholder for search input
   */
  searchPlaceholder?: string
  /**
   * Does it allow multiple selections?
   */
  multiSelect?: boolean

  /**
   * Creatable?
   */
  onCreate?: (value: string) => void

  /**
   * Which element to render the portal in
   */
  root?: HTMLElement | null
}

export const MenuComponent = forwardRef<any, Props & React.HTMLProps<HTMLButtonElement>>(
  (
    { children, label, values, multiSelect, allowSearch, onCreate, searchPlaceholder, className, root, ...props },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [allowHover, setAllowHover] = useState(false)
    const [search, setSearch] = useState('')
    const [filteredChildren, setFilteredChildren] = useState<React.ReactNode>(children)

    const inputRef = React.useRef<HTMLInputElement>(null)

    const listItemsRef = useRef<Array<HTMLButtonElement | null>>([])

    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      setSearch(e.target.value)
    }

    const tree = useFloatingTree()
    const nodeId = useFloatingNodeId()
    const parentId = useFloatingParentNodeId()
    const nested = parentId != null

    const { x, y, reference, floating, strategy, refs, context } = useFloating<HTMLButtonElement>({
      open,
      onOpenChange: setOpen,
      middleware: [offset({ mainAxis: 4, alignmentAxis: nested ? -5 : 0 }), flip(), shift()],
      placement: nested ? 'right-start' : 'bottom-start',
      nodeId,
      whileElementsMounted: autoUpdate
    })

    const resetSearch = useCallback(() => {
      // mog('resetSearch')
      setSearch('')
      setFilteredChildren(children)
    }, [children])

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      useHover(context, {
        handleClose: safePolygon({ restMs: 25 }),
        enabled: nested && allowHover,
        delay: { open: 75 }
      }),
      useClick(context, {
        toggle: !nested && !multiSelect,
        pointerDown: true,
        ignoreMouse: nested
      }),
      useRole(context, { role: 'menu' }),
      useDismiss(context, {
        escapeKey: true
      }),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        nested,
        loop: true,
        onNavigate: setActiveIndex
      })
    ])

    // Add scroll to active item
    // Required for scrollable menu and when overflow
    useEffect(() => {
      const activeEl = listItemsRef.current[activeIndex]
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }, [activeIndex])

    useEffect(() => {
      if (!open) {
        allowSearch && resetSearch()
      } else {
        if (inputRef.current) {
          listItemsRef.current.push(inputRef.current as any)
          inputRef.current.focus()
        }
      }
    }, [open, inputRef, allowSearch])

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // mog('keyDownHandler', { code: event.code })
      if (event.code === 'Enter' && !!onCreate) {
        event.preventDefault()
        event.stopPropagation()

        const inpVal = event.currentTarget.value
        onCreate(inpVal)
        setOpen(false)
        resetSearch()
      }
    }

    // Event emitter allows you to communicate across tree components.
    // This effect closes all menus when an item gets clicked anywhere
    // in the tree.
    useEffect(() => {
      function onTreeClick() {
        if (!multiSelect) {
          setOpen(false)
          resetSearch()
        }

        if (parentId === null) {
          refs.reference.current?.focus()
        }
      }

      tree?.events.on('click', onTreeClick)
      return () => {
        tree?.events.off('click', onTreeClick)
      }
    }, [parentId, tree, refs])

    // Determine if "hover" logic can run based on the modality of input. This
    // prevents unwanted focus synchronization as menus open and close with
    // keyboard navigation and the cursor is resting on the menu.
    useEffect(() => {
      function onPointerMove() {
        setAllowHover(true)
      }

      function onKeyDown() {
        setAllowHover(false)
      }

      window.addEventListener('pointermove', onPointerMove, {
        once: true,
        capture: true
      })
      window.addEventListener('keydown', onKeyDown, true)
      return () => {
        window.removeEventListener('pointermove', onPointerMove, {
          capture: true
        })
        window.removeEventListener('keydown', onKeyDown, true)
      }
    }, [allowHover])

    // Search through the children labels and filter out any that don't match
    useEffect(() => {
      if (allowSearch) {
        if (search && search !== '') {
          const childs = Children.map(children, (child) => (isValidElement(child) ? child.props.label : null)) as Array<
            string | null
          >
          // mog('Search', { search, childs })
          const filtered = fuzzySearch(childs, search, (item) => item)
          // mog('Search', { search, filtered })
          const newChildren = Children.map(children, (child) => {
            if (isValidElement(child) && filtered.includes(child.props.label)) {
              return child
            } else return null
          }).filter((child) => child !== null)
          setFilteredChildren(newChildren)
        }
        if (search === '') {
          setFilteredChildren(children)
        }
      }
    }, [search, allowSearch, children])

    const mergedReferenceRef = useMemo(() => mergeRefs([ref, reference]), [reference, ref])

    return (
      <FloatingNode id={nodeId}>
        <RootMenuWrapper
          type="button"
          {...getReferenceProps({
            ...props,
            ref: mergedReferenceRef,
            onClick(event) {
              event.stopPropagation()
              ;(event.currentTarget as HTMLButtonElement).focus()
            },
            ...(nested
              ? {
                  className: cx(MenuItemClassName, { open }),
                  role: 'menuitem',
                  onKeyDown(event) {
                    // Prevent more than one menu from being open.
                    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                      setOpen(false)
                      resetSearch()
                    }
                  }
                }
              : {
                  className: cx(className ? className : '', RootMenuClassName, { open })
                })
          })}
        >
          {label} {values && values}
          {nested && <Icon style={{ marginLeft: 10 }} icon="ri:arrow-right-s-line" />}
        </RootMenuWrapper>
        <FloatingPortal root={root}>
          {open && (
            <FloatingFocusManager
              context={context}
              modal={!nested}
              returnFocus={!nested}
              // Touch-based screen readers will be able to navigate back to the
              // reference and click it to dismiss the menu without clicking an item.
              // This acts as a touch-based `Esc` key. A visually-hidden dismiss button
              // is an alternative.
              order={['reference', 'content']}
            >
              <MenuWrapper
                {...getFloatingProps({
                  className: MenuClassName,
                  ref: floating,
                  style: {
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0
                  },
                  onKeyDown(event) {
                    if (event.key === 'Tab') {
                      setOpen(false)
                      resetSearch()
                    }
                  }
                })}
              >
                {allowSearch && children && (
                  <SidebarListFilter>
                    <Icon icon={searchLine} />
                    <Input
                      placeholder={searchPlaceholder ?? 'Filter items'}
                      className={MenuFilterInputClassName}
                      onChange={debounce((e) => onSearchChange(e), 250)}
                      onKeyDown={keyDownHandler}
                      ref={inputRef}
                    />
                  </SidebarListFilter>
                )}
                {Children.map(
                  filteredChildren,
                  (child, index) =>
                    isValidElement(child) &&
                    cloneElement(
                      child,
                      getItemProps({
                        tabIndex: -1,
                        role: 'menuitem',
                        className: MenuItemClassName,
                        ref(node: HTMLButtonElement) {
                          listItemsRef.current[index] = node
                        },
                        onClick(e) {
                          child.props.onClick?.(e)
                          tree?.events.emit('click')
                        },
                        // By default `focusItemOnHover` uses `mousemove` to sync focus,
                        // but when a menu closes we want this to sync it on `enter`
                        // even if the cursor didn't move. NB: Safari does not sync in
                        // this case.
                        onPointerEnter() {
                          if (allowHover) {
                            setActiveIndex(index)
                          }
                        }
                      })
                    )
                )}
              </MenuWrapper>
            </FloatingFocusManager>
          )}
        </FloatingPortal>
      </FloatingNode>
    )
  }
)

MenuComponent.displayName = 'Menu Component'

export const Menu: React.FC<Props> = forwardRef((props, ref) => {
  const parentId = useFloatingParentNodeId()

  if (parentId == null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref} />
      </FloatingTree>
    )
  }

  return <MenuComponent {...props} ref={ref} />
})

Menu.displayName = 'Menu'
