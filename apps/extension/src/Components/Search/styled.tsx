import styled from 'styled-components'

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const Input = styled.input`
  background: transparent;
  flex-grow: 1;
  font-size: 1.25rem;

  border: none;
  outline: none;
  padding: 1rem;

  color: rgb(28, 28, 29);

  caret-color: #6968d2;
`

export const QuerySearch = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;

  font-size: 1.25rem;
  color: #6968d2;
`
