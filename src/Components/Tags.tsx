import React, { useState } from 'react'
import { nanoid } from 'nanoid'

import { useTagStore } from '../Hooks/useTags'
import { Tag } from '../Types/Tags'

interface TagsProps {
  userTags: Tag[]
  addNewTag: (s: Tag) => void
  removeTag: (s: Tag) => void
}

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
    <>
      <div className="container">
        {userTags.map((tag) => (
          <div key={tag.id} className="tag">
            {tag.text}
            <button onClick={() => removeTag(tag)}>x</button>
          </div>
        ))}
        <input value={input} placeholder="Enter a Tag" onKeyDown={onKeyDown} onKeyUp={onKeyUp} onChange={onChange} />
      </div>
    </>
  )
}

export default Tags
