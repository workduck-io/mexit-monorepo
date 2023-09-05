import React, { useEffect, useMemo, useState } from 'react'

import { useDebounce } from 'use-debounce'

import { getElementById, getMenuItem, MIcon, superBlockFieldValidator, SuperBlocks } from '@mexit/core'

import { useFocusBlock } from '../../Hooks/useFocusBlock'
import { FadeText } from '../../Style/fade'
import { Group } from '../../Style/Layouts'
import { EntitiesInfo } from '../../Types/SearchEntities'
import { changeSuperBlockType } from '../../Utils/superblocks'
import { Tooltip } from '../FloatingElements'
import { IconDisplay } from '../IconDisplay'
import { Select } from '../Select'
import { Source } from '../SourceInfo'

import { RenameInput } from './SuperBlock.styled'
import { PropertiyFields } from './SuperBlock.types'

interface SuperBlockTitleInfoProps {
  id?: string
  parent?: string
  name?: string
  type: SuperBlocks
  heading: string
  value: PropertiyFields
  isReadOnly?: boolean
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

    if (e.key === 'Enter') {
      if (props.onEnter) props.onEnter()
    }
  }

  return (
    <Tooltip content={defferedValue?.length ? defferedValue : 'Untitled'}>
      <RenameInput
        disabled={props.isReadOnly}
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

const BlockTitleInfo = ({ title, type, value, isReadOnly, onFocusBlock, onChange, onSwitchType }) => {
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
      <Select
        root={getElementById('ext-side-nav')}
        items={convertableItems}
        isReadOnly={isReadOnly}
        defaultValue={EntitiesInfo[type] as any}
      />
      <span>|</span>
      <BlockTitleRename key={title} isReadOnly={isReadOnly} onChange={onChange} onEnter={onFocusBlock} title={title} />
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
  isReadOnly,
  onChange
}) => {
  const title = value?.[name]

  const blockSourceUrl = superBlockFieldValidator(type, 'url') ? value['url'] : undefined

  const { focusBlock } = useFocusBlock()

  const handleOnTypeSwitch = (type: SuperBlocks) => {
    changeSuperBlockType(parent, id, type)
  }

  const handleFocusBlock = () => {
    focusBlock(id, parent)
  }

  return (
    <Group>
      {blockSourceUrl ? (
        <Source key={blockSourceUrl} source={blockSourceUrl} />
      ) : (
        <FadeText>
          <IconDisplay icon={icon} size={14} />
        </FadeText>
      )}
      <FadeText>
        <BlockTitleInfo
          isReadOnly={isReadOnly}
          onFocusBlock={handleFocusBlock}
          onSwitchType={handleOnTypeSwitch}
          title={title}
          value={value}
          type={type}
          onChange={onChange}
        />
      </FadeText>
    </Group>
  )
}

export default SuperBlockTitle
