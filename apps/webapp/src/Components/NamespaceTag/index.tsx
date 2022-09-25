import React from 'react'

import { useTheme } from 'styled-components'

import { SingleNamespace, RESERVED_NAMESPACES } from '@mexit/core'
import { NamespaceText, StyledNamespaceTag } from '@mexit/shared'

import IconDisplay from '../IconPicker/IconDisplay'

type NamespaceTag = {
  namespace: SingleNamespace
  separator?: boolean
}

const NamespaceTag = ({ namespace, separator = false }: NamespaceTag) => {
  const theme = useTheme()

  if (!namespace) return <></>

  const icon = namespace.icon ?? {
    type: 'ICON',
    value:
      namespace.name === RESERVED_NAMESPACES.default
        ? 'ri:user-line'
        : namespace.name === RESERVED_NAMESPACES.shared
        ? 'ri:share-line'
        : 'heroicons-outline:view-grid'
  }

  return (
    <StyledNamespaceTag separator={separator}>
      <IconDisplay size={12} icon={icon} />
      <NamespaceText>{namespace.name}</NamespaceText>
    </StyledNamespaceTag>
  )
}

export default NamespaceTag
