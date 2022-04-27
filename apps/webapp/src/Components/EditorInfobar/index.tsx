import React from 'react'
import Metadata from './Metadata'
import useEditorStore from '../../Stores/useEditorStore'

import ShareOptions from './ShareOptions'

const EditorInfoBar = () => {
  const node = useEditorStore((store) => store.node)

  return (
    <>
      <ShareOptions />
    </>
  )
}

export default EditorInfoBar
