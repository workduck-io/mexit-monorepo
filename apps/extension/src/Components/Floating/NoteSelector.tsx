import useDataStore from '../../Stores/useDataStore'
import React, { cloneElement, useMemo, useState } from 'react'

import {
  useFloating,
  useInteractions,
  useClick,
  useRole,
  useDismiss,
  useId,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager
} from '@floating-ui/react-dom-interactions'
import { mergeRefs } from 'react-merge-refs'
import { Select, Option } from './Selector'

interface Props {
  open?: boolean
  render: (props: { close: () => void; labelId: string; descriptionId: string }) => React.ReactNode
  children?: JSX.Element
  root?: HTMLElement
}

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
    useRole(context),
    useDismiss(context)
  ])

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
          <FloatingOverlay
            lockScroll
            style={{
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(25, 25, 25, 0.8)'
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
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  )
}

interface NoteSelectorProps {
  root?: HTMLElement
  selectionMessage?: string
  onSelect: (nodeid: string) => void
}

const NoteSelector = ({ root, selectionMessage = 'Select note' }: NoteSelectorProps) => {
  const notes = useDataStore((state) => state.ilinks)

  return (
    <>
      <Dialog
        open={true}
        root={root}
        render={({ close, labelId, descriptionId }) => (
          <>
            <h1 id={labelId}>{selectionMessage}</h1>
            <Select
              value=""
              render={(selectedIndex) => (
                <div>
                  {notes[selectedIndex] ? (
                    <img className="OptionIcon" alt="Poster" src={notes[selectedIndex]?.icon} />
                  ) : null}
                  {notes[selectedIndex]?.path ?? 'Select...'}{' '}
                </div>
              )}
              onChange={console.log}
            >
              {notes.map(({ path, icon }) => (
                <Option key={path} value={path}>
                  <div>
                    {icon && <img className="OptionIcon" alt="Poster" src={icon} />} <span>{path}</span>
                  </div>
                </Option>
              ))}
            </Select>
            <button onClick={close}>Close</button>
          </>
        )}
      />
    </>
  )
}

export default NoteSelector
