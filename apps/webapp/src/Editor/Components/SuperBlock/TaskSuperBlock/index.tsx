import { DefaultMIcons } from '@mexit/shared'

import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'
import { SuperBlock } from '..'

import { TaskSuperBlockFooter } from './TaskSuperBlockFooter'

const TaskSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...(restProps as any)}
      $isActive
      $isSelected
      LeftHeaderRenderer={
        <SuperBlockTitle
          id={restProps.id}
          parent={restProps.parent}
          onChange={restProps.onChange}
          type={restProps.type}
          icon={DefaultMIcons.TASK}
          heading="Task"
          value={props.value}
        />
      }
      FooterRightComponent={TaskSuperBlockFooter}
    >
      {children}
    </SuperBlock>
  )
}

export default TaskSuperBlock
