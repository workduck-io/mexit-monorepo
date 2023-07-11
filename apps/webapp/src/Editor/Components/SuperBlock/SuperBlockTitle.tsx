import React, { useMemo, useState } from 'react'

import { useDebouncedCallback } from 'use-debounce'

import { getMenuItem, MIcon, SuperBlocks } from '@mexit/core'
import { EntitiesInfo, Group, IconDisplay, Select } from '@mexit/shared'

import { Source } from '../../../Components/SourceInfo'
import useUpdateBlock from '../../Hooks/useUpdateBlock'

import { RenameInput } from './SuperBlock.styled'
import { PropertiyFields } from './SuperBlock.types'

interface SuperBlockTitleInfoProps {
  name?: string
  type: SuperBlocks
  heading: string
  value: PropertiyFields
  icon: MIcon
  onChange?: (properties: Partial<PropertiyFields>) => void
}

const NonConvertibles = new Set([SuperBlocks.MEDIA, SuperBlocks.CAPTURE, SuperBlocks.HIGHLIGHT])

const BlockTitleRename = (props) => {
  const [isEditable, setIsEditable] = useState(false)

  const handleOnChange = useDebouncedCallback((e: any) => {
    const title = e.target.value

    props.onChange({ title: title?.trim() ?? 'Untitled' })
  }, 500)

  const handleOnClick = () => {
    setIsEditable((s) => !s)
  }

  return (
    <RenameInput transparent name="title" defaultValue={props.title?.trim() ?? 'Untitled'} onChange={handleOnChange} />
  )
}

const BlockTitleInfo = ({ title, type, onChange }) => {
  const { changeSuperBlockType } = useUpdateBlock()

  const convertableItems = useMemo(() => {
    return Object.keys(EntitiesInfo)
      .filter((item: any) => !NonConvertibles.has(item) && item !== 'Ungrouped' && item !== type)
      .map((superBlockType) => {
        const superBlock = EntitiesInfo[superBlockType as SuperBlocks]

        return getMenuItem(superBlock.label, () => changeSuperBlockType, false, superBlock.icon)
      })
  }, [type])

  return (
    <Group>
      <Select items={convertableItems} defaultValue={EntitiesInfo[type] as any} />
      <span>|</span>
      <BlockTitleRename title={title} />
    </Group>
  )
}

const SuperBlockTitle: React.FC<SuperBlockTitleInfoProps> = ({
  icon,
  type,
  heading,
  name = 'title',
  value,
  onChange
}) => {
  const title = value?.[name]
  const blockSourceUrl = value?.url

  return (
    <Group>
      {blockSourceUrl ? <Source source={blockSourceUrl} /> : <IconDisplay icon={icon} size={14} />}
      <BlockTitleInfo title={title} type={type} onChange={onChange} />
    </Group>
  )
}

export default SuperBlockTitle
