import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Editor from './Editor'
import useDataStore from '../../Store/useDataStore'
import useEditorStore, { defaultContent } from '../../Store/useEditorStore'
import useLoad from '../../Hooks/useLoad'
import useDataSaver from '../../Hooks/useSave'
import { NodeEditorContent } from '../../Types/Data'

const ContentEditor = () => {
  const { nodeId } = useParams()
  //   const { getNode } = useLoad()

  const node = useDataStore((store) => store.ilinks).find((e) => e.nodeid === nodeId)
  const nodeContent = useEditorStore((store) => store.content)

  const { loadNode } = useLoad()
  const { saveNodeWithValue } = useDataSaver()

  useEffect(() => {
    loadNode(nodeId)
  }, [nodeId])

  const handleSave = (value: NodeEditorContent) => {
    console.log('Saving in content editor: ', value)
    saveNodeWithValue(nodeId, value)
    return
  }

  return (
    <>
      <Editor
        nodeUID={nodeId}
        nodePath={node.path}
        content={nodeContent?.content ?? defaultContent.content}
        onChange={handleSave}
      />
    </>
  )
}

export default ContentEditor
