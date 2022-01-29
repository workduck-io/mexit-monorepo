import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { ActionType, MexitAction } from '../Types/Actions'
import { actionExec } from '../Utils/actionExec'

const List = styled.div`
  width: 100%;
  overflow: overlay;

  max-height: 400px;
`

const ListItem = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  height: 60px;
  padding: 0 0 0 1rem;
  color: #111;
  border-left: 2px solid transparent;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.05);
    border-left: 2px solid rgb(28, 28, 29);
  }

  ${(props) =>
    props.active &&
    css`
       {
        background-color: rgba(0, 0, 0, 0.05);
        border-left: 2px solid rgb(28, 28, 29);
      }
    `}
`

const Action = styled.div`
  display: flex;
  flex-direction: row;
`

const ActionIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;

  img {
    height: 40px;
    aspect-ratio: 1/1;
  }
`

const ActionDesc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-size: 1.1rem;
    font-weight: 400;
    margin: 0;
  }

  p {
    font-size: 0.85rem;
    margin: 0.25rem 0 0.5rem 0;
  }
`
const Subtitle = styled.div`
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  opacity: 0.5;
`

const Shortcut = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
`

const Key = styled.span`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 0.25rem;
  padding: 0.25rem;
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
  const [activeIndex, setActiveIndex] = useState(0)
  const [first, setFirst] = useState(false)

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
        actionExec(actions[activeIndex])
      } else if (event.key === 'Enter') {
        event.preventDefault()
        console.log(selectedAction, actions[activeIndex])
        if (!first) {
          setSelectedAction(actions[activeIndex])
          setFirst(true)
          setQuery('')
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

  return (
    // Better to use something like react-virtual to make scrolling and rendering a big list of actions better
    <>
      <Subtitle>Navigation</Subtitle>
      {selectedAction?.type !== ActionType.search && (
        <List>
          {actions.map((item, id) => (
            <ListItem key={id} active={activeIndex === id} onClick={() => actionExec(item)}>
              <Action>
                <ActionIcon>
                  {item.data.icon && <img src={chrome.runtime.getURL(`/Assets/${item.data.icon}`)} />}
                </ActionIcon>
                <ActionDesc>
                  <h3> {item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </ActionDesc>
              </Action>
              <Shortcut>
                {item.shortcut && item.shortcut.map((shortcutKey, id) => <Key key={id}>{shortcutKey}</Key>)}
              </Shortcut>
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}

export default Results
