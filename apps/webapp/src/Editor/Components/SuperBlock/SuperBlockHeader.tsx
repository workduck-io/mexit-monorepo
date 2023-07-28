import { useMemo } from 'react'

import { useTheme } from 'styled-components'

import { FadeText, Group, RelativeTime } from '@mexit/shared'

import { BlockInfo } from '../../../Components/Editor/BlockInfo/BlockInfo.index'
import { isReadonly, usePermissions } from '../../../Hooks/usePermissions'

import { Dot, Section } from './SuperBlock.styled'
import { MetadataFields, PropertiyFields } from './SuperBlock.types'

interface ISuperBlockHeaderProps {
  id: string
  parent: string

  isSelected?: boolean
  isFocused?: boolean
  isReadOnly?: boolean

  value?: PropertiyFields
  metadata: MetadataFields

  onDelete?: () => void

  LeftHeaderRenderer: any
}

const SuperBlockHeader: React.FC<ISuperBlockHeaderProps> = (props) => {
  const { value, metadata, isReadOnly, LeftHeaderRenderer, ...blockInfo } = props

  const { accessWhenShared } = usePermissions()

  const updatedAt = metadata?.updatedAt

  const viewOnly = useMemo(() => {
    const access = accessWhenShared(blockInfo.parent)
    return isReadonly(access)
  }, [blockInfo.parent])

  const theme = useTheme()

  return (
    <Section margin={`0 0 ${theme.spacing.medium}`} contentEditable={false}>
      <Group>
        <FadeText>{LeftHeaderRenderer && LeftHeaderRenderer}</FadeText>

        {updatedAt && (
          <>
            <Dot />
            <FadeText>
              <RelativeTime dateNum={updatedAt} />
            </FadeText>
          </>
        )}
      </Group>
      {blockInfo.id && blockInfo.parent && !viewOnly && <BlockInfo {...blockInfo} />}
    </Section>
  )
}

export default SuperBlockHeader
