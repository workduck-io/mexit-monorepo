import React from 'react'
import { Action } from '../Types/Sputlit'
import styled from 'styled-components'

const Input = styled.input`
  background: transparent;
  font-size: 1.25rem;
  width: 92%;

  border: none;
  outline: none;
  padding: 1rem;

  color: rgb(28, 28, 29);

  caret-color: #6968d2;
`

const List = styled.div`
  width: 100%;
  overflow: overlay;

  max-height: 400px;
`

const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 60px;
  width: 100%;
  padding: 0 0 0 1rem;
  color: #111;
  border-left: 2px solid transparent;

  h3 {
    font-size: 1.1rem;
    font-weight: 400;
    margin: 0;
  }

  p {
    font-size: 0.85rem;
    margin: 0.25rem 0 0.5rem 0;
  }

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.05);
    border-left: 2px solid rgb(28, 28, 29);
  }
`

const Subtitle = styled.div`
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  opacity: 0.5;
`

function Search() {
  const actions: Action[] = [
    {
      title: 'Reload',
      description: 'Reload this tab',
      showDesc: false,
      action: 'reload'
    },
    {
      title: 'About Us',
      description: 'Know more about Workduck.io',
      showDesc: true,
      action: 'workduck'
    }
  ]

  return (
    <>
      {/* TODO: No search functionality at the moment */}
      <Input placeholder="Type a command or search" />

      <Subtitle>Navigation</Subtitle>
      <List>
        {actions.map((item, id) => (
          <ListItem key={id}>
            <h3> {item.title}</h3>
            {item.showDesc && <p>{item.description}</p>}
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Search
