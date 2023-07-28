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
      $isActive={props.isActive}
      $isSelected={props.isSelected}
      $isReadOnly={props.isReadOnly}
      LeftHeaderRenderer={
        <SuperBlockTitle
          id={restProps.id}
          parent={restProps.parent}
          onChange={restProps.onChange}
          type={restProps.type}
          icon={DefaultMIcons.TASK}
          heading="Task"
          isReadOnly={props.isReadOnly}
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
