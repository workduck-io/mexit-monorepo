import React, { useEffect, useMemo, useRef, useState } from 'react'
import usePointerMovedSinceMount from '../../Hooks/usePointerMovedSinceMount'
import styled, { css } from 'styled-components'
import { ActionType, CategoryType, MexitAction, MEXIT_FRONTEND_URL_BASE, QuickLinkType } from '@mexit/core'
import { actionExec } from '../../Utils/actionExec'
import { useVirtual } from 'react-virtual'
import Action from '../Action'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { List, ListItem, StyledResults, Subtitle } from './styled'
import Renderer from '../Renderer'
import { useSpring } from 'react-spring'
import Screenshot from '../Action/Screenshot'
import { useEditorContext } from '../../Hooks/useEditorContext'

function Results() {
  const { search, setSearch, searchResults, activeItem, setActiveItem, activeIndex, setActiveIndex, setSearchResults } =
    useSputlitContext()
  const { preview, setPreview, setNodeContent } = useEditorContext()

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
      const style = { width: '55%', marginRight: '0.75em' }

      if (!preview) {
        style.width = '0%'
        style.marginRight = '0'
      }

      if (searchResults[activeIndex] && searchResults[activeIndex]?.category === QuickLinkType.action) {
        style.width = '100%'
      }

      return style
    }, [preview, activeIndex, searchResults])
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
      } else if (event.key === 'Enter') {
        event.preventDefault()
        const item = searchResults[activeIndex]

        if (item.category === QuickLinkType.action && item.type !== ActionType.RENDER) {
          actionExec(item, search.value)
        } else if (item.category === QuickLinkType.action && item.type === ActionType.RENDER) {
          setActiveItem(item)
          setSearchResults([])
        }
      }
    }

    // Not adding event listener to window as the event never reaches there
    document.getElementById('mexit')!.addEventListener('keydown', handler)

    return () => {
      document.getElementById('mexit')!.removeEventListener('keydown', handler)
    }
  }, [searchResults, activeIndex, activeItem])

  useEffect(() => {
    setActiveIndex(0)
  }, [searchResults])

  function handleClick(id: number) {
    const item = searchResults[id]

    if (item.category === QuickLinkType.action && item.type !== ActionType.RENDER) {
      actionExec(item, search.value)
    } else if (item.category === QuickLinkType.action && item.type === ActionType.RENDER) {
      setActiveItem(item)
      setSearchResults([])
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

      {activeItem?.type === ActionType.RENDER && <Renderer />}
      {/* {activeItem && activeItem.type === ActionType.SCREENSHOT && <Screenshot />}  */}
    </StyledResults>
  )
}

export default Results
