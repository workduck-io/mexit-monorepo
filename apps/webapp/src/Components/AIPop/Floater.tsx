import { useEffect, useRef } from 'react'

import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole
} from '@floating-ui/react'
import { getSelectionBoundingClientRect } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { FloatingElementType, useFloatingStore } from '@mexit/core'

import { FloaterContainer } from './styled'
import AIBlockPopover from '.'

const Floater = () => {
  const isOpen = useFloatingStore((store) => store.floatingElement === FloatingElementType.AI_TOOLTIP)
  const setIsOpen = useFloatingStore((store) => store.setFloatingElement)

  const theme = useTheme()
  const arrowRef = useRef(null)

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (isOpen) => {
      setIsOpen(isOpen ? FloatingElementType.AI_TOOLTIP : null)
    },
    middleware: [
      arrow({
        element: arrowRef
      }),
      offset({ mainAxis: 5, alignmentAxis: 0 }),
      flip(),
      shift()
    ],
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getFloatingProps, getItemProps } = useInteractions([click, dismiss, role])

  useEffect(() => {
    const coords = getSelectionBoundingClientRect()

    refs.setPositionReference({
      getBoundingClientRect() {
        return coords
      }
    })
  }, [isOpen])

  return (
    <FloatingPortal>
      {open && (
        <FloatingFocusManager context={context} modal={false}>
          <FloaterContainer
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content'
            }}
            {...getFloatingProps()}
          >
            <FloatingArrow
              height={8}
              width={16}
              radius={4}
              fill={theme.tokens.surfaces.modal}
              stroke={theme.tokens.surfaces.s[3]}
              strokeWidth={0.1}
              ref={arrowRef}
              context={context}
            />
            <AIBlockPopover />
          </FloaterContainer>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  )
}

export default Floater
