import React from 'react'
import styled from 'styled-components'
import { MexEditor, ELEMENT_ILINK, ELEMENT_TAG, ComboboxKey, ComboboxConfig } from '@workduck-io/mex-editor'
import { ELEMENT_MEDIA_EMBED, ELEMENT_TABLE, ELEMENT_LINK, withProps } from '@udecode/plate'
import { MexEditorOptions } from '@workduck-io/mex-editor/lib/types/editor'
import { useDebouncedCallback } from 'use-debounce'

import { LinkElement, MediaEmbedElement, TableWrapper } from '@mexit/shared'

import { ILinkElement } from './ILinkElement'
import TagWrapper from './TagWrapper'
import useDataStore from '../../Stores/useDataStore'
import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'
import { ELEMENT_TODO_LI } from '@mexit/core'
import Todo from '../Todo'
import { useEditorChange } from '@mexit/shared'

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
  readOnly?: boolean
  onChange?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  autoFocus?: boolean
}

export const commands = [
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

const Editor: React.FC<EditorProps> = ({ nodeUID, nodePath, content, readOnly, onChange, autoFocus }) => {
  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)
  const ilinks = useDataStore((store) => store.ilinks)
  const addILink = useDataStore((store) => store.addILink)

  const comboboxConfig: ComboboxConfig = {
    onKeyDownConfig: {
      keys: {
        ilink: {
          // @ts-expect-error Mex Space requires it in this format
          newItemHandler: (ilink: string, parentId?: string) => addILink(ilink, null, parentId)
        },
        tag: {
          newItemHandler: (tag: string) => addTag(tag)
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
    // TODO: fix the value of ilink, it should be nodeId rather than the path
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
        data: tags,
        icon: 'ri:hashtag'
      },
      slash_command: {
        cbKey: ComboboxKey.SLASH_COMMAND,
        trigger: '/',
        data: commands.map((l) => ({ ...l, value: l.command })),
        icon: 'ri:flask-line'
      }
    }
  }

  useEditorChange(nodeUID, content)

  const editorOptions: MexEditorOptions = {
    editableProps: {
      readOnly: readOnly,
      placeholder: "Let's try something here...",
      autoFocus: true
    },
    focusOptions: {
      edge: 'start',
      focus: true
    },
    withBalloonToolbar: true
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
          [ELEMENT_ILINK]: ILinkElement,
          [ELEMENT_TAG]: TagWrapper,
          [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
          [ELEMENT_TABLE]: TableWrapper,
          [ELEMENT_TODO_LI]: Todo,
          [ELEMENT_LINK]: withProps(LinkElement, {
            as: 'a'
          })
        }}
        meta={{
          path: nodePath
        }}
        BalloonMarkToolbarButtons={<BallonMarkToolbarButtons />}
        // debug
        onChange={debounced}
        options={editorOptions}
        editorId={nodeUID}
        value={content}
      />
    </EditorWrapper>
  )
}

export default Editor
