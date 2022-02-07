import fuzzysort from 'fuzzysort'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ActionType, MexitAction } from '../Types/Actions'
import { defaultActions, initActions, searchBrowserAction } from '../Utils/actions'
import Renderer from './Renderer'
import Results from './Results'

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Input = styled.input`
  background: transparent;
  flex-grow: 1;
  font-size: 1.25rem;

  border: none;
  outline: none;
  padding: 1rem;

  color: rgb(28, 28, 29);

  caret-color: #6968d2;
`

const QuerySearch = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;

  font-size: 1.25rem;
  color: #6968d2;
`

function Search() {
  const [query, setQuery] = useState('')
  const [actions, setActions] = useState<MexitAction[]>([])
  const [selectedAction, setSelectedAction] = useState<MexitAction>()

  useEffect(() => {
    if (query !== '') {
      const res = fuzzysort.go(query, initActions, { key: 'title' }).map((item) => item.obj)
      if (res.length === 0) setActions([searchBrowserAction(query)])
      else setActions(res)
    } else {
      setActions(defaultActions)
    }
  }, [query])

  return (
    <>
      {/* TODO: it would be good to have the ability to go back after selected a search type action */}
      <InputContainer>
        {selectedAction?.type === ActionType.SEARCH && <QuerySearch>{selectedAction.title} | </QuerySearch>}
        <Input
          autoFocus
          autoComplete="off"
          spellCheck="false"
          value={query}
          placeholder="Type a command or search"
          onChange={(event) => {
            setQuery(event.target.value)
          }}
        />
      </InputContainer>
      {/* TODO: add a provider and move this from here */}
      <Results
        query={query}
        setQuery={setQuery}
        actions={actions}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
      />
      {selectedAction?.type === ActionType.RENDER && (
        <Renderer componentName={selectedAction.data.componentName} componentProps={selectedAction.data.props} />
      )}
    </>
  )
}

export default Search
