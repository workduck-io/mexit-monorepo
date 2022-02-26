import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { MexEditor, ELEMENT_ILINK, ELEMENT_TAG, ComboboxKey } from '@workduck-io/mex-editor'
import { MexEditorOptions } from '@workduck-io/mex-editor/lib/types/editor'
import { useDebouncedCallback } from 'use-debounce'

import { activityNode } from '../../Utils/activity'
import ILinkWrapper from './ILinkWrapper'
import TagWrapper from './TagWrapper'
import useDataStore from '../../Stores/useDataStore'
import useLoad from '../../Hooks/useLoad'

const EditorWrapper = styled.div`
  max-width: 800px;
  margin: 1rem;
`

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  nodePath?: string
  nodeUID: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
}

const Editor: React.FC<EditorProps> = ({ nodeUID, nodePath, content, readOnly, onChange, autoFocus }) => {
  const { getNode } = useLoad()

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

  const editorOptions: MexEditorOptions = {
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

  const debounced = useDebouncedCallback((value) => {
    const f = !readOnly && typeof onChange === 'function' ? onChange : () => undefined
    f(value)
  }, 1000)

  return (
    <EditorWrapper>
      <MexEditor
        comboboxConfig={comboboxConfig}
        components={{
          [ELEMENT_ILINK]: ILinkWrapper,
          [ELEMENT_TAG]: TagWrapper
        }}
        meta={{
          path: nodePath
        }}
        debug
        onChange={debounced}
        options={editorOptions}
        editorId={nodeUID}
        value={content}
      />
    </EditorWrapper>
  )
}

export default Editor
