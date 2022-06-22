import { nanoid } from 'nanoid'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Input, Label } from '@mexit/shared'
import { Tag } from '@mexit/core'

interface TagsProps {
  userTags: Tag[]
  addNewTag: (s: Tag) => void
  removeTag: (s: Tag) => void
}

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.75rem 0;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Tagg = styled.div`
  padding: 0.5rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
  background: ${({ theme }) => theme.colors.gray[8]};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 5px;

  button {
    cursor: pointer;
    margin: 0 0 0 0.5rem;
    background: none;

    &:hover {
      color: ${({ theme }) => theme.colors.form.button.hover};
    }
  }
`

export const Tags: React.FC<TagsProps> = ({ userTags, addNewTag, removeTag }: TagsProps) => {
  const [input, setInput] = useState('')
  const [isKeyReleased, setIsKeyReleased] = useState(false)

  const onKeyDown = (e) => {
    const { key } = e
    const trimmedInput = input.trim()
    const tagTexts = new Array<string>()
    userTags.forEach((tag) => tagTexts.push(tag.value))

    if (key === 'Enter' && trimmedInput.length && !tagTexts.includes(trimmedInput)) {
      e.preventDefault()
      const t: Tag = {
        value: trimmedInput
      }
      addNewTag(t)
      setInput('')
    }

    if (key === 'Backspace' && !input.length && userTags.length && isKeyReleased) {
      const tagsCopy = [...userTags]
      const poppedTag = tagsCopy.pop()
      e.preventDefault()
      removeTag(poppedTag)
      setInput(poppedTag.value)
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
    <div>
      <InputRow>
        <Label>Add Tags</Label>
        <Input value={input} placeholder="Enter a Tag" onKeyDown={onKeyDown} onKeyUp={onKeyUp} onChange={onChange} />
      </InputRow>

      {/* TODO: recommend and show recent used tags */}
      <TagsContainer>
        {userTags.map((tag) => (
          <Tagg key={tag.value} className="tag">
            {tag.value}
            <button onClick={() => removeTag(tag)}>x</button>
          </Tagg>
        ))}
      </TagsContainer>
    </div>
  )
}
