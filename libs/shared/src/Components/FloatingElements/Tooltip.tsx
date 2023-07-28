import React, { cloneElement, useMemo, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'

import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole
} from '@floating-ui/react'
import { useTheme } from 'styled-components'

import { TooltipWrapper } from './Tooltip.style'

interface Props {
  // Pass null to hide the tooltip
  content: JSX.Element | string | null
  placement?: Placement
  children: JSX.Element
  offsetPx?: number
  delay?: number
  root?: HTMLElement
}

/**
 * Generic Tooltip component
 *
 * Ref: https://codesandbox.io/s/winter-tree-wmmffl?file=/src/App.tsx
 */
export const Tooltip = ({ children, content, delay = 500, offsetPx = 10, placement = 'top', root }: Props) => {
  const [open, setOpen] = useState(false)

  const theme = useTheme()
  const arrowRef = useRef(null)

  const { x, y, reference, floating, strategy, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(offsetPx),
      flip(),
      shift({ padding: 8 }),
      arrow({
        element: arrowRef,
        padding: 10
      })
    ],
    whileElementsMounted: autoUpdate
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      delay: {
        open: delay,
        close: 0
      },
      restMs: delay
    }),
    useRole(context, { role: 'tooltip' }),
    useDismiss(context)
  ])

  const ref = useMemo(() => mergeRefs([reference, (children as any).ref]), [reference, children])

  // console.log('Tooltip', { content })
  return (
    <>
      {cloneElement(children, getReferenceProps({ ref, ...children.props }))}
      <FloatingPortal root={root}>
        {open && content !== null && (
          <TooltipWrapper
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0
            }}
            {...getFloatingProps()}
          >
            <FloatingArrow
              height={3}
              width={8}
              radius={1}
              fill={theme.tokens.surfaces.modal}
              stroke={theme.tokens.surfaces.s[3]}
              strokeWidth={0.1}
              ref={arrowRef}
              context={context}
            />
            {content}
          </TooltipWrapper>
        )}
      </FloatingPortal>
    </>
  )
}
