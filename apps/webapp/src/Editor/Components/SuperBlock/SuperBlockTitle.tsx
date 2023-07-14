import React, { useEffect, useMemo, useState } from 'react'

import { useDebounce } from 'use-debounce'

import { getMenuItem, MIcon, SuperBlocks } from '@mexit/core'
import { EntitiesInfo, Group, IconDisplay, Select, Tooltip } from '@mexit/shared'

import { Source } from '../../../Components/SourceInfo'
import { useFocusBlock } from '../../../Stores/useFocusBlock'
import { KEYBOARD_KEYS } from '../../constants'
import useUpdateBlock from '../../Hooks/useUpdateBlock'

import { RenameInput } from './SuperBlock.styled'
import { PropertiyFields } from './SuperBlock.types'

interface SuperBlockTitleInfoProps {
  id?: string
  parent?: string
  name?: string
  type: SuperBlocks
  heading: string
  value: PropertiyFields
  icon: MIcon
  onChange?: (properties: Partial<PropertiyFields>) => void
}

const NonConvertibles = new Set([SuperBlocks.MEDIA, SuperBlocks.CAPTURE, SuperBlocks.HIGHLIGHT])

export const BlockTitleRename = (props) => {
  const [title, setTitle] = useState(props.title ?? 'Untitled')

  const [defferedValue] = useDebounce(title, 800)

  useEffect(() => {
    if (defferedValue !== props.title) {
      props.onChange({ title: defferedValue })
    }
  }, [defferedValue])

  const handleOnChange = (e: any) => {
    const val = e.target.value

    setTitle(val)
  }

  const handleKeyDown = (e) => {
    e.stopPropagation()

    if (e.key === KEYBOARD_KEYS.Enter) {
      if (props.onEnter) props.onEnter()
    }
  }

  return (
    <Tooltip content={defferedValue?.length ? defferedValue : 'Untitled'}>
      <RenameInput
        name="title"
        length={defferedValue !== title ? title.length + 4 : title.length - 2}
        defaultValue={title}
        onKeyDown={handleKeyDown}
        onChange={handleOnChange}
        placeholder="What's this about?"
      />
    </Tooltip>
  )
}

const BlockTitleInfo = ({ title, type, value, onFocusBlock, onChange, onSwitchType }) => {
  const convertableItems = useMemo(() => {
    return Object.keys(EntitiesInfo)
      .filter(
        (item: any) =>
          (Object.keys(value?.entity?.values ?? {}).includes(item) ||
            (!NonConvertibles.has(item) && item !== 'Ungrouped')) &&
          item !== type
      )
      .map((superBlockType: SuperBlocks) => {
        const superBlock = EntitiesInfo[superBlockType]

        return getMenuItem(superBlock.label, () => onSwitchType(superBlockType), false, superBlock.icon)
      })
  }, [type])

  return (
    <Group>
      <Select items={convertableItems} defaultValue={EntitiesInfo[type] as any} />
      <span>|</span>
      <BlockTitleRename onChange={onChange} onEnter={onFocusBlock} title={title} />
    </Group>
  )
}

const SuperBlockTitle: React.FC<SuperBlockTitleInfoProps> = ({
  id,
  parent,
  icon,
  type,
  name = 'title',
  value,
  onChange
}) => {
  const title = value?.[name]
  const blockSourceUrl = value?.url

  const { changeSuperBlockType } = useUpdateBlock()
  const { focusBlock } = useFocusBlock()

  const handleOnTypeSwitch = (type: SuperBlocks) => {
    changeSuperBlockType(parent, id, type)
  }

  const handleFocusBlock = () => {
    focusBlock(id, parent)
  }

  return (
    <Group>
      {blockSourceUrl ? <Source source={blockSourceUrl} /> : <IconDisplay icon={icon} size={14} />}
      <BlockTitleInfo
        onFocusBlock={handleFocusBlock}
        onSwitchType={handleOnTypeSwitch}
        title={title}
        value={value}
        type={type}
        onChange={onChange}
      />
    </Group>
  )
}

export default SuperBlockTitle
