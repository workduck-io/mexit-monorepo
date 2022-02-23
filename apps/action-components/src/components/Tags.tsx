import { nanoid } from 'nanoid'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Tag } from '@mexit/shared'

interface TagsProps {
  userTags: Tag[]
  addNewTag: (s: Tag) => void
  removeTag: (s: Tag) => void
}

const Container = styled.div`
  margin: 1rem 0;
`

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

const TagsContainer = styled.div`
  display: flex;
`

const Tagg = styled.div`
  padding: 0.5rem;
  margin: 0 0.5rem 0 0;
  background: #e8e8e8;
  border-radius: 5px;

  button {
    cursor: pointer;
    margin: 0 0 0 0.5rem;
    color: #bcbec4;

    &:hover {
      color: #3e3e41;
    }
  }
`

const Tags: React.FC<TagsProps> = ({ userTags, addNewTag, removeTag }: TagsProps) => {
  const [input, setInput] = useState('')
  const [isKeyReleased, setIsKeyReleased] = useState(false)

  const onKeyDown = (e) => {
    const { key } = e
    const trimmedInput = input.trim()
    const tagTexts = new Array<string>()
    userTags.forEach((tag) => tagTexts.push(tag.text))

    if (key === 'Enter' && trimmedInput.length && !tagTexts.includes(trimmedInput)) {
      e.preventDefault()
      const t = {
        id: `TAG_${nanoid()}`,
        text: trimmedInput
      }
      addNewTag(t)
      setInput('')
    }

    if (key === 'Backspace' && !input.length && userTags.length && isKeyReleased) {
      const tagsCopy = [...userTags]
      const poppedTag = tagsCopy.pop()
      e.preventDefault()
      removeTag(poppedTag)
      setInput(poppedTag.text)
    }

    setIsKeyReleased(false)
  }

  const onKeyUp = () => {
    setIsKeyReleased(true)
  }

  const onChange = (e) => {
    const { value } = e.target
    setInput(value)
  }

  return (
    <Container>
      <InputRow>
        <Label>Add Tags</Label>
        <Input value={input} placeholder="Enter a Tag" onKeyDown={onKeyDown} onKeyUp={onKeyUp} onChange={onChange} />
      </InputRow>

      {/* TODO: recommend and show recent used tags */}
      <TagsContainer>
        {userTags.map((tag) => (
          <Tagg key={tag.id} className="tag">
            {tag.text}
            <button onClick={() => removeTag(tag)}>x</button>
          </Tagg>
        ))}
      </TagsContainer>
    </Container>
  )
}

export default Tags
