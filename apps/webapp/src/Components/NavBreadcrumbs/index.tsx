import React from 'react'

import { Icon } from '@iconify/react'

import { Breadcrumbs } from '@workduck-io/mex-components'

import { NAMESPACE_ID_PREFIX } from '@mexit/core'
import { EditorBreadcrumbs } from '@mexit/shared'

import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNodes } from '../../Hooks/useNodes'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useEditorStore } from '../../Stores/useEditorStore'
import IconDisplay from '../IconPicker/IconDisplay'
import { StyledTopNavigation } from './styled'

type NavBreadCrumbsType = {
  nodeId: string
}

const NavBreadCrumbs = ({ nodeId }: NavBreadCrumbsType) => {
  const { goTo } = useRouting()
  const { getNodeBreadcrumbs } = useNodes()
  const { getNamespaceIconForNode } = useNamespaces()
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const openBreadcrumb = (nodeId: string) => {
    if (nodeId.startsWith(NAMESPACE_ID_PREFIX)) return
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
  }

  const namespaceIcon = getNamespaceIconForNode(nodeId)

  return (
    <StyledTopNavigation>
      <EditorBreadcrumbs isVisible={!isUserEditing}>
        {namespaceIcon && (
          <>
            <IconDisplay icon={namespaceIcon} />
            <Icon icon="ri:arrow-drop-right-line" fontSize="1.5rem" />
          </>
        )}
        <Breadcrumbs items={getNodeBreadcrumbs(nodeId)} key={`mex-breadcrumbs-${nodeId}`} onOpenItem={openBreadcrumb} />
      </EditorBreadcrumbs>
    </StyledTopNavigation>
  )
}

export default NavBreadCrumbs
