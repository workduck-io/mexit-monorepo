import React, { useEffect, useRef, useState } from 'react'
import usePointerMovedSinceMount from '../Hooks/usePointerMovedSinceMount'
import styled, { css } from 'styled-components'
import { ActionType, MexitAction } from '../Types/Actions'
import { actionExec } from '../Utils/actionExec'
import { useVirtual } from 'react-virtual'
import Action from './Action'
import { ReactEditor } from 'slate-react'

const List = styled.div<{ height: number }>`
  width: 100%;
  overflow: auto;
  position: relative;
  scroll-behavior: smooth;

  height: ${(props) => props.height}px;
  max-height: 400px;
`

const ListItem = styled.div<{ start: number }>`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(${(props) => props.start}px);
  width: 100%;

  &:hover {
    cursor: pointer;
  }
`

const Subtitle = styled.div`
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  opacity: 0.5;
`

function Results({
  query,
  setQuery,
  actions,
  selectedAction,
  setSelectedAction
}: {
  query: string
  setQuery: (query: string) => void
  actions: MexitAction[]
  selectedAction: MexitAction
  setSelectedAction: (action: MexitAction) => void
}) {
  const parentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [first, setFirst] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const pointerMoved = usePointerMovedSinceMount()

  const rowVirtualizer = useVirtual({
    size: actions.length,
    parentRef
  })

  // destructuring here to prevent linter warning to pass
  // entire rowVirtualizer in the dependencies array.
  const { scrollToIndex } = rowVirtualizer
  React.useEffect(() => {
    scrollToIndex(activeIndex, {
      // ensure that if the first item in the list is a group
      // name and we are focused on the second item, to not
      // scroll past that group, hiding it.
      align: activeIndex <= 1 ? 'end' : 'auto'
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
          if (typeof actions[nextIndex] === 'string') {
            if (nextIndex === 0) return index
            nextIndex -= 1
          }
          return nextIndex
        })
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => {
          let nextIndex = index < actions.length - 1 ? index + 1 : index

          // avoid setting active index on a group
          if (typeof actions[nextIndex] === 'string') {
            if (nextIndex === actions.length - 1) return index
            nextIndex += 1
          }
          return nextIndex
        })
        // TODO: improve the code below for the love of anything
      } else if (
        event.key === 'Enter' &&
        actions[activeIndex]?.type !== ActionType.search &&
        selectedAction?.type !== ActionType.search
      ) {
        event.preventDefault()
        setSelectedAction(actions[activeIndex])
        actionExec(actions[activeIndex])
        if (actions[activeIndex].type === ActionType.render) {
          setShowResults(false)
        }
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (!first) {
          setSelectedAction(actions[activeIndex])
          setFirst(true)
          setQuery('')
          setShowResults(false)
        } else {
          actionExec(selectedAction, query)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [actions, activeIndex, selectedAction])

  useEffect(() => {
    setActiveIndex(0)
  }, [actions])

  function handleClick(id: number) {
    if (actions[id]?.type !== ActionType.search && selectedAction?.type !== ActionType.search) {
      setSelectedAction(actions[id])
      actionExec(actions[id])
      if (actions[id].type === ActionType.render) {
        setShowResults(false)
      }
    } else {
      if (!first) {
        setSelectedAction(actions[id])
        setFirst(true)
        setQuery('')
        setShowResults(false)
      } else {
        actionExec(selectedAction, query)
      }
    }
  }

  return (
    <>
      {showResults && (
        <>
          <Subtitle>Navigation</Subtitle>
          <List ref={parentRef} height={rowVirtualizer.totalSize}>
            {rowVirtualizer.virtualItems.map((virtualRow) => {
              const item = actions[virtualRow.index]
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
          </List>
        </>
      )}
    </>
  )
}

export default Results
