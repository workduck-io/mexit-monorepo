import { Value } from '@udecode/plate'
import { useFocused, useSelected } from 'slate-react'

import { IS_DEV } from '@mexit/core'
import { DefaultMIcons } from '@mexit/shared'

import { SuperBlockProps } from './SuperBlock.types'
import SuperBlockTitle from './SuperBlockTitle'
import { SuperBlock } from '.'

const RenderData = ({ value }) => {
  const selected = useSelected()

  if (IS_DEV) {
    return (
      selected && (
        <pre style={{ padding: '1rem' }} contentEditable={false}>
          {JSON.stringify(value, null, 4)}
        </pre>
      )
    )
  }
}

const ContentSuperBlock = <V extends Value>(props: SuperBlockProps<V>) => {
  const active = useFocused()
  const selected = useSelected()

  return (
    <SuperBlock
      element={props.element}
      $isActive={!active}
      $isSelected={selected}
      LeftHeaderRenderer={() => <SuperBlockTitle icon={DefaultMIcons.NOTE} title="Content" />}
    >
      {props.children}
      <RenderData value={props.element} />
    </SuperBlock>
  )
}

export default ContentSuperBlock
