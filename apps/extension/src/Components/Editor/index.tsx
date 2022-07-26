import downIcon from '@iconify/icons-ph/arrow-down-bold'
import { Icon } from '@iconify/react'
import { createPlugins, ELEMENT_MEDIA_EMBED, ELEMENT_TABLE } from '@udecode/plate'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useSpring } from 'react-spring'
import { useDebouncedCallback } from 'use-debounce'

import { Tag, QuickLinkType, ActionType, ELEMENT_TAG, ELEMENT_ILINK } from '@mexit/core'
import { EditorStyles, useEditorChange } from '@mexit/shared'

import MexEditor from '../../Editor/MexEditor'
import { ComboboxConfig, ComboboxKey } from '../../Editor/types'
import { MexEditorOptions } from '../../Editor/types/editor'
import { useAuthStore } from '../../Hooks/useAuth'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import useDataStore from '../../Stores/useDataStore'
import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'
import components from './Components'
import { EditorWrapper, SeePreview } from './styled'

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
  const { searchResults, activeIndex, activeItem, selection } = useSputlitContext()
  const { previewMode, nodeContent, node, setPreviewMode } = useEditorContext()
  const ref = useRef<HTMLDivElement>()
  const { tags, addTag, ilinks, addILink, sharedNodes, slashCommands } = useDataStore()

  useEditorChange(node.nodeid, nodeContent, onChange)

  // TODO: make both the editors same because snippets are not visible in the extension
  // Plus this would enable us to have block level embed in the extension
  // We would also have to do some optimizations in the way messaging happens
  const internals: any[] = useMemo(
    () => [
      ...ilinks.map((l) => ({
        ...l,
        value: l.nodeid,
        text: l.path,
        icon: l.icon ?? 'ri:file-list-2-line',
        type: QuickLinkType.backlink
      })),
      ...sharedNodes.map((l) => ({
        ...l,
        value: l.nodeid,
        text: l.path,
        icon: l.icon ?? 'ri:share-line',
        type: QuickLinkType.backlink
      })),
      ...slashCommands.internal.map((l) => ({ ...l, value: l.command, text: l.text, type: l.type }))
    ],
    [ilinks, sharedNodes, slashCommands.internal]
  )

  const comboboxConfig: ComboboxConfig = {
    onKeyDownConfig: {
      keys: {
        tag: {
          slateElementType: ELEMENT_TAG,
          newItemHandler: (newItem) => addTag(newItem)
        },
        ilink: {
          slateElementType: ELEMENT_ILINK,
          newItemHandler: (newItem, parentId?) => addILink({ ilink: newItem, openedNodePath: parentId })
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
            url: 'https://example.com/'
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
        data: tags.map((t) => ({ ...t, text: t.value })),
        icon: 'ri:hashtag'
      },
      ilink: {
        cbKey: ComboboxKey.ILINK,
        trigger: '[[',
        data: internals,
        icon: 'ri:file-list-2-line'
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

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  return (
    <EditorWrapper style={springProps} onClick={() => setPreviewMode(false)} ref={ref}>
      {selection && (
        <SeePreview onMouseDown={handleScrollToBottom}>
          <Icon icon={downIcon} />
        </SeePreview>
      )}
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
