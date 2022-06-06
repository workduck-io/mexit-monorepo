import { createPlugins, ELEMENT_MEDIA_EMBED, ELEMENT_TABLE } from '@udecode/plate'
import { useSpring } from 'react-spring'
import { useDebouncedCallback } from 'use-debounce'

import React, { useState, useMemo } from 'react'

import { EditorStyles, useEditorChange } from '@mexit/shared'
import generatePlugins from '../../Utils/plugins'
import { useAuthStore } from '../../Hooks/useAuth'
import { EditorWrapper } from './styled'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useTagStore } from '../../Hooks/useTags'

import components from './Components'
import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'
import { Tag, QuickLinkType, ActionType, ELEMENT_TAG, ELEMENT_ILINK } from '@mexit/core'
import { useEditorContext } from '../../Hooks/useEditorContext'
import useDataStore from '../../Stores/useDataStore'
import { ComboboxConfig, ComboboxKey } from '../../Editor/types'
import MexEditor from '../../Editor/MexEditor'
import { MexEditorOptions } from '../../Editor/types/editor'

interface EditorProps {
  nodePath?: string
  nodeId?: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
}

const commands = [
  {
    command: 'table',
    text: 'Insert Table',
    icon: 'ri:table-line',
    type: 'Quick Actions'
  },
  {
    command: 'webem',
    text: 'Insert Web embed',
    icon: 'ri:global-line',
    type: 'Quick Actions'
  }
]

export const Editor: React.FC<EditorProps> = ({ readOnly, onChange }) => {
  const { searchResults, activeIndex, activeItem } = useSputlitContext()
  const { previewMode, nodeContent, node, setPreviewMode } = useEditorContext()
  const ilinks = useDataStore((store) => store.ilinks)

  const addTags = useTagStore((store) => store.addTags)
  const tags = useTagStore((store) => store.tags)

  useEditorChange(node.nodeid, nodeContent, onChange)

  const comboboxConfig: ComboboxConfig = {
    onKeyDownConfig: {
      keys: {
        tag: {
          slateElementType: ELEMENT_TAG,
          newItemHandler: (tag: string) => addTags({ id: 'TAG_1234', text: tag })
        },
        ilink: {
          slateElementType: ELEMENT_ILINK,
          newItemHandler: (ilink: string, parentId?: string) => console.log(`ilink: ${ilink} | ParentID: ${parentId}`)
        },
        slash_command: {
          slateElementType: 'slash_command',
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
        data: ilinks.map((l) => ({ ...l, value: l.path, text: l.path })),
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
      readOnly,
      placeholder: "Let's try something here...",
      autoFocus: !readOnly,
      style: {
        padding: '1em',
        flex: '1'
      }
    },
    focusOptions: {
      edge: 'start',
      focus: true
    },
    withBalloonToolbar: true
  }

  const springProps = useSpring(
    useMemo(() => {
      const style = { width: '45%' }

      if (!previewMode) {
        style.width = '100%'
      }

      if (searchResults[activeIndex] && searchResults[activeIndex]?.category === QuickLinkType.action) {
        style.width = '0%'
      }

      if (activeItem?.type === ActionType.RENDER) {
        style.width = '0%'
      }

      return style
    }, [previewMode, activeIndex, searchResults, activeItem])
  )

  const debounced = useDebouncedCallback((value) => {
    const f = !readOnly && typeof onChange === 'function' ? onChange : () => undefined
    f(value)
  }, 1000)

  return (
    <EditorWrapper style={springProps} onClick={() => setPreviewMode(false)} onBlur={() => setPreviewMode(true)}>
      <EditorStyles>
        <MexEditor
          comboboxConfig={comboboxConfig}
          meta={{
            path: node.path
          }}
          // debug
          components={components}
          BalloonMarkToolbarButtons={<BallonMarkToolbarButtons />}
          onChange={debounced}
          options={editorOptions}
          editorId={node.nodeid}
          value={nodeContent}
          portalElement={document.getElementById('mexit').shadowRoot.getElementById('sputlit-container')}
        />
      </EditorStyles>
    </EditorWrapper>
  )
}
