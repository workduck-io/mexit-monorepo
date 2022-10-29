import React, { useEffect, useMemo, useState } from 'react'

import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'

import { Button } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { fuzzySearch } from '@mexit/core'
import { Input, SidebarListFilter } from '@mexit/shared'

import { getTitleFromPath } from '../../Hooks/useLinks'
import { isReadonly, usePermissions } from '../../Hooks/usePermissions'
import useDataStore from '../../Stores/useDataStore'
import { Dialog } from './Dialog'
import { NoteItem, NoteItemsWrapper, SelectionList } from './NoteSelector.style'

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
  const [filteredNotes, setFilteredNotes] = useState(notes)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(passedOpen)
  const [selected, setSelected] = useState(-1)

  const appendableNotes = useMemo(() => {
    const appendable = notes.filter((note) => !isReadonly(accessWhenShared(note.nodeid)))
    // mog('appendable', { appendable, notes })
    return appendable
  }, [notes])

  const selectedRef = React.useRef<HTMLDivElement>(null)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const reset = () => {
    if (search === '') setOpen(false)

    setSearch('')
    setFilteredNotes(appendableNotes)
    setSelected(-1)
    const inpEl = inputRef.current
    if (inpEl) inpEl.value = ''
  }

  const onSelectItem = (id: string) => {
    setSelected(-1)
    onSelect(id)
    setOpen(false)
  }

  useEffect(() => {
    if (passedOpen !== open) {
      setOpen(passedOpen)
    }
  }, [passedOpen])

  useEffect(() => {
    if (inputRef.current) {
      const unsubscribe = tinykeys(inputRef.current, {
        Escape: (event) => {
          event.stopPropagation()
          reset()
        },
        Enter: (event) => {
          event.stopPropagation()
          if (selected >= 0) {
            const item = filteredNotes[selected]
            if (item) {
              onSelectItem(item.nodeid)
            }
          }
        },
        ArrowDown: (event) => {
          event.stopPropagation()
          // Circular increment
          setSelected((selected + 1) % filteredNotes.length)
        },
        ArrowUp: (event) => {
          event.stopPropagation()
          // Circular decrement with no negative
          setSelected((selected - 1 + filteredNotes.length) % filteredNotes.length)
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [filteredNotes, selected])

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [selected])

  // Search through the notes and filter out any that don't match
  useEffect(() => {
    if (search && search !== '') {
      const filtered = fuzzySearch(appendableNotes, search, (item) => item.path)
      // mog('Search', { search, filtered })
      setFilteredNotes(filtered)
    }
    if (search === '') {
      setFilteredNotes(appendableNotes)
    }
  }, [search, appendableNotes])

  return (
    <>
      <Dialog
        open={open}
        root={root}
        render={({ close, labelId, descriptionId }) => (
          <>
            <h3 id={labelId}>{selectionMessage}</h3>
            <SelectionList>
              <SidebarListFilter>
                <Icon icon={searchLine} />
                <Input
                  placeholder={searchPlaceholder ?? 'Filter items'}
                  className={'NoteSelectListFilter__Input'}
                  onChange={debounce((e) => onSearchChange(e), 250)}
                  autoFocus
                  ref={inputRef}
                />
              </SidebarListFilter>
              <NoteItemsWrapper>
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note, index) => (
                    <NoteItem
                      ref={selected === index ? selectedRef : undefined}
                      onClick={() => onSelectItem(note.nodeid)}
                      selected={selected === index}
                      key={note.nodeid}
                    >
                      <Icon icon={note.icon ?? fileList2Line} />
                      {getTitleFromPath(note.path)}
                    </NoteItem>
                  ))
                ) : (
                  <div className="Dialog__Select__Empty">No notes found</div>
                )}
              </NoteItemsWrapper>
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
