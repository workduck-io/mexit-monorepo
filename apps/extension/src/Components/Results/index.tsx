import React, { useEffect, useRef, useState } from 'react'
import usePointerMovedSinceMount from '../../Hooks/usePointerMovedSinceMount'
import styled, { css } from 'styled-components'
import { ActionType, MexitAction } from '@mexit/shared'
import { actionExec } from '../../Utils/actionExec'
import { useVirtual } from 'react-virtual'
import Action from '../Action'
import { CategoryType, useSputlitContext } from '../../Hooks/useSputlitContext'
import { List, ListItem, StyledResults, Subtitle } from './styled'
import Renderer from '../Renderer'
import { useSpring } from 'react-spring'

function Results() {
  const { search, setSearch, searchResults, activeItem, setActiveItem, activeIndex, setActiveIndex, preview } =
    useSputlitContext()
  const parentRef = useRef(null)
  const [first, setFirst] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const pointerMoved = usePointerMovedSinceMount()

  const rowVirtualizer = useVirtual({
    size: searchResults.length,
    parentRef
  })

  const springProps = useSpring({ width: preview ? '50%' : '0', flex: preview ? '1' : '0' })

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
        searchResults[activeIndex]?.type !== ActionType.SEARCH &&
        activeItem?.item.type !== ActionType.SEARCH
      ) {
        event.preventDefault()
        setActiveItem(searchResults[activeIndex])
        actionExec(searchResults[activeIndex])
        if (searchResults[activeIndex].type === ActionType.RENDER) {
          setShowResults(false)
        }
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (!first) {
          setActiveIndex(searchResults[activeIndex])
          setFirst(true)
          // TODO: here as well
          setSearch({ value: '', type: CategoryType.search })
          setShowResults(false)
        } else {
          actionExec(activeItem.item, search.value)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [searchResults, activeIndex, activeItem])

  useEffect(() => {
    setActiveIndex(0)
  }, [searchResults])

  function handleClick(id: number) {
    if (searchResults[id]?.type !== ActionType.SEARCH && activeItem?.item.type !== ActionType.SEARCH) {
      setActiveItem(searchResults[id])
      actionExec(searchResults[id])
      if (searchResults[id].type === ActionType.RENDER) {
        setShowResults(false)
      }
    } else {
      if (!first) {
        setActiveIndex(searchResults[id])
        setFirst(true)
        // TODO: here as well
        setSearch({ value: '', type: CategoryType.search })
        setShowResults(false)
      } else {
        actionExec(activeItem.item, search.value)
      }
    }
  }

  return (
    <StyledResults style={springProps}>
      <Subtitle>Navigation</Subtitle>

      <List ref={parentRef}>
        <div style={{ height: rowVirtualizer.totalSize }}>
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const item = searchResults[virtualRow.index]
            const handlers = {
              onPointerMove: () => pointerMoved && setActiveIndex(virtualRow.index),
              onClick: () => handleClick(virtualRow.index)
            }
            const active = virtualRow.index === activeIndex

            return (
              <ListItem key={virtualRow.index} ref={virtualRow.measureRef} start={virtualRow.start} {...handlers}>
                <Action action={item} active={active} />
              </ListItem>
            )
          })}
        </div>
      </List>

      {activeItem.item && activeItem.item.type === ActionType.RENDER && <Renderer />}
    </StyledResults>
  )
}

export default Results
