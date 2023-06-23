import { useMemo } from 'react'

import { getPlateEditorRef, removeBlocksAndFocus } from '@udecode/plate'
import { useFocused, useSelected } from 'slate-react'
import { useTheme } from 'styled-components'

import { IconButton } from '@workduck-io/mex-components'

import {
  et,
  generateTag,
  getMenuItem,
  PriorityDataType,
  PriorityType,
  Tag,
  useDataStore,
  useUserCacheStore
} from '@mexit/core'
import { AddTagMenu, DefaultMIcons, Group, InsertMenu, TagsLabel } from '@mexit/shared'

import PrioritySelect from '../../../Components/Todo/PrioritySelect'
import useUpdateBlock from '../../Hooks/useUpdateBlock'

import { Section } from './SuperBlock.styled'
import { MetadataFields } from './SuperBlock.types'

interface BlockTagsProps {
  name: string
  metadata: MetadataFields
}

const TagMenu = ({ onCreate, onAdd }) => {
  const allTags = useDataStore((store) => store.tags)

  return <AddTagMenu createTag={onCreate} tags={allTags} addTag={onAdd} />
}

const BlockTags = ({ name, metadata }: BlockTagsProps) => {
  const allowAdd = useSelected()

  const { updateMetadataProperties } = useUpdateBlock()
  const addTag = useDataStore((s) => s.addTag)

  const tags = metadata?.[name] ?? []

  const onAddNewTag = (tag: Tag | string) => {
    const newTag = typeof tag === 'string' ? generateTag(tag) : tag

    if (tags.find((t) => t.value === newTag.value)) {
      return
    }

    et('Add Tag in Editor', () => {
      updateMetadataProperties({
        metadata: {
          ...metadata,
          tags: [...tags, newTag]
        }
      })
    })

    et('Add Tag in DataStore', () => {
      addTag(newTag.value)
    })
  }

  const onRemoveTag = (tag: string) => {
    const reminaingTags = tags.filter((t) => t.value !== tag)

    updateMetadataProperties(element, {
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

const TaskSuperBlockFooter = ({ element, onChange }) => {
  const usersCache = useUserCacheStore((store) => store.cache)

  const isActive = useFocused()
  const isBlockSelected = useSelected()

  const showBlockItems = isActive && isBlockSelected

  const { updateMetadataProperties } = useUpdateBlock()

  const users = useMemo(() => {
    const userList = usersCache.map((user) =>
      getMenuItem(user.name, () => undefined, false, DefaultMIcons.MENTION, undefined, user.id)
    )

    userList.unshift(getMenuItem('No Assignee', () => undefined, false, DefaultMIcons.MENTION, undefined, undefined))

    return userList
  }, [usersCache])

  const removeNode = () => {
    const editor = getPlateEditorRef()
    removeBlocksAndFocus(editor, { block: true })
  }

  const onInsert = (itemId: string) => {
    updateMetadataProperties(element, {
      assignee: itemId
    })
  }

  const onPriorityChange = (priority: Partial<PriorityDataType>) => {
    const metadata = element.metadata ?? {}

    updateMetadataProperties(element, {
      priority: priority.type
    })
  }

  return (
    <Group>
      <InsertMenu
        isMenu
        icon={DefaultMIcons.MENTION}
        selected={element?.metadata?.assignee}
        onClick={onInsert}
        title="Assignee"
        items={users}
      />

      <PrioritySelect
        onPriorityChange={onPriorityChange}
        value={element?.metadata?.priority ?? PriorityType.noPriority}
        isVisible
      />
      {showBlockItems && <IconButton title="Delete" icon={DefaultMIcons.DELETE.value} onClick={removeNode} />}
    </Group>
  )
}

const SuperBlockFooter = ({ element, onChange }) => {
  const theme = useTheme()

  return (
    <>
      <Section margin={`${theme.spacing.large} 0 0`} contentEditable={false}>
        <BlockTags name="tags" onChange={onChange} />
        <TaskSuperBlockFooter element={element} onChange={onChange} />
      </Section>
    </>
  )
}

export default SuperBlockFooter
