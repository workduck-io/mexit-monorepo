import { useEffect, useMemo, useState } from 'react'

import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import filter2Line from '@iconify-icons/ri/filter-2-line'
import { useSelected } from 'slate-react'
import { useTheme } from 'styled-components'

import { S3FileDownloadClient } from '@workduck-io/dwindle'

import { mog, ViewType } from '@mexit/core'
import {
  GenericFlex,
  Group,
  MexIcon,
  RootElement,
  SearchFilterListSuggested,
  StyledTasksKanbanBlock,
  StyledViewBlockPreview
} from '@mexit/shared'

import { DisplayFilter } from '../../../Components/Filters/Filter'
import { DisplayGroupBy } from '../../../Components/Filters/GroupBy'
import { RenderSort } from '../../../Components/Filters/SortMenu'
import { ViewContainer } from '../../../Components/Views'
import ParentFilters from '../../../Components/Views/ParentFilters'
import { GroupHeader } from '../../../Components/Views/ViewBlockRenderer/BlockContainer'
import { ContentBlockContainer } from '../../../Components/Views/ViewBlockRenderer/ContentBlock'
import { ViewTypeRenderer } from '../../../Components/Views/ViewRenderer'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useViews } from '../../../Hooks/useViews'
import { useViewStore } from '../../../Stores/useViewStore'
import { Chip, InlineBlockText, StyledViewBlock } from '../../Styles/InlineBlock'

const ViewSnapshotRenderer = ({ viewId, workspaceId }) => {
  const [viewResultSnapshot, setViewResultSnapshot] = useState<{ view: any; items: any[] }>(null)
  const addInViewSnapshotCache = useViewStore((store) => store.addViewSnapshot)

  const downloadSnapshot = async (file: string) => {
    const res = await S3FileDownloadClient({ fileName: file, public: true })

    if (res) {
      const transformedString = await res.transformToString()
      const data = JSON.parse(transformedString ?? '')

      if (data) {
        const snapshotName = `${workspaceId}/${viewId}`
        setViewResultSnapshot(data)
        addInViewSnapshotCache(snapshotName, data)
      }
    }
  }

  useEffect(() => {
    if (workspaceId && viewId) {
      const snapshotName = `${workspaceId}/${viewId}`
      const viewSnapshot = useViewStore.getState().viewSnapshot[snapshotName]

      if (viewSnapshot) setViewResultSnapshot(viewSnapshot)
      else {
        downloadSnapshot(snapshotName).catch((err) => console.error('Unable to download View Snapshot', err))
      }
    }
  }, [viewId])

  if (viewResultSnapshot)
    return (
      <ViewTypeRenderer
        items={viewResultSnapshot?.items}
        type={ViewType.List}
        groupBy={viewResultSnapshot?.view?.groupBy}
      />
    )

  return <></>
}

const ViewBlock = (props: any) => {
  const viewid = props.element.value
  const workspace = props.element.workspace

  mog('View', { viewid, workspace, e: props.element })

  const { goTo } = useRouting()
  const theme = useTheme()
  const { getView, getViewNamedPath } = useViews()

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
  const title = view ? getViewNamedPath(view.id, view.path) : 'Embeded View'

  return (
    <RootElement {...props.attributes}>
      <StyledViewBlock contentEditable={false} selected={selected} data-tour="mex-onboarding-inline-block">
        <ContentBlockContainer>
          <GroupHeader>
            <Group>
              <Icon icon={stackLine} />
              <InlineBlockText>{title}</InlineBlockText>
            </Group>
            <Chip onClick={openView}>Open</Chip>
          </GroupHeader>
          <ParentFilters currentViewId={viewid} noMargin />
          <StyledViewBlockPreview>
            {view?.filters?.length > 0 && (
              <GenericFlex>
                <MexIcon icon={filter2Line} color={theme.tokens.colors.primary.default} />
                <GroupHeader>
                  <SearchFilterListSuggested>
                    {view?.filters?.map((f, i) => (
                      <DisplayFilter key={f.id} filter={f} hideJoin={i === view?.filters?.length - 1} />
                    ))}
                  </SearchFilterListSuggested>
                  <GenericFlex>
                    <DisplayGroupBy />
                    <RenderSort sortOrder={view.sortOrder} sortType={view.sortType} />
                  </GenericFlex>
                </GroupHeader>
              </GenericFlex>
            )}
            {view ? (
              <StyledTasksKanbanBlock>
                <ViewContainer viewId={viewid} withFilters={false} />
              </StyledTasksKanbanBlock>
            ) : (
              <ViewSnapshotRenderer viewId={viewid} workspaceId={workspace} />
            )}
          </StyledViewBlockPreview>
        </ContentBlockContainer>
      </StyledViewBlock>
      {props.children}
    </RootElement>
  )
}

export default ViewBlock
