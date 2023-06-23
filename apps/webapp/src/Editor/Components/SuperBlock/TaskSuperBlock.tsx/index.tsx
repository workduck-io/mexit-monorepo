import { Value } from '@udecode/plate'

import { SuperBlockProps } from '../SuperBlock.types'
import { SuperBlock } from '..'

const TaskSuperBlock = <V extends Value>(props: SuperBlockProps<V>) => {
  return (
    <SuperBlock element={props.element} $isActive={false} $isSelected>
      {props.children}
      {true && (
        <pre style={{ padding: '1rem' }} contentEditable={false}>
          {JSON.stringify(props.element.metadata, null, 4)}
        </pre>
      )}
    </SuperBlock>
  )
}

export default TaskSuperBlock
