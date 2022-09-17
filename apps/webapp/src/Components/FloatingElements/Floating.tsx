import React, { cloneElement } from 'react'

import {
  offset,
  shift,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useId,
  useClick,
  FloatingFocusManager,
  FloatingPortal,
  useFloatingNodeId,
  FloatingNode,
  autoPlacement,
  useDelayGroupContext,
  useHover,
  useDelayGroup,
  safePolygon
} from '@floating-ui/react-dom-interactions'
import { RemoveScroll } from 'react-remove-scroll'

import { Props } from './types'

export const Floating = ({ children, open, label, hover, persist, setOpen, render, placement }: Props) => {
  const { delay, setCurrentId } = useDelayGroupContext()
  const nodeId = useFloatingNodeId()

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: (open: boolean) => {
      if (!persist) {
        setOpen(open)
      }

      if (label && open) setCurrentId(label)
    },
    middleware: [offset(15), autoPlacement(), shift()],
    placement,
    nodeId
  })

  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled: hover ?? false,
      delay: label ? delay : 1000,
      move: false,
      handleClose: safePolygon({
        buffer: 1
      })
    }),
    useClick(context),
    useRole(context),
    useDismiss(context),
    label && useDelayGroup(context, { id: label })
  ])

  return (
    <FloatingNode id={nodeId}>
      {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context}>
            <RemoveScroll>
              <div
                {...getFloatingProps({
                  className: 'Popover',
                  ref: floating,
                  style: {
                    position: strategy,
                    zIndex: 12,
                    top: y ?? 0,
                    left: x ?? 0
                  },
                  'aria-labelledby': labelId,
                  'aria-describedby': descriptionId
                })}
              >
                {render({
                  labelId,
                  descriptionId,
                  close: () => {
                    setOpen(false)
                  }
                })}
              </div>
            </RemoveScroll>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  )
}
