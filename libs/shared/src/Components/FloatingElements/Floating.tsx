import React, { cloneElement } from 'react'
import { RemoveScroll } from 'react-remove-scroll'

import {
  autoPlacement,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useClick,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useHover,
  useId,
  useInteractions,
  useRole,
  useTransitionStyles
} from '@floating-ui/react'

import { Props } from './types'

export const Floating = ({
  children,
  scrollLock = true,
  open,
  label,
  hover,
  persist,
  setOpen,
  render,
  disableClick,
  placement,
  root
}: Props) => {
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
    middleware: [offset(30), autoPlacement(), shift({ padding: 5 })],
    placement,
    nodeId
  })

  const { styles } = useTransitionStyles(context)

  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled: hover ?? false,
      delay: label ? delay : 500,
      move: false,
      handleClose: safePolygon({
        restMs: 50,
        blockPointerEvents: true
      })
    }),
    useClick(context, { enabled: !disableClick }),
    useRole(context),
    useDismiss(context)
  ])

  return (
    <FloatingNode id={nodeId}>
      {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
      <FloatingPortal root={root}>
        {open && (
          <FloatingFocusManager context={context}>
            <RemoveScroll enabled={scrollLock}>
              <div
                {...getFloatingProps({
                  className: 'Popover',
                  ref: floating,
                  style: {
                    position: strategy,
                    zIndex: 120,
                    top: y ?? 0,
                    left: x ?? 0,
                    ...styles
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
