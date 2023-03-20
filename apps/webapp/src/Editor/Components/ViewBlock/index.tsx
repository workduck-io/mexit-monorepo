import { useMemo } from 'react'

import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import filter2Line from '@iconify-icons/ri/filter-2-line'
import { useSelected } from 'slate-react'
import { useTheme } from 'styled-components'

import {
  Group,
  MexIcon,
  RootElement,
  SearchFilterListSuggested,
  StyledTasksKanbanBlock,
  StyledViewBlockPreview
} from '@mexit/shared'

import { DisplayFilter } from '../../../Components/Filters/Filter'
import { RenderSort } from '../../../Components/Filters/SortMenu'
import { ViewContainer } from '../../../Components/Views'
import { GroupHeader } from '../../../Components/Views/ViewBlockRenderer/BlockContainer'
import { ContentBlockContainer } from '../../../Components/Views/ViewBlockRenderer/ContentBlock'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useViews } from '../../../Hooks/useViews'
import { useViewStore } from '../../../Stores/useViewStore'
import { Chip, InlineBlockText, StyledViewBlock } from '../../Styles/InlineBlock'

const ViewBlock = (props: any) => {
  const viewid = props.element.value

  const { goTo } = useRouting()
  const theme = useTheme()
  const { getView } = useViews()

  const view = useMemo(() => getView(viewid), [viewid])

  const openView = (ev: any) => {
    ev.preventDefault()
    const views = useViewStore.getState().views
    const view = views.find((view) => view.id === viewid)

    if (view) {
      goTo(ROUTE_PATHS.view, NavigationType.push, view.id)
    }
  }

  const selected = useSelected()

  return (
    <RootElement {...props.attributes}>
      <StyledViewBlock contentEditable={false} selected={selected} data-tour="mex-onboarding-inline-block">
        <ContentBlockContainer>
          <GroupHeader>
            <Group>
              <Icon icon={stackLine} />
              <InlineBlockText>{view?.title ?? 'Embeded View'}</InlineBlockText>
            </Group>
            <Chip onClick={openView}>Open</Chip>
          </GroupHeader>

          <StyledViewBlockPreview>
            {view?.filters.length > 0 && (
              <Group>
                <MexIcon icon={filter2Line} color={theme.tokens.colors.primary.default} />
                <GroupHeader>
                  <SearchFilterListSuggested>
                    {view?.filters?.map((f, i) => (
                      <DisplayFilter key={f.id} filter={f} hideJoin={i === view?.filters?.length - 1} />
                    ))}
                    <RenderSort sortOrder={view.sortOrder} sortType={view.sortType} />
                  </SearchFilterListSuggested>
                </GroupHeader>
              </Group>
            )}
            <StyledTasksKanbanBlock>
              {view && <ViewContainer viewId={viewid} withFilters={false} />}
            </StyledTasksKanbanBlock>
          </StyledViewBlockPreview>
        </ContentBlockContainer>
      </StyledViewBlock>
      {props.children}
    </RootElement>
  )
}

export default ViewBlock
