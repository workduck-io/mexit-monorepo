import { useState } from 'react'

import { useTheme } from 'styled-components'

import { IconButton } from '@workduck-io/mex-components'

import { et, generateTag, getMIcon, Tag, useDataStore } from '@mexit/core'
import { AddTagMenu, Group, TagsLabel } from '@mexit/shared'

import { Section } from './SuperBlock.styled'

interface BlockTagsProps {
  name: string
  isSelected?: boolean
  value: Record<string, any>
  onChange: (propertiesToUpdate: Record<string, any>) => void
}

const TagMenu = ({ onCreate, onAdd }) => {
  const allTags = useDataStore((store) => store.tags)

  return <AddTagMenu key={allTags?.length} createTag={onCreate} tags={allTags} addTag={onAdd} />
}

const BlockTags = ({ name, value, isSelected, onChange }: BlockTagsProps) => {
  const addTag = useDataStore((s) => s.addTag)

  const tags = value?.[name] ?? []

  const onAddNewTag = (tag: Tag | string) => {
    const newTag = typeof tag === 'string' ? generateTag(tag) : tag

    if (tags.find((t) => t.value === newTag.value)) {
      return
    }

    et('Add Tag in Editor', () => {
      onChange({
        tags: [...tags, newTag]
      })
    })

    et('Add Tag in DataStore', () => {
      addTag(newTag.value)
    })
  }

  const onRemoveTag = (tag: string) => {
    const reminaingTags = tags.filter((t) => t.value !== tag)

    onChange({
      tags: reminaingTags
    })
  }

  const addTagFilter = (tag: string) => {
    console.log('addTagFilter', tag)
  }

  return (
    <Group contentEditable={false}>
      {tags.length > 0 && <TagsLabel tags={tags} onClick={addTagFilter} onDelete={(val: string) => onRemoveTag(val)} />}
      {isSelected && <TagMenu onCreate={onAddNewTag} onAdd={onAddNewTag} />}
    </Group>
  )
}

const RenderData = ({ value }) => {
  return (
    <pre style={{ padding: '1rem' }} contentEditable={false}>
      {JSON.stringify(value, null, 4)}
    </pre>
  )
}

const SuperBlockFooter = ({ isSelected, value, onChange, FooterRightRenderer }) => {
  const theme = useTheme()
  const [show, setShow] = useState(false)

  return (
    <>
      {show && <RenderData value={value} />}
      <Section margin={`${theme.spacing.large} 0 0`} contentEditable={false}>
        {false && (
          <IconButton title="Log" onClick={() => setShow((s) => !s)} icon={getMIcon('ICON', 'mdi:math-log').value} />
        )}
        <BlockTags isSelected={isSelected} name="tags" value={value} onChange={onChange} />
        {FooterRightRenderer && <FooterRightRenderer value={value} onChange={onChange} />}
      </Section>
    </>
  )
}

export default SuperBlockFooter
