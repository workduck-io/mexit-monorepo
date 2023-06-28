import { useSelected } from 'slate-react'
import { useTheme } from 'styled-components'

import { et, generateTag, Tag, useDataStore } from '@mexit/core'
import { AddTagMenu, Group, TagsLabel } from '@mexit/shared'

import { Section } from './SuperBlock.styled'

interface BlockTagsProps {
  name: string
  value: Record<string, any>
  onChange: (propertiesToUpdate: Record<string, any>) => void
}

const TagMenu = ({ onCreate, onAdd }) => {
  const allTags = useDataStore((store) => store.tags)

  return <AddTagMenu createTag={onCreate} tags={allTags} addTag={onAdd} />
}

const BlockTags = ({ name, value, onChange }: BlockTagsProps) => {
  const allowAdd = useSelected()

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
      {allowAdd && <TagMenu onCreate={onAddNewTag} onAdd={onAddNewTag} />}
    </Group>
  )
}

const SuperBlockFooter = ({ value, onChange, FooterRightRenderer }) => {
  const theme = useTheme()

  return (
    <>
      <Section margin={`${theme.spacing.large} 0 0`} contentEditable={false}>
        <BlockTags name="tags" value={value} onChange={onChange} />
        {FooterRightRenderer && <FooterRightRenderer value={value} onChange={onChange} />}
      </Section>
    </>
  )
}

export default SuperBlockFooter
