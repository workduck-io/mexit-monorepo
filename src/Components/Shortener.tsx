import React, { useState } from 'react'
import { Tag } from '../Types/Tags'
import styled from 'styled-components'
import { UseFormRegister } from 'react-hook-form'
import { ShortenFormDetails } from './AliasWrapper'
import { InputRow, Label, Input } from '../Styles/Form'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Shortener = ({
  currTabURL,
  setCurrTabURL,
  register
}: {
  currTabURL: string
  setCurrTabURL: (s: string) => void
  register: UseFormRegister<ShortenFormDetails>
}) => {
  return (
    <Container>
      <InputRow>
        <Label>Destination URL</Label>
        <Input placeholder="URL to shorten" defaultValue={currTabURL} onChange={(e) => setCurrTabURL(e.target.value)} />
      </InputRow>

      <InputRow>
        <Label>Shortcut</Label>
        <Input placeholder="Shorcut" {...register('short')} />
      </InputRow>
    </Container>
  )
}

export default Shortener
