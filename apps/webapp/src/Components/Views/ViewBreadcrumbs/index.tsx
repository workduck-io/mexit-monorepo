import { useMemo } from 'react'

import { Icon } from '@iconify/react'

import { getAllEntities } from '@mexit/core'
import { DefaultMIcons, Group, IconDisplay } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useViews } from '../../../Hooks/useViews'

import { StyledBreadcrumbs, ViewBreadcrumbsContainer } from './styled'

type ViewBreadcrumbProps = {
  path: string
}

const ViewBreadcrumbs: React.FC<ViewBreadcrumbProps> = ({ path }) => {
  const { getView } = useViews()
  const { goTo } = useRouting()

  const items = useMemo(() => {
    const entities = getAllEntities(path).map((entityId) => ({
      id: entityId,
      label: getView(entityId)?.title,
      icon: DefaultMIcons.VIEW.value
    }))

    return entities
  }, [path])

  const onClick = (id: string) => {
    if (id) goTo(ROUTE_PATHS.view, NavigationType.push, id)
  }

  return (
    <ViewBreadcrumbsContainer isVisible>
      <Group>
        <IconDisplay icon={DefaultMIcons.VIEW} />
        <span>Views</span>
        <Icon icon="ri:arrow-drop-right-line" fontSize="1.5rem" />
      </Group>
      <StyledBreadcrumbs interactiveFirstItem key={path} items={items} onOpenItem={onClick} />
    </ViewBreadcrumbsContainer>
  )
}

export default ViewBreadcrumbs
