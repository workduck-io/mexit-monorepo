import React from 'react'

import { API, MIcon } from '@mexit/core'
import { Loading, NodeInfo } from '@mexit/shared'

import { useEditorStore } from '../../Stores/useEditorStore'
import { useMetadataStore } from '../../Stores/useMetadataStore'
import IconPicker from '../IconPicker/IconPicker'

import NodeRenameOnlyTitle from './Rename/NodeRename'

const NoteIcon = ({ icon, onChange }) => {
  return <IconPicker size={32} allowPicker={true} onChange={onChange} value={icon} />
}

const Toolbar: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const updateIconInMetadata = useMetadataStore((s) => s.addMetadata)

  const metadata = useMetadataStore((s) => s.metadata.notes[nodeId])

  const onChangeIcon = async (icon: MIcon) => {
    updateIconInMetadata('notes', { [nodeId]: { ...metadata, icon } })

    return await API.node
      .updateMetadata(nodeId, {
        metadata: {
          icon,
          templateID: metadata.templateID
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <NodeInfo>
      <NoteIcon key={`${nodeId}_${metadata?.icon?.value}`} icon={metadata?.icon} onChange={onChangeIcon} />
      <NodeRenameOnlyTitle />
      {fetchingContent && <Loading transparent dots={3} />}
    </NodeInfo>
  )
}

export default Toolbar
