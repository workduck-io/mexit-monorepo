import { useLayoutEffect, useRef, useState } from 'react'

import { useTheme } from 'styled-components'

import { IconButton } from '@workduck-io/mex-components'

import { et, generateTag, getMIcon, mog, Tag, useDataStore } from '@mexit/core'
import { AddTagMenu, Group, TagsLabel } from '@mexit/shared'

import { Section } from './SuperBlock.styled'

interface BlockTagsProps {
  name: string
  isSelected?: boolean
  isReadOnly?: boolean
  value: Record<string, any>
  onChange: (propertiesToUpdate: Record<string, any>) => void
}

const TagMenu = ({ onCreate, onAdd }) => {
  const allTags = useDataStore((store) => store.tags)

  return <AddTagMenu key={allTags?.length} createTag={onCreate} tags={allTags} addTag={onAdd} />
}

const BlockTags = ({ name, value, isSelected, onChange, isReadOnly }: BlockTagsProps) => {
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
    mog('addTagFilter', { tag })
  }

  return (
    <Group contentEditable={false}>
      {tags.length > 0 && (
        <TagsLabel
          tags={tags}
          onClick={addTagFilter}
          onDelete={isReadOnly ? undefined : (val: string) => onRemoveTag(val)}
        />
      )}
      {isSelected && !isReadOnly && <TagMenu onCreate={onAddNewTag} onAdd={onAddNewTag} />}
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

const SuperBlockFooter = ({ isSelected, value, onChange, isReadOnly, FooterRightRenderer }) => {
  const theme = useTheme()
  const [show, setShow] = useState(false)
  const targetRef = useRef(null)
  const [dimensions, setDimensions] = useState({} as any)

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      })
    }
  }, [])

  return (
    <>
      {show && <RenderData value={value} />}
      <Section margin={`${theme.spacing.medium} 0 0`} contentEditable={false} ref={targetRef} $width={dimensions.width}>
        {false && (
          <IconButton title="Log" onClick={() => setShow((s) => !s)} icon={getMIcon('ICON', 'mdi:math-log').value} />
        )}
        <BlockTags isReadOnly={isReadOnly} isSelected={isSelected} name="tags" value={value} onChange={onChange} />
        {FooterRightRenderer && <FooterRightRenderer isReadOnly={isReadOnly} value={value} onChange={onChange} />}
      </Section>
    </>
  )
}

export default SuperBlockFooter
