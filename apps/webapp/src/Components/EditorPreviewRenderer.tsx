import {
  ComboboxConfig,
  ComboboxKey,
  ELEMENT_ILINK,
  ELEMENT_TAG,
  MexEditor,
  useDataStore
} from '@workduck-io/mex-editor'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useBlockHighlightStore, useFocusBlock } from '../Stores/useFocusBlock'
import { EditorStyles } from '@mexit/shared'
import { ELEMENT_MEDIA_EMBED, ELEMENT_TABLE } from '@udecode/plate'
import { commands } from './Editor/Editor'
import { useEditorChange } from '@mexit/shared'
import { MexEditorOptions } from 'libs/mex-editor/src/lib/types/editor'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  noStyle?: boolean
  /**
   * Block that will be focused on render
   */
  blockId?: string
  noMouseEvents?: boolean
  onDoubleClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const PreviewStyles = styled(EditorStyles)<{ noMouseEvents: boolean }>`
  ${({ noMouseEvents }) => noMouseEvents && 'pointer-events: none;'};
  user-select: none;
  font-size: 14px;
`
/* ${TodoContainer}, button, input, textarea, select, option {
    pointer-events: none;
  } */

const EditorPreviewRenderer = ({
  content,
  editorId,
  blockId,
  noStyle,
  noMouseEvents,
  onDoubleClick
}: EditorPreviewRendererProps) => {
  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)
  const ilinks = useDataStore((store) => store.ilinks)
  const addILink = useDataStore((store) => store.addILink)

  // TODO: remove the need of combobox config if editor is readonly
  const comboboxConfig: ComboboxConfig = {
    onKeyDownConfig: {
      keys: {
        ilink: {
          // @ts-ignore
          slateElementType: ELEMENT_ILINK,
          newItemHandler: (ilink: string, parentId?: string) => addILink(ilink, null, parentId)
        },
        tag: {
          slateElementType: ELEMENT_TAG,
          newItemHandler: (tag: string) => addTag(tag)
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

  const editorOptions: MexEditorOptions = {
    editableProps: {
      readOnly: true,
      placeholder: "Let's try something here..."
    },
    focusOptions: {
      edge: 'start',
      focus: true
    },
    withBalloonToolbar: false
  }

  useEditorChange(editorId, content)

  // We get memoized plugins
  const setHighlights = useBlockHighlightStore((s) => s.setHighlightedBlockIds)
  const { selectBlock } = useFocusBlock()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blockId) {
        // mog('editorPreviewRenderer', { blockId, editorId })
        selectBlock(blockId, editorId)
        setHighlights([blockId], 'preview')
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [blockId, editorId, content])

  return (
    <PreviewStyles
      noMouseEvents={noMouseEvents}
      onClick={(ev) => {
        if (onDoubleClick && ev.detail === 2) {
          onDoubleClick(ev)
        }
      }}
    >
      <MexEditor comboboxConfig={comboboxConfig} options={editorOptions} editorId={editorId} value={content} />
    </PreviewStyles>
  )
}
export default EditorPreviewRenderer
