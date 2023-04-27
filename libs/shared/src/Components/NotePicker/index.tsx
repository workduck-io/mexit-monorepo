import React, { useEffect, useRef, useState } from 'react'

import { useDebouncedCallback } from 'use-debounce'

import { tinykeys } from '@workduck-io/tinykeys'

import { fuzzySearch, getNameFromPath, ILink, useMetadataStore } from '@mexit/core'

import { Input } from '../../Style/Form'
import { SidebarListFilter } from '../../Style/SidebarList.style'
import { IconDisplay } from '../IconDisplay'
import { DefaultMIcons } from '../Icons'

import { NoteItem, NoteItemsWrapper } from './styled'

type NotePickerProps = {
  items: Array<ILink>
  placeholder?: string
  onSelect: (noteId: string) => void
  onReset?: () => void
}

export const NotePicker: React.FC<NotePickerProps> = ({ items, placeholder, onSelect, onReset }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)

  const [filteredNotes, setFilteredNotes] = useState(items)
  const metadata = useMetadataStore.getState().metadata.notes
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (search && search !== '') {
      const filtered = fuzzySearch(items, search, (item) => item.path)
      setFilteredNotes(filtered)
    }
    if (search === '') {
      setFilteredNotes(items)
    }
  }, [search, items])

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [selected])

  const reset = () => {
    if (search === '' && onReset) onReset()

    setSearch('')
    setFilteredNotes(items)
    setSelected(0)
    const inpEl = inputRef.current
    if (inpEl) inpEl.value = ''
  }

  const handleOnSelect = (id: string) => {
    onSelect(id)
    setSelected(0)
  }

  const onSearch = useDebouncedCallback((e) => {
    setSelected(0)
    setSearch(e.target.value)
  }, 250)

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
              handleOnSelect(item.nodeid)
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

  return (
    <>
      <SidebarListFilter border>
        <IconDisplay icon={DefaultMIcons.SEARCH} />
        <Input
          placeholder={placeholder ?? 'Search for a Note...'}
          className={'NoteSelectListFilter__Input'}
          onChange={onSearch}
          autoFocus
          ref={inputRef}
        />
      </SidebarListFilter>
      <NoteItemsWrapper>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => {
            const icon = metadata[note.nodeid]?.icon

            return (
              <NoteItem
                ref={selected === index ? selectedRef : undefined}
                onClick={() => handleOnSelect(note.nodeid)}
                selected={selected === index}
                key={note.nodeid}
              >
                <IconDisplay icon={icon ?? DefaultMIcons.NOTE} />
                {getNameFromPath(note.path)}
              </NoteItem>
            )
          })
        ) : (
          <div className="Dialog__Select__Empty">No notes found</div>
        )}
      </NoteItemsWrapper>
    </>
  )
}
