import { nanoid } from 'nanoid'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Input, InputRow, Label } from '@mexit/shared'
import { Tag } from '@mexit/core'

interface TagsProps {
  userTags: Tag[]
  addNewTag: (s: Tag) => void
  removeTag: (s: Tag) => void
}

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Tagg = styled.div`
  padding: 0.5rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
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

export const Tags: React.FC<TagsProps> = ({ userTags, addNewTag, removeTag }: TagsProps) => {
  const [input, setInput] = useState('')
  const [isKeyReleased, setIsKeyReleased] = useState(false)

  const onKeyDown = (e) => {
    const { key } = e
    const trimmedInput = input.trim()
    const tagTexts = new Array<string>()
    userTags.forEach((tag) => tagTexts.push(tag.text))

    if (key === 'Enter' && trimmedInput.length && !tagTexts.includes(trimmedInput)) {
      e.preventDefault()
      const t: Tag = {
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
    <div>
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
    </div>
  )
}
