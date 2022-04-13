import styled from 'styled-components'
import { UseFormRegister } from 'react-hook-form'
import { ShortenFormDetails } from './AliasWrapper'
import { InputRow, Label, Input, Tag } from '@mexit/shared'
import { Tags } from './Tags'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const Shortener = ({
  currTabURL,
  setCurrTabURL,
  shortAlias,
  setShortAlias,
  register,
  userTags,
  setUserTags
}: {
  currTabURL: string
  setCurrTabURL: (s: string) => void
  shortAlias: string
  setShortAlias: (s: string) => void
  register: UseFormRegister<ShortenFormDetails>
  userTags: Tag[]
  setUserTags: (s: Tag[]) => void
}) => {
  const removeUserTag = (tag: Tag) => {
    const updatedUserTags = userTags.filter((userTag) => tag.id !== userTag.id)
    setUserTags(updatedUserTags)
  }
  return (
    <Container>
      <InputRow>
        <Label>Destination URL</Label>
        <Input placeholder="URL to shorten" defaultValue={currTabURL} onChange={(e) => setCurrTabURL(e.target.value)} />
      </InputRow>
      <InputRow>
        <Tags
          userTags={userTags}
          addNewTag={(t) => setUserTags([...userTags, t])}
          removeTag={(t) => removeUserTag(t)}
        />
      </InputRow>

      <InputRow>
        <Label>Shortcut</Label>
        <Input placeholder="Shorcut" {...register('short')} value={shortAlias} />
      </InputRow>
    </Container>
  )
}
