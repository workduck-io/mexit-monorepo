import { getMenuItem, getMIcon, TaskStatus } from '@mexit/core'
import { InsertMenu } from '@mexit/shared'

export const StatusSelect = ({ name, value, shortcut = undefined, onChange }) => {
  const handleOnClick = (status) => {
    onChange({ status: status })
  }

  return (
    <InsertMenu
      isMenu
      allowSearch
      placeholder="Set status..."
      type="modal"
      shortcut={shortcut}
      title="Status"
      selected={value}
      onClick={handleOnClick}
      icon={getMIcon('ICON', TaskStatus[value] ?? TaskStatus['in-progress'].icon)}
      items={Object.values(TaskStatus).map((status) =>
        getMenuItem(status.label, undefined, false, getMIcon('ICON', status.icon), undefined, status.id)
      )}
    />
  )
}
