import React, { useEffect, useMemo, useRef, useState } from 'react'
import usePointerMovedSinceMount from '../../Hooks/usePointerMovedSinceMount'
import styled, { css } from 'styled-components'
import { ActionType, CategoryType, MexitAction, MEXIT_FRONTEND_URL_BASE } from '@mexit/core'
import { actionExec } from '../../Utils/actionExec'
import { useVirtual } from 'react-virtual'
import Action from '../Action'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { List, ListItem, StyledResults, Subtitle } from './styled'
import Renderer from '../Renderer'
import { useSpring } from 'react-spring'
import Screenshot from '../Action/Screenshot'

function Results() {
  const {
    search,
    setSearch,
    searchResults,
    activeItem,
    setActiveItem,
    activeIndex,
    setActiveIndex,
    preview,
    setPreview,
    setSearchResults
  } = useSputlitContext()
  const parentRef = useRef(null)
  const [first, setFirst] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const pointerMoved = usePointerMovedSinceMount()

  const rowVirtualizer = useVirtual({
    size: searchResults.length,
    parentRef
  })

  const springProps = useSpring(
    useMemo(() => {
      return {
        width: preview ? '50%' : '0',
        flex: preview ? '1' : '0',
        margin: preview ? '0.75em' : '0'
      }
    }, [preview])
  )

  // destructuring here to prevent linter warning to pass
  // entire rowVirtualizer in the dependencies array.
  const { scrollToIndex } = rowVirtualizer
  React.useEffect(() => {
    scrollToIndex(activeIndex, {
      // To ensure that we don't move past the first item
      align: activeIndex < 1 ? 'start' : 'auto'
    })
  }, [activeIndex, scrollToIndex])

  // TODO: lesser re-renders on using ref for active item, see KBarResults.tsx
  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => {
          let nextIndex = index > 0 ? index - 1 : index

          // avoid setting active index on a group
          if (typeof searchResults[nextIndex] === 'string') {
            if (nextIndex === 0) return index
            nextIndex -= 1
          }
          return nextIndex
        })
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => {
          let nextIndex = index < searchResults.length - 1 ? index + 1 : index

          // avoid setting active index on a group
          if (typeof searchResults[nextIndex] === 'string') {
            if (nextIndex === searchResults.length - 1) return index
            nextIndex += 1
          }
          return nextIndex
        })
        // TODO: improve the code below for the love of anything
      } else if (
        event.key === 'Enter' &&
        searchResults[activeIndex]?.category === CategoryType.action &&
        searchResults[activeIndex]?.type !== ActionType.SEARCH &&
        activeItem?.type !== ActionType.SEARCH
      ) {
        event.preventDefault()

        setSearchResults([])
        // TODO: stop search bar on action type search
      } else if (event.key === 'Enter') {
        event.preventDefault()
        setSearchResults([])

        if (searchResults[activeIndex].category === CategoryType.action) {
          setActiveItem(searchResults[activeIndex])
          actionExec(searchResults[activeIndex])
        } else if (searchResults[activeIndex].category === CategoryType.backlink) {
          window.open(`${MEXIT_FRONTEND_URL_BASE}/editor/${searchResults[activeIndex].id}`)
        }
        if (!first) {
          setActiveItem(searchResults[activeIndex])
          setFirst(true)
        } else {
          actionExec(activeItem, search.value)
        }
      }
    }

    // Not adding event listener to window as the event never reaches there
    document.getElementById('mexit')!.addEventListener('keydown', handler)

    return () => document.getElementById('mexit')!.removeEventListener('keydown', handler)
  }, [searchResults, activeIndex, activeItem])

  useEffect(() => {
    setActiveIndex(0)
  }, [searchResults])

  // To reset active Item when done
  useEffect(() => {
    const ret = () => {
      setActiveItem()
      setPreview(true)
    }
    return ret
  }, [])

  function handleClick(id: number) {
    if (searchResults[id]?.type !== ActionType.SEARCH && activeItem?.type !== ActionType.SEARCH) {
      setActiveItem(searchResults[id])
      actionExec(searchResults[id])
      setSearchResults([])
    } else {
      setSearchResults([])
      if (!first) {
        setActiveItem(searchResults[id])
        setFirst(true)
      } else {
        actionExec(activeItem, search.value)
      }
    }
  }

  return (
    <StyledResults style={springProps}>
      {/* TODO: don't hardcode this subtitle as we want cmd+arrow key interaction later */}

      <List ref={parentRef}>
        <div style={{ height: rowVirtualizer.totalSize }}>
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const item = searchResults[virtualRow.index]
            const lastItem = virtualRow.index > 0 ? searchResults[virtualRow.index - 1] : undefined
            const handlers = {
              onPointerMove: () => pointerMoved && setActiveIndex(virtualRow.index),
              onClick: () => handleClick(virtualRow.index)
            }
            const active = virtualRow.index === activeIndex

            return (
              <ListItem key={virtualRow.index} ref={virtualRow.measureRef} start={virtualRow.start} {...handlers}>
                {item.category !== lastItem?.category && <Subtitle key={item.category}>{item.category}</Subtitle>}
                <Action action={item} active={active} />
              </ListItem>
            )
          })}
        </div>
      </List>

      {activeItem && activeItem.type === ActionType.RENDER && <Renderer />}
      {activeItem && activeItem.type === ActionType.SCREENSHOT && <Screenshot />}
    </StyledResults>
  )
}

export default Results
