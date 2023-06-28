import { Value } from '@udecode/plate'
import { useFocused, useSelected } from 'slate-react'
import { useTheme } from 'styled-components'

import { DefaultMIcons } from '@mexit/shared'

import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'
import { SuperBlock } from '..'

import { TaskSuperBlockFooter } from './TaskSuperBlockFooter'

const TaskSuperBlock = <V extends Value>(props: SuperBlockProps<V>) => {
  const theme = useTheme()
  const isFocused = useFocused()
  const isSelected = useSelected()

  return (
    <SuperBlock
      element={props.element}
      $isActive={isFocused}
      $isSelected={isSelected}
      LeftHeaderRenderer={() => <SuperBlockTitle icon={DefaultMIcons.TASK} title="Task" />}
      FooterRightComponent={TaskSuperBlockFooter}
    >
      {props.children}
      {/* {true && (
        <pre style={{ padding: '1rem' }} contentEditable={false}>
          {JSON.stringify(props.element.metadata, null, 4)}
        </pre>
      )} */}
    </SuperBlock>
  )
}

export default TaskSuperBlock
