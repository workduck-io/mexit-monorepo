import React, { cloneElement, useMemo, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { PopoverWrapper } from './Popover.style'
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole} from '@floating-ui/react-dom-interactions'

interface Props {
  render: (data: { close: () => void; labelId: string; descriptionId: string }) => React.ReactNode
  placement?: Placement
  transparent?: boolean
  children: JSX.Element
  rootRef?: React.RefObject<HTMLElement>
  onClose?: () => void
}

export const Popover = ({ children, onClose, render, placement, transparent, rootRef }: Props) => {
  const [open, setOpen] = useState(false)

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen && onClose) {
      onClose()
    }
    setOpen(isOpen)
  }

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange,
    middleware: [offset(5), flip(), shift()],
    placement,
    whileElementsMounted: autoUpdate
  })

  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, {
      referencePointerDown: false
    })
  ])

  // Preserve the consumer's ref
  const ref = useMemo(() => mergeRefs([reference, (children as any).ref]), [reference, children])

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref, ...children.props }))}
      <FloatingPortal root={rootRef ? rootRef.current : undefined}>
        {open && (
          <FloatingFocusManager context={context}>
            <PopoverWrapper
              ref={floating}
              className="Popover"
              transparent={transparent}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0
              }}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              {...getFloatingProps()}
            >
              {render({
                labelId,
                descriptionId,
                close: () => {
                  onOpenChange(false)
                }
              })}
            </PopoverWrapper>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  )
}
