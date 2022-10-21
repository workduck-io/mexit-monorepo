import React, { cloneElement, useEffect, useMemo, useState } from 'react'

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useFloating,
  useId,
  useInteractions,
  useRole
} from '@floating-ui/react-dom-interactions'

import { mergeRefs } from 'react-merge-refs'
import { DialogOverlay } from './Dialog.style'

interface Props {
  open?: boolean
  render: (props: { close: () => void; labelId: string; descriptionId: string }) => React.ReactNode
  children?: JSX.Element
  root?: HTMLElement
}

/**
 * Opens a Modal dialog with render as the dialog contents
 * change open to false to close the dialog or call the close function passed to the render to close from within dialog's contents
 */
export const Dialog = ({ render, root, open: passedOpen = false, children }: Props) => {
  const [open, setOpen] = useState(passedOpen)

  const { reference, floating, context } = useFloating({
    open,
    onOpenChange: setOpen
  })

  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context)
    // useDismiss(context)
  ])

  useEffect(() => {
    if (passedOpen !== open) {
      setOpen(passedOpen)
    }
  }, [passedOpen])

  // Preserve the consumer's ref
  const ref = useMemo(
    () => mergeRefs(children ? [reference, (children as any).ref] : [reference]),
    [reference, children]
  )

  return (
    <>
      {children && cloneElement(children, getReferenceProps({ ref, ...children.props }))}
      <FloatingPortal root={root}>
        {open && (
          <DialogOverlay
            lockScroll
            style={{
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(0, 0, 0, 0.9)'
            }}
          >
            <FloatingFocusManager context={context}>
              <div
                ref={floating}
                className="Dialog"
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                {render({
                  close: () => setOpen(false),
                  labelId,
                  descriptionId
                })}
              </div>
            </FloatingFocusManager>
          </DialogOverlay>
        )}
      </FloatingPortal>
    </>
  )
}
