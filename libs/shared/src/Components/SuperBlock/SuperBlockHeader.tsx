import React from 'react'

import { useTheme } from 'styled-components'

import { FadeText } from '../../Style/fade'
import { Group } from '../../Style/Layouts'
import { RelativeTime } from '../RelativeTime'

import { Dot, Section } from './SuperBlock.styled'
import { MetadataFields, PropertiyFields } from './SuperBlock.types'

interface ISuperBlockHeaderProps {
  id: string
  parent: string

  isSelected?: boolean
  isFocused?: boolean
  isReadOnly?: boolean
  hasAccess?: boolean

  value?: PropertiyFields
  metadata: MetadataFields

  onDelete?: () => void

  LeftHeaderRenderer: any
}

const SuperBlockHeader: React.FC<ISuperBlockHeaderProps> = (props) => {
  const { value, metadata, isReadOnly, hasAccess, LeftHeaderRenderer, ...blockInfo } = props

  const updatedAt = metadata?.updatedAt

  // const { accessWhenShared } = usePermissionsHook()
  // const viewOnly = useMemo(() => {
  //   const access = accessWhenShared(blockInfo.parent)
  //   return isReadonly(access)
  // }, [blockInfo.parent])

  const theme = useTheme()

  return (
    <Section margin={`0 0 ${theme.spacing.medium}`} contentEditable={false}>
      <Group>
        {LeftHeaderRenderer && LeftHeaderRenderer}

        {updatedAt && (
          <>
            <Dot />
            <FadeText>
              <RelativeTime dateNum={updatedAt} />
            </FadeText>
          </>
        )}
      </Group>
      {/* {blockInfo.id && blockInfo.parent && !hasAccess && <BlockInfo {...blockInfo} />} */}
    </Section>
  )
}

export default SuperBlockHeader
