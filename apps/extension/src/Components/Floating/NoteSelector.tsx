import React, { useEffect, useMemo, useState } from 'react'

import { Button } from '@workduck-io/mex-components'

import { useDataStore } from '@mexit/core'
import { NotePicker } from '@mexit/shared'

import { isReadonly, usePermissions } from '../../Hooks/usePermissions'

import { Dialog } from './Dialog'
import { SelectionList } from './NoteSelector.style'

interface NoteSelectorProps {
  root?: HTMLElement
  selectionMessage?: string
  searchPlaceholder?: string
  onSelect: (nodeid: string) => void
  open?: boolean
}

/**
 * The selector of notes
 *
 * Opens a modal interface with a input and a list of notes
 * The list is only of the notes that can be edited by the user
 * The list is filtred by the input
 * Arrow keys to move around and Enter to select
 */
const NoteSelector = ({
  root,
  open: passedOpen,
  searchPlaceholder,
  selectionMessage = 'Select note',
  onSelect
}: NoteSelectorProps) => {
  const notes = useDataStore((state) => state.ilinks)
  const { accessWhenShared } = usePermissions()

  const [open, setOpen] = useState(passedOpen)

  const appendableNotes = useMemo(() => {
    const appendable = notes.filter((note) => !isReadonly(accessWhenShared(note.nodeid)))
    return appendable
  }, [notes])

  const onSelectItem = (id: string) => {
    onSelect(id)
    setOpen(false)
  }

  useEffect(() => {
    if (passedOpen !== open) {
      setOpen(passedOpen)
    }
  }, [passedOpen])

  return (
    <>
      <Dialog
        open={open}
        root={root}
        render={({ close, labelId, descriptionId }) => (
          <>
            <h3 id={labelId}>{selectionMessage}</h3>
            <SelectionList>
              <NotePicker items={appendableNotes} onSelect={onSelectItem} onReset={() => setOpen(false)} />
              <Button onClick={close} className="Dialog__Close">
                Cancel
              </Button>
            </SelectionList>
          </>
        )}
      />
    </>
  )
}

export default NoteSelector
