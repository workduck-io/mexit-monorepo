import { useEffect, useState } from 'react'

import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSelected } from 'slate-react'

import { View } from '@mexit/core'
import {
  Group,
  RootElement,
  SearchFilterListSuggested,
  StyledTasksKanbanBlock,
  StyledViewBlockPreview
} from '@mexit/shared'

import { DisplayFilter } from '../../../Components/Filters/Filter'
import { RenderGlobalJoin } from '../../../Components/Filters/GlobalJoinFilterMenu'
import { RenderSort } from '../../../Components/Filters/SortMenu'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useViews } from '../../../Hooks/useViews'
import { useViewStore } from '../../../Stores/useViewStore'
import { Chip, FlexBetween, InlineBlockText, InlineFlex, StyledInlineBlock } from '../../Styles/InlineBlock'

import ViewRenderer from './ViewRenderer'

const ViewBlock = (props: any) => {
  const { goTo } = useRouting()
  const viewid = props.element.value
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { getView } = useViews()

  const [view, setView] = useState<View | undefined>(undefined)

  useEffect(() => {
    setView(getView(viewid))
  }, [viewid])

  const openView = (ev: any) => {
    ev.preventDefault()
    // loadSnippet(id)
    const views = useViewStore.getState().views
    const view = views.find((view) => view.id === viewid)
    if (view) {
      setCurrentView(view)
      goTo(ROUTE_PATHS.tasks, NavigationType.push, view.id)
    }
  }

  const selected = useSelected()

  return (
    <RootElement {...props.attributes}>
      <div contentEditable={false}>
        <StyledInlineBlock selected={selected} data-tour="mex-onboarding-inline-block">
          <FlexBetween>
            <InlineFlex>
              <Icon icon={stackLine} />
              <InlineBlockText>{view?.title ?? 'Embeded View'}</InlineBlockText>
            </InlineFlex>
            {/*
              <Button onClick={refreshView}>Refresh View</Button>
            */}
            <Chip onClick={openView}>Open</Chip>
          </FlexBetween>

          <StyledViewBlockPreview>
            <StyledTasksKanbanBlock>
              {view?.filters.length > 0 && (
                <SearchFilterListSuggested>
                  <Group>
                    {view?.filters.map((f) => (
                      <DisplayFilter key={f.id} filter={f} />
                    ))}
                    <RenderGlobalJoin globalJoin={view?.globalJoin} />
                  </Group>
                  <RenderSort sortOrder={view.sortOrder} sortType={view.sortType} />
                </SearchFilterListSuggested>
              )}
              <ViewRenderer view={view} viewId={viewid} setView={setView} />
            </StyledTasksKanbanBlock>
          </StyledViewBlockPreview>
        </StyledInlineBlock>
      </div>
      {props.children}
    </RootElement>
  )
}

export default ViewBlock
