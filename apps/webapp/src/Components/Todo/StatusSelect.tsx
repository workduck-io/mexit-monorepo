import { getMenuItem, getMIcon, TaskStatus } from '@mexit/core'
import { InsertMenu } from '@mexit/shared'

export const StatusSelect = ({ name, value, shortcut, onChange }) => {
  const handleOnClick = (status) => {
    onChange({ status: status })
  }

  return (
    <InsertMenu
      isMenu
      allowSearch
      placeholder="Set status..."
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
