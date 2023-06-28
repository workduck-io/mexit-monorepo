import { Group, IconDisplay } from '@mexit/shared'

const SuperBlockTitle = ({ icon, title }) => {
  return (
    <Group>
      <IconDisplay icon={icon} size={14} />
      <span>{title}</span>
    </Group>
  )
}

export default SuperBlockTitle
