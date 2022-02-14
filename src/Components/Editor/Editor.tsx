import React from 'react'
import styled from 'styled-components'
import { MexEditor, ELEMENT_ILINK, ELEMENT_TAG, ComboboxKey } from '@workduck-io/mex-editor'

import { activityNode } from '../../Utils/activity'
import ILinkWrapper from './ILinkWrapper'
import TagWrapper from './TagWrapper'
import useDataStore from '../../store/useDataStore'
import { useParams } from 'react-router-dom'

const EditorWrapper = styled.div`
  max-width: 800px;
  margin: 1rem;
`

const initialValue = [
  {
    children: activityNode.content
  }
]

const Editor = () => {
  const { nodeId } = useParams()

  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)
  const ilinks = useDataStore((store) => store.ilinks)
  const addILink = useDataStore((store) => store.addILink)

  const comboboxConfig = {
    onKeyDownConfig: {
      keys: {
        ilink: {
          newItemHandler: (ilink: string, parentId?: string) => addILink(ilink, null, parentId)
        },
        tag: {
          newItemHandler: (tag: string) => addTag(tag)
        }
      },
      slashCommands: {}
    },
    onChangeConfig: {
      ilink: {
        cbKey: ComboboxKey.ILINK,
        trigger: '[[',
        data: ilinks.map((l) => ({ ...l, value: l.path, text: l.path })),
        icon: 'add-something-here'
      },
      tag: {
        cbKey: ComboboxKey.TAG,
        trigger: '#',
        data: tags.map((t) => ({ ...t, text: t.value })),
        icon: 'add-something-here'
      }
    }
  }

  const editorOptions = {
    editableProps: {
      readOnly: false,
      placeholder: "Let's try something here...",
      autoFocus: true
    },
    focusOptions: {
      edge: 'start',
      focus: true
    }
  }

  return (
    <EditorWrapper>
      <MexEditor
        comboboxConfig={comboboxConfig}
        components={{
          [ELEMENT_ILINK]: ILinkWrapper,
          [ELEMENT_TAG]: TagWrapper
        }}
        meta={{
          path: 'documentation.first'
        }}
        debug
        options={editorOptions}
        editorId={nodeId}
        value={[{ children: [{ type: 'p', text: '' }] }]}
      />
    </EditorWrapper>
  )
}

export default Editor
