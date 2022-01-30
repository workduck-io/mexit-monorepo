import React, { useState } from 'react'
import { Tag } from '../Types/Tags'
import styled from 'styled-components'
import { UseFormRegister } from 'react-hook-form'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

//TDOO: Add these components in separate files and import from there
const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.75rem 0;
`
const Label = styled.label`
  font-family: 1rem;
  font-weight: 500;
  color: #374151;
`

const Input = styled.input`
  width: 80%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: #6968d2;
  }
`
interface ShortenFormDetails {
  short: string
}

const Shortener = ({ currTabURL, register }: { currTabURL: string; register: UseFormRegister<ShortenFormDetails> }) => {
  return (
    <Container>
      <InputRow>
        <Label>Destination URL</Label>
        <Input placeholder="URL to shorten" defaultValue={currTabURL} />
      </InputRow>

      <InputRow>
        <Label>Shortcut</Label>
        <Input placeholder="Shorcut" {...register('short')} />
      </InputRow>
    </Container>
  )
}

export default Shortener
