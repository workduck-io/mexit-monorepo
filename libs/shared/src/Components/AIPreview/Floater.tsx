import React, { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { RemoveScroll } from 'react-remove-scroll'

import {
  arrow,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole
} from '@floating-ui/react'
import { getSelectionBoundingClientRect } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { FloatingElementType, useFloatingStore, useHistoryStore } from '@mexit/core'

import { FloaterContainer } from './styled'
import { AIPreviewProps } from './types'
import AIBlockPopover from '.'

interface DefaultFloaterProps extends AIPreviewProps {
  onClose?: () => void
}

const DefaultFloater: React.FC<DefaultFloaterProps> = ({ onClose, root, ...props }) => {
  const isOpen = useFloatingStore((store) => store.floatingElement === FloatingElementType.AI_POPOVER)
  const setIsOpen = useFloatingStore((store) => store.setFloatingElement)

  const theme = useTheme()
  const arrowRef = useRef(null)

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (isOpen) => {
      const state = isOpen ? FloatingElementType.AI_POPOVER : null
      if (!state && onClose) {
        onClose()
      }

      setIsOpen(state)
    },
    middleware: [
      shift({
        crossAxis: true,
        padding: 10
      }),
      flip(),
      arrow({
        element: arrowRef,
        padding: 10
      })
    ]
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getFloatingProps } = useInteractions([click, dismiss, role])

  useEffect(() => {
    const coords = getSelectionBoundingClientRect()

    refs.setPositionReference({
      getBoundingClientRect() {
        return coords
      }
    })
  }, [isOpen])

  return (
    isOpen && (
      <FloatingPortal root={root}>
        <RemoveScroll enabled>
          <FloatingFocusManager context={context} closeOnFocusOut>
            <FloaterContainer
              id="ai-preview"
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
              <AIBlockPopover {...props} root={root} />
            </FloaterContainer>
          </FloatingFocusManager>
        </RemoveScroll>
      </FloatingPortal>
    )
  )
}

export const AIPreview: React.FC<Omit<DefaultFloaterProps, 'onClose'>> = (props) => {
  const clearAIEventsHistory = useHistoryStore((s) => s.clearAIHistory)

  return (
    <ErrorBoundary FallbackComponent={() => <></>}>
      <DefaultFloater {...props} onClose={clearAIEventsHistory} />
    </ErrorBoundary>
  )
}
