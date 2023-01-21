import { Children, cloneElement, forwardRef, isValidElement, useEffect, useRef, useState } from 'react'

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead
} from '@floating-ui/react'

import { MIcon } from '@mexit/core'
import { FilterMenuDiv, IconDisplay, ItemLabel, MenuItemClassName, MenuItemWrapper, MenuWrapper } from '@mexit/shared'

import { useLayoutStore } from '../../Stores/useLayoutStore'

export const ContextMenuItem = forwardRef<
  HTMLButtonElement,
  { icon?: MIcon; onClick?: any; label: string; disabled?: boolean }
>(({ label, disabled, icon, ...props }, ref) => {
  return (
    <MenuItemWrapper {...props} ref={ref} role="menuitem" disabled={disabled}>
      <FilterMenuDiv>
        {icon && <IconDisplay icon={icon} />}
        <ItemLabel>{label}</ItemLabel>
      </FilterMenuDiv>
    </MenuItemWrapper>
  )
})

interface Props {
  label?: string
  nested?: boolean
}

export const ContextMenuContainer = forwardRef<any, Props & React.HTMLProps<HTMLButtonElement>>(
  ({ children }, forwardedRef) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const contextMenu = useLayoutStore((s) => s.contextMenu)

    const listItemsRef = useRef<Array<HTMLButtonElement | null>>([])
    const listContentRef = useRef(
      Children.map(children, (child) => (isValidElement(child) ? child.props.label : null)) as Array<string | null>
    )

    const { x, y, refs, strategy, context } = useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset({ mainAxis: 5, alignmentAxis: 4 }), flip(), shift()],
      placement: 'right-start',
      strategy: 'fixed',
      whileElementsMounted: autoUpdate
    })

    const { getFloatingProps, getItemProps } = useInteractions([
      useRole(context, { role: 'menu' }),
      useDismiss(context),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        onNavigate: setActiveIndex,
        focusItemOnOpen: false
      }),
      useTypeahead(context, {
        enabled: open,
        listRef: listContentRef,
        onMatch: setActiveIndex,
        activeIndex
      })
    ])

    useEffect(() => {
      if (contextMenu) {
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
    }, [refs, contextMenu])

    return (
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll style={{ zIndex: 10 }}>
            <FloatingFocusManager context={context} initialFocus={refs.floating}>
              <MenuWrapper
                {...getFloatingProps({
                  className: 'ContextMenu',
                  ref: refs.setFloating,
                  style: {
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    zIndex: 11
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
                        tabIndex: -1,
                        role: 'menuitem',
                        className: MenuItemClassName,
                        onClick(e) {
                          child.props.onClick?.(e)
                        },
                        ref(node: HTMLButtonElement) {
                          listItemsRef.current[index] = node
                        }
                      })
                    )
                )}
              </MenuWrapper>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    )
  }
)

ContextMenuContainer.displayName = 'ContextMenuContainer'
ContextMenuItem.displayName = 'ContextMenuItem'
