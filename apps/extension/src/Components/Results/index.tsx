import React, { useEffect, useMemo, useRef } from 'react'

import { findIndex, groupBy } from 'lodash'
import { useSpring } from 'react-spring'
import { useVirtual } from 'react-virtual'

import { ActionType, QuickLinkType } from '@mexit/core'
import { PrimaryText } from '@mexit/shared'

import { useActionExecutor } from '../../Hooks/useActionExecutor'
import { useEditorContext } from '../../Hooks/useEditorContext'
import usePointerMovedSinceMount from '../../Hooks/usePointerMovedSinceMount'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import Action from '../Action'
import Renderer from '../Renderer'
import { List, ListItem, StyledResults, Subtitle } from './styled'
import { Screenshot } from '../Screenshot/Screenshot'

function Results() {
  const { activeIndex, setActiveIndex } = useSputlitContext()
  const results = useSputlitStore((s) => s.results)
  const input = useSputlitStore((s) => s.input)

  const { previewMode } = useEditorContext()
  const { execute } = useActionExecutor()

  const activeItem = useSputlitStore((s) => s.activeItem)
  const resetSpotlitState = useSputlitStore((store) => store.reset)

  const parentRef = useRef(null)
  const pointerMoved = usePointerMovedSinceMount()

  const groups = Object.keys(groupBy(results, (n) => n.category))

  const indexes = useMemo(() => groups.map((gn) => findIndex(results, (n) => n.category === gn)), [groups])

  const rowVirtualizer = useVirtual({
    size: results.length,
    parentRef
  })

  const springProps = useSpring(
    useMemo(() => {
      const style = { width: '100%' }

      if (!previewMode) {
        style.width = '0%'
      }

      if (activeItem?.type === ActionType.RENDER) {
        style.width = '100%'
      }

      return style
    }, [previewMode, activeIndex, results, activeItem])
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

        // * check if CMD + ARROW_UP is pressed
        if (event.metaKey) {
          for (let i = indexes[indexes.length - 1]; i > -1; i--) {
            const categoryIndex = indexes[i]
            if (categoryIndex < activeIndex && results[categoryIndex].category !== results[activeIndex].category) {
              setActiveIndex(categoryIndex)
              break
            }
          }
        } else
          setActiveIndex((index: number) => {
            let nextIndex = index > 0 ? index - 1 : index

            // avoid setting active index on a group
            if (typeof results[nextIndex] === 'string') {
              if (nextIndex === 0) nextIndex = index
              else nextIndex -= 1
            }

            return nextIndex
          })
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()

        // * check if CMD + ARROW_DOWN is pressed
        if (event.metaKey) {
          for (let i = 0; i < indexes.length; i++) {
            const categoryIndex = indexes[i]
            if (categoryIndex > activeIndex && results[categoryIndex].category !== results[activeIndex].category) {
              setActiveIndex(categoryIndex)
              break
            }
          }
        } else
          setActiveIndex((index) => {
            let nextIndex = index < results.length - 1 ? index + 1 : index

            // * avoid setting active index on a group
            if (typeof results[nextIndex] === 'string') {
              if (nextIndex === results.length - 1) nextIndex = index
              else nextIndex += 1
            }

            return nextIndex
          })
      } else if (event.key === 'Enter') {
        event.preventDefault()
        const item = results[activeIndex]
        execute(item, event.metaKey)
      } else if (event.key === 'Backspace' && activeItem && input === '') {
        resetSpotlitState()
      }
    }

    if (previewMode) {
      // Not adding event listener to window as the event never reaches there
      document.getElementById('mexit')!.addEventListener('keydown', handler)
    }

    return () => {
      document.getElementById('mexit')!.removeEventListener('keydown', handler)
    }
  }, [results, previewMode, activeIndex, activeItem, input])

  useEffect(() => {
    setActiveIndex(0)
  }, [results])

  function handleClick(id: number) {
    const item = results[id]
    execute(item)
  }

  return (
    <StyledResults style={springProps}>
      <List ref={parentRef}>
        <div style={{ height: rowVirtualizer.totalSize }}>
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const item = results[virtualRow.index]
            const lastItem = virtualRow.index > 0 ? results[virtualRow.index - 1] : undefined
            const handlers = {
              onPointerMove: () => pointerMoved && setActiveIndex(virtualRow.index),
              onClick: () => handleClick(virtualRow.index)
            }

            const active = virtualRow.index === activeIndex

            return (
              <ListItem key={virtualRow.index} ref={virtualRow.measureRef} start={virtualRow.start} {...handlers}>
                {item.category !== lastItem?.category && (
                  <Subtitle key={item.category}>
                    <span>{item.category}</span>
                    {item.category === QuickLinkType.search && (
                      <>
                        <span>&emsp;"</span>
                        <PrimaryText className="query">{input}</PrimaryText>
                        <span>"&emsp;with</span>
                      </>
                    )}
                  </Subtitle>
                )}
                <Action action={item} active={active} />
              </ListItem>
            )
          })}
        </div>
      </List>

      {activeItem?.type === ActionType.RENDER && <Renderer />}
      {activeItem?.type === ActionType.SCREENSHOT && <Screenshot />}
    </StyledResults>
  )
}

export default Results
