import { createPlugins, createPlateUI } from '@udecode/plate'
import { MexEditor, ComboboxKey } from '@workduck-io/mex-editor'
import { MexEditorOptions } from '@workduck-io/mex-editor/lib/types/editor'
import { useDebouncedCallback } from 'use-debounce'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { useEditorChange } from '../../Hooks/useEditorActions'
import { CaptureType } from '@mexit/shared'
import generatePlugins from '../../Utils/plugins'
import { Button } from '@mexit/shared'
import { useAuthStore } from '../../Hooks/useAuth'
import { checkMetaParseableURL, parsePageMetaTags, useTagStore } from '@mexit/shared'
import { Tag } from '../../Types/Tags'
import config from '../../config'
import { EditorWrapper } from './styled'
import { useSputlitContext } from '../../Hooks/useSputlitContext'

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  nodePath?: string
  nodeUID: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
  handleSave: (payload: any) => void
}

export const Editor: React.FC<EditorProps> = ({ nodeUID, nodePath, content, readOnly, onChange, handleSave }) => {
  const setPreview = useSputlitContext().setPreview
  const currTabURL = window.location.href
  const [pageMetaTags, setPageMetaTags] = useState<any[]>([])
  const [userTags, setUserTags] = useState<Tag[]>([])

  const addTags = useTagStore((store) => store.addTags)
  const tags = useTagStore((store) => store.tags)

  const plugins = createPlugins(generatePlugins())
  const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  useEffect(() => {
    if (checkMetaParseableURL(currTabURL)) {
      const mt = parsePageMetaTags()
      setPageMetaTags(mt)
    }
  }, [currTabURL])

  useEditorChange(nodeUID, content)

  const comboboxConfig = {
    onKeyDownConfig: {
      keys: {
        tag: {
          newItemHandler: (tag: string) => addTags({ id: 'TAG_1234', text: tag })
        },
        ilink: {
          newItemHandler: (ilink: string, parentId?: string) => console.log(`ilink: ${ilink} | ParentID: ${parentId}`)
        }
      },
      slashCommands: {}
    },
    onChangeConfig: {
      tag: {
        cbKey: ComboboxKey.TAG,
        trigger: '#',
        data: tags.map((t) => ({ ...t, text: t.text })),
        icon: 'add-something-here'
      },
      ilink: {
        cbKey: ComboboxKey.ILINK,
        trigger: '[[',
        data: [],
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
    <EditorWrapper onFocus={() => setPreview(false)} onBlur={() => setPreview(true)}>
      <MexEditor
        comboboxConfig={comboboxConfig}
        meta={{
          path: nodePath
        }}
        components={{}}
        onChange={debounced}
        options={editorOptions}
        editorId={nodeUID}
        value={[
          {
            children: content
          }
        ]}
      />

      <button
        onClick={() => {
          const payload = {
            nodePath: nodePath,
            type: CaptureType.DRAFT,
            createdBy: userDetails.email,
            metadata: {
              metaTags: pageMetaTags,
              userTags: userTags
            }
          }

          handleSave(payload)
        }}
      >
        Save
      </button>
    </EditorWrapper>
  )
}
