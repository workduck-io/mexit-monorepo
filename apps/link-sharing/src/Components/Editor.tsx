import React from 'react'
import styled from 'styled-components'
import { MexEditor, ComboboxKey } from '@workduck-io/mex-editor'
import { MexEditorOptions } from '@workduck-io/mex-editor/lib/types/editor'

const EditorWrapper = styled.div`
  flex: 1;
  max-width: 800px;
  margin: 1rem;
  padding: 1rem;
`

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  nodePath?: string
  nodeUID: string
}

const Editor: React.FC<EditorProps> = ({ nodeUID, nodePath, content }) => {
  const comboboxConfig = {
    onKeyDownConfig: {
      keys: {
        ilink: {
          newItemHandler: (ilink: string, parentId?: string) => console.log('New Ilink: ', ilink)
        },
        tag: {
          newItemHandler: (tag: string) => console.log('New Tag: ', tag)
        }
      },
      slashCommands: {}
    },
    onChangeConfig: {
      ilink: {
        cbKey: ComboboxKey.ILINK,
        trigger: '[[',
        data: [],
        icon: 'add-something-here'
      },
      tag: {
        cbKey: ComboboxKey.TAG,
        trigger: '#',
        data: [],
        icon: 'add-something-here'
      }
    }
  }

  const editorOptions: MexEditorOptions = {
    editableProps: {
      readOnly: true,
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
        meta={{
          path: nodePath
        }}
        debug
        options={editorOptions}
        editorId={nodeUID}
        value={content}
      />
    </EditorWrapper>
  )
}

export default Editor
