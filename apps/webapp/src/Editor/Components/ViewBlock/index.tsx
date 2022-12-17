import { useMemo } from 'react'

import Board from '@asseinfo/react-kanban'
import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSelected } from 'slate-react'

import { TodoType } from '@mexit/core'
import {
  RootElement,
  SearchFilterListCurrent,
  StyledTasksKanbanBlock,
  StyledViewBlockPreview,
  TaskColumnHeader
} from '@mexit/shared'

import { DisplayFilter } from '../../../Components/Filters/Filter'
import { RenderGlobalJoin } from '../../../Components/Filters/GlobalJoinFilterMenu'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useTaskViews, useViewStore } from '../../../Hooks/useTaskViews'
import { useTodoKanban } from '../../../Hooks/useTodoKanban'
import { RenderBoardTask } from '../../../Views/Tasks'
import {
  Chip,
  FlexBetween,
  InlineBlockText,
  InlineFlex,
  StyledInlineBlock
} from '../../Styles/InlineBlock'

const ViewBlock = (props: any) => {
  const { goTo } = useRouting()
  const viewid = props.element.value
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { getView } = useTaskViews()
  const { getFilteredTodoBoard } = useTodoKanban()

  const curView = useMemo(() => {
    return getView(viewid)
  }, [viewid])

  const board = useMemo(() => {
    const filters = curView?.filters
    return filters ? getFilteredTodoBoard(filters) : undefined
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

  const RenderCard = ({ id, todo }: { id: string; todo: TodoType }, { dragging }: { dragging: boolean }) => {
    return <RenderBoardTask staticBoard id={id} todo={todo} overlaySidebar={false} dragging={dragging} />
  }

  // mog('Rendering View Block', { selected, curView, viewid, board })

  return (
    <RootElement {...props.attributes}>
      <div contentEditable={false}>
        <StyledInlineBlock selected={selected} data-tour="mex-onboarding-inline-block">
          <FlexBetween>
            <InlineFlex>
              <Icon icon={stackLine} />
              <InlineBlockText>{curView?.title ?? 'Embeded View'}</InlineBlockText>
            </InlineFlex>
            <Chip onClick={openView}>Open</Chip>
          </FlexBetween>
          {board && (
            <StyledViewBlockPreview>
              <StyledTasksKanbanBlock>
                {curView?.filters.length > 0 && (
                  <SearchFilterListCurrent>
                    {curView?.filters.map((f) => (
                      <DisplayFilter key={f.id} filter={f} />
                    ))}
                    <RenderGlobalJoin globalJoin={curView?.globalJoin} />
                  </SearchFilterListCurrent>
                )}
                <Board
                  renderColumnHeader={({ title }) => <TaskColumnHeader>{title}</TaskColumnHeader>}
                  disableColumnDrag
                  disableCardDrag
                  renderCard={RenderCard}
                >
                  {board}
                </Board>
              </StyledTasksKanbanBlock>
            </StyledViewBlockPreview>
          )}
        </StyledInlineBlock>
      </div>
      {props.children}
    </RootElement>
  )
}

export default ViewBlock
