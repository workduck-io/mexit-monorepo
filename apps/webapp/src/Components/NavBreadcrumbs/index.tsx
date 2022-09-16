import React from 'react'

import { Breadcrumbs } from '@workduck-io/mex-components'

import { EditorBreadcrumbs } from '@mexit/shared'

import { useNavigation } from '../../Hooks/useNavigation'
import { useNodes } from '../../Hooks/useNodes'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useEditorStore } from '../../Stores/useEditorStore'
import { StyledTopNavigation } from './styled'

type NavBreadCrumbsType = {
  nodeId: string
}

const NavBreadCrumbs = ({ nodeId }: NavBreadCrumbsType) => {
  const { goTo } = useRouting()
  const { getNodeBreadcrumbs } = useNodes()
  const { push } = useNavigation()
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const openBreadcrumb = (nodeId: string) => {
    if (nodeId.startsWith('space')) return
    push(nodeId)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
  }

  return (
    <StyledTopNavigation>
      <EditorBreadcrumbs isVisible={!isUserEditing}>
        <Breadcrumbs items={getNodeBreadcrumbs(nodeId)} key={`mex-breadcrumbs-${nodeId}`} onOpenItem={openBreadcrumb} />
      </EditorBreadcrumbs>
    </StyledTopNavigation>
  )
}

export default NavBreadCrumbs
