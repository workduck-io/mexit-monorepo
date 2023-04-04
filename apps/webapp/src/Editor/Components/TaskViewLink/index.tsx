// import { mog } from '@mexit/core'
import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSelected } from 'slate-react'

import { SILinkRoot, TaskSLink } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useViews } from '../../../Hooks/useViews'

const TaskViewLink = (props: any) => {
  const { getView, getViewNamedPath } = useViews()
  const { goTo } = useRouting()

  const viewid = props.element.value

  const view = getView(viewid)

  const openTaskView = (ev: any) => {
    ev.preventDefault()
    if (view) {
      goTo(ROUTE_PATHS.view, NavigationType.push, view.id)
    }
  }

  const selected = useSelected()

  const title = view ? getViewNamedPath(view.id, view.path) : 'Private/Missing'

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
        <span className="ILink_decoration ILink_decoration_value">{title}</span>
        <span className="ILink_decoration ILink_decoration_right">]]</span>
      </TaskSLink>
      {props.children}
    </SILinkRoot>
  )
}

export default TaskViewLink
