import { createPlugins, ELEMENT_MEDIA_EMBED, ELEMENT_TABLE } from '@udecode/plate'
import { MexEditor, ComboboxKey } from '@workduck-io/mex-editor'
import { MexEditorOptions } from '@workduck-io/mex-editor/lib/types/editor'
import { useDebouncedCallback } from 'use-debounce'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { useEditorChange } from '../../Hooks/useEditorActions'
import generatePlugins from '../../Utils/plugins'
import { useAuthStore } from '../../Hooks/useAuth'
import { EditorWrapper } from './styled'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useTagStore } from '../../Hooks/useTags'

import components from './Components'
import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'
import { Tag, CaptureType } from '@mexit/core'

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  nodePath?: string
  nodeUID: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
  handleSave: (payload: any) => void
}

const commands = [
  {
    command: 'table',
    text: 'Insert Table',
    icon: 'ri:table-line',
    type: 'Quick Actions'
  },
  // {
  //   command: 'canvas',
  //   text: 'Insert Drawing canvas',
  //   icon: 'ri:markup-line',
  //   type: 'Quick Actions'
  // },
  {
    command: 'webem',
    text: 'Insert Web embed',
    icon: 'ri:global-line',
    type: 'Quick Actions'
  }
]

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
    // if (checkMetaParseableURL(currTabURL)) {
    //   const mt = parsePageMetaTags()
    //   setPageMetaTags(mt)
    // }

    return () => {
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
        },
        slash_command: {
          newItemHandler: () => undefined
        }
      },
      slashCommands: {
        webem: {
          slateElementType: ELEMENT_MEDIA_EMBED,
          command: 'webem',
          options: {
            url: 'http://example.com/'
          }
        },
        table: {
          slateElementType: ELEMENT_TABLE,
          command: 'table'
        }
      }
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
      },
      slash_command: {
        cbKey: ComboboxKey.SLASH_COMMAND,
        trigger: '/',
        data: commands.map((l) => ({ ...l, value: l.command })),
        icon: 'ri:flask-line'
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
      edge: 'end',
      focus: true
    },
    withBalloonToolbar: true
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
        components={components}
        BalloonMarkToolbarButtons={<BallonMarkToolbarButtons />}
        onChange={debounced}
        options={editorOptions}
        editorId={nodeUID}
        value={[
          {
            children: content
          }
        ]}
      />
    </EditorWrapper>
  )
}
