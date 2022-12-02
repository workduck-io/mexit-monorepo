import React, { useMemo } from 'react'

import { Icon } from '@iconify/react'

import { Breadcrumbs } from '@workduck-io/mex-components'

import { NAMESPACE_ID_PREFIX } from '@mexit/core'
import { AccessTag, EditorBreadcrumbs, IconDisplay } from '@mexit/shared'

import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNavigation } from '../../Hooks/useNavigation'
import { useNodes } from '../../Hooks/useNodes'
import { isReadonly, usePermissions } from '../../Hooks/usePermissions'
import { NavigationType,ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'

import { StyledTopNavigation } from './styled'

type NavBreadCrumbsType = {
  nodeId: string
}

const NavBreadCrumbs = ({ nodeId }: NavBreadCrumbsType) => {
  const { goTo } = useRouting()
  const _hasHydrated = useDataStore((state) => state._hasHydrated)
  const { getNodeBreadcrumbs } = useNodes()
  const { getNamespaceIconForNode, getNamespaceOfNodeid } = useNamespaces()
  const { accessWhenShared } = usePermissions()
  const isUserEditing = useEditorStore((store) => store.isEditing)
  const { push } = useNavigation()

  const openBreadcrumb = (nodeId: string) => {
    if (nodeId.startsWith(NAMESPACE_ID_PREFIX)) return
    push(nodeId)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
  }

  const { namespaceIcon, isReadOnly } = useMemo(() => {
    const namespace = getNamespaceOfNodeid(nodeId)
    const access = accessWhenShared(nodeId)
    return {
      namespaceIcon: namespace?.icon,
      isReadOnly: isReadonly(access)
    }
  }, [nodeId, _hasHydrated])

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
      {_hasHydrated && isReadOnly && <AccessTag access="READ" />}
    </StyledTopNavigation>
  )
}

export default NavBreadCrumbs
