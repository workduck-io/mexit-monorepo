// import { mog } from '@mexit/core'
import { SILinkRoot, TaskSLink } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useTaskViews, useViewStore } from '../../../Hooks/useTaskViews'
import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSelected } from 'slate-react'

const TaskViewLink = (props: any) => {
  const { getView } = useTaskViews()
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()

  const viewid = props.element.value

  const view = getView(viewid)

  const openTaskView = (ev: any) => {
    ev.preventDefault()
    // mog('openTaskView', { viewid, props })
    if (view) {
      setCurrentView(view)
      goTo(ROUTE_PATHS.tasks, NavigationType.push, view.id)
    }
  }

  const selected = useSelected()
  // mog('ViewLink', { selected, view, props })

  return (
    <SILinkRoot
      {...props.attributes}
      id={`TASK_VIEW_LINK_${viewid}`}
      data-tour="mex-onboarding-ilink"
      data-slate-value={viewid}
      contentEditable={false}
    >
      <TaskSLink onClick={openTaskView} $selected={selected} $archived={!view}>
        <Icon icon={stackLine} />
        <span className="ILink_decoration ILink_decoration_left">[[</span>
        <span className="ILink_decoration ILink_decoration_value"> {view ? view?.title : 'Private/Missing'}</span>
        <span className="ILink_decoration ILink_decoration_right">]]</span>
      </TaskSLink>
      {props.children}
    </SILinkRoot>
  )
}

export default TaskViewLink
