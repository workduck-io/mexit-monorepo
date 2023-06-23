import { Value } from '@udecode/plate'
import { useFocused, useSelected } from 'slate-react'

import { SuperBlockProps } from './SuperBlock.types'
import { SuperBlock } from '.'

const ContentSuperBlock = <V extends Value>(props: SuperBlockProps<V>) => {
  const active = useFocused()
  const selected = useSelected()

  return (
    <SuperBlock element={props.element} $isActive={!active} $isSelected={selected}>
      {props.children}
      {selected && true && (
        <pre style={{ padding: '1rem' }} contentEditable={false}>
          {JSON.stringify(props.element, null, 4)}
        </pre>
      )}
    </SuperBlock>
  )
}

export default ContentSuperBlock
