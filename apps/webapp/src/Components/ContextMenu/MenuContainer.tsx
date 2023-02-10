import { Children, cloneElement, forwardRef, isValidElement, useEffect, useRef, useState } from 'react'

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
  useHover,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead
} from '@floating-ui/react'

import { MIcon } from '@mexit/core'
import {
  FilterMenuDiv,
  getMIcon,
  Group,
  IconDisplay,
  ItemLabel,
  MenuItemClassName,
  MenuItemWrapper,
  MenuWrapper
} from '@mexit/shared'

import { useLayoutStore } from '../../Stores/useLayoutStore'

export const ContextMenuItem = forwardRef<
  HTMLButtonElement,
  { icon?: MIcon; onClick?: any; label: string; disabled?: boolean }
>(({ label, disabled, icon, ...props }, ref) => {
  return (
    <MenuItemWrapper {...props} ref={ref} role="menuitem" disabled={disabled}>
      <Group>
        {icon && <IconDisplay icon={icon} />}
        <ItemLabel>{label}</ItemLabel>
      </Group>
    </MenuItemWrapper>
  )
})

interface Props {
  label?: string
  icon?: MIcon
  disabled?: boolean
  handleClose?: boolean
}

const ContextMenuWrapper = forwardRef<any, Props & React.HTMLProps<HTMLButtonElement>>(
  ({ children, label, icon, disabled, handleClose, ...props }, forwardedRef) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const [allowHover, setAllowHover] = useState(false)
    const setContextMenu = useLayoutStore((store) => store.setContextMenu)

    const tree = useFloatingTree()
    const nodeId = useFloatingNodeId()
    const parentId = useFloatingParentNodeId()
    const nested = parentId != null
    const contextMenu = useLayoutStore((s) => s.contextMenu)

    const listItemsRef = useRef<Array<HTMLButtonElement | null>>([])
    const listContentRef = useRef(
      Children.map(children, (child) => (isValidElement(child) ? child.props.label : null)) as Array<string | null>
    )

    const { x, y, refs, strategy, context } = useFloating({
      open,
      nodeId,
      onOpenChange: (isOpen) => {
        setOpen(isOpen)
        if (!isOpen && handleClose) setContextMenu(undefined)
      },
      middleware: [offset({ mainAxis: 5, alignmentAxis: nested ? -5 : 0 }), flip(), shift()],
      placement: nested ? 'right-start' : 'bottom-start',
      whileElementsMounted: autoUpdate
    })

    const { getFloatingProps, getItemProps, getReferenceProps } = useInteractions([
      useRole(context, { role: 'menu' }),
      useDismiss(context, {
        escapeKey: true
      }),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        nested,
        onNavigate: setActiveIndex,
        focusItemOnOpen: false
      }),
      useHover(context, {
        handleClose: safePolygon({
          restMs: 25,
          blockPointerEvents: true
        }),
        enabled: nested && allowHover,
        delay: { open: 75 }
      }),
      useClick(context, {
        toggle: !nested,
        keyboardHandlers: true,
        ignoreMouse: nested
      }),
      useTypeahead(context, {
        enabled: open,
        listRef: listContentRef,
        onMatch: open ? setActiveIndex : undefined,
        activeIndex
      })
    ])

    useEffect(() => {
      if (contextMenu && !label) {
        refs.setPositionReference({
          getBoundingClientRect() {
            const e = contextMenu.coords

            return {
              x: e.x,
              y: e.y,
              width: 0,
              height: 0,
              top: e.y,
              right: e.x,
              bottom: e.y,
              left: e.x
            }
          }
        })
        setOpen(true)
      }
    }, [refs, label, contextMenu])

    // Event emitter allows you to communicate across tree components.
    // This effect closes all menus when an item gets clicked anywhere
    // in the tree.
    useEffect(() => {
      function handleTreeClick(e) {
        setOpen(false)
      }

      function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
        if (event.nodeId !== nodeId && event.parentId === parentId) {
          setOpen(false)
        }
      }

      tree?.events.on('click', handleTreeClick)
      tree?.events.on('menuopen', onSubMenuOpen)

      return () => {
        tree?.events.off('click', handleTreeClick)
        tree?.events.off('menuopen', onSubMenuOpen)
      }
    }, [tree, nodeId, parentId])

    useEffect(() => {
      if (open) {
        tree?.events.emit('menuopen', {
          parentId,
          nodeId
        })
      }
    }, [tree, open, nodeId, parentId])

    // Determine if "hover" logic can run based on the modality of input. This
    // prevents unwanted focus synchronization as menus open and close with
    // keyboard navigation and the cursor is resting on the menu.
    useEffect(() => {
      function onPointerMove({ pointerType }: PointerEvent) {
        if (pointerType !== 'touch') {
          setAllowHover(true)
        }
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

    const referenceRef = useMergeRefs([refs.setReference, forwardedRef])

    return (
      <FloatingNode id={nodeId}>
        {label && nested && !disabled && (
          <MenuItemWrapper
            ref={referenceRef}
            data-open={open ? '' : undefined}
            {...getReferenceProps({
              ...props,
              className: `${nested ? MenuItemClassName : 'RootMenu'}`,
              onClick(event) {
                event.stopPropagation()
              },
              ...(nested && {
                // Indicates this is a nested <Menu /> acting as a <MenuItem />.
                role: 'menuitem'
              })
            })}
          >
            <FilterMenuDiv>
              {icon && <IconDisplay icon={icon} />}
              <ItemLabel>{label}</ItemLabel>
              <IconDisplay icon={getMIcon('ICON', 'ri:arrow-right-s-line')} />
            </FilterMenuDiv>
          </MenuItemWrapper>
        )}
        <FloatingPortal>
          {open && (
            <FloatingFocusManager
              context={context}
              modal={!nested}
              initialFocus={nested ? -1 : 0}
              returnFocus={!nested}
              visuallyHiddenDismiss
            >
              <MenuWrapper
                {...getFloatingProps({
                  className: 'ContextMenu',
                  ref: refs.setFloating,
                  style: {
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0
                    // zIndex: 11
                  },
                  // Pressing tab dismisses the menu due to the modal
                  // focus management on the root menu.
                  onKeyDown(event) {
                    if (event.key === 'Tab') {
                      setOpen(false)

                      if (event.shiftKey) {
                        event.preventDefault()
                      }
                    }
                  }
                })}
              >
                {Children.map(
                  children,
                  (child, index) =>
                    isValidElement(child) &&
                    cloneElement(
                      child,
                      getItemProps({
                        tabIndex: activeIndex === index ? 0 : -1,
                        role: 'menuitem',
                        className: MenuItemClassName,
                        onClick(e) {
                          child.props.onClick?.(e)
                          tree?.events.emit('click')
                          // setContextMenu(undefined)
                        },
                        ref(node: HTMLButtonElement) {
                          listItemsRef.current[index] = node
                        },
                        onPointerEnter() {
                          if (allowHover && open) {
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

ContextMenuWrapper.displayName = 'ContextMenuWrapper'
ContextMenuItem.displayName = 'ContextMenuItem'

export const ContextMenuContainer: React.FC<any> = forwardRef((props, ref) => {
  const parentId = useFloatingParentNodeId()

  if (parentId == null) {
    return (
      <FloatingTree>
        <ContextMenuWrapper {...props} ref={ref} />
      </FloatingTree>
    )
  }

  return <ContextMenuWrapper {...props} ref={ref} />
})

ContextMenuContainer.displayName = 'ContextMenuContainer'
