import { ActionType, QuickLinkType } from '@mexit/core'
import { PrimaryText } from '@mexit/shared'
import { findIndex, groupBy } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
import { useVirtual } from 'react-virtual'

import { useActionExecutor } from '../../Hooks/useActionExecutor'
import { useEditorStore } from '../../Hooks/useEditorStore'
import usePointerMovedSinceMount from '../../Hooks/usePointerMovedSinceMount'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import Action from '../Action'
import { List, ListItem, Subtitle } from './styled'

const ResultList = ({ results }: { results: Array<any> }) => {
  const parentRef = useRef(null)
  const pointerMoved = usePointerMovedSinceMount()

  const { execute } = useActionExecutor()
  const input = useSputlitStore((s) => s.input)
  const activeItem = useSputlitStore((s) => s.activeItem)

  const { activeIndex, setActiveIndex } = useSputlitContext()

  const rowVirtualizer = useVirtual({
    size: results.length,
    parentRef
  })

  const resetSpotlitState = useSputlitStore((store) => store.reset)

  const groups = Object.keys(groupBy(results, (n) => n.category))
  const { previewMode } = useEditorStore()

  const indexes = useMemo(() => groups.map((gn) => findIndex(results, (n) => n.category === gn)), [groups])

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
      } else if (
        event.key === 'Backspace' &&
        activeItem &&
        activeItem?.type !== ActionType.SCREENSHOT &&
        input === ''
      ) {
        resetSpotlitState()
      }
    }

    if (previewMode) {
      // Not adding event listener to window as the event never reaches there
      document.getElementById('mexit')?.addEventListener('keydown', handler)
    }

    return () => {
      document.getElementById('mexit')?.removeEventListener('keydown', handler)
    }
  }, [results, previewMode, activeIndex, activeItem, input])

  // destructuring here to prevent linter warning to pass
  // entire rowVirtualizer in the dependencies array.
  const { scrollToIndex } = rowVirtualizer
  React.useEffect(() => {
    scrollToIndex(activeIndex, {
      // To ensure that we don't move past the first item
      align: activeIndex < 1 ? 'start' : 'auto'
    })
  }, [activeIndex, scrollToIndex])

  useEffect(() => {
    setActiveIndex(0)
  }, [results])

  function handleClick(id: number) {
    const item = results[id]
    execute(item)
  }

  return (
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
  )
}

export default ResultList
