import styled from 'styled-components'

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.75em 0;
`
export const Label = styled.label`
  font-family: 1em;
  font-weight: 500;
  color: #374151;
`

export const Input = styled.input`
  width: 80%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: #6968d2;
  }
`
