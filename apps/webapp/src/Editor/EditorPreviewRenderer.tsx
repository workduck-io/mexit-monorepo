import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { ComboboxItem, ComboboxType, EditorStyles } from '@mexit/shared'

import { useBlockHighlightStore, useFocusBlock } from '../Stores/useFocusBlock'
import { useEditorChange } from '@mexit/shared'
import MexEditor from './MexEditor'
import { TodoContainer } from '../Style/Todo.style'
import generatePlugins from './Plugins'
import { editorPreviewComponents } from './Components/EditorPreviewComponents'

import { useRouting } from '../Hooks/useRouting'
import { useSnippets } from '../Hooks/useSnippets'
import { useDataStore } from '../Stores/useDataStore'
import { QuickLinkComboboxItem } from './Components/QuickLink/QuickLinkComboboxItem'
import { SlashComboboxItem } from './Components/SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from './Components/Tags/TagComboboxItem'
import { QuickLinkType, CategoryType } from './constants'
import { ELEMENT_INLINE_BLOCK, ELEMENT_TAG, ELEMENT_ILINK, ELEMENT_MEDIA_EMBED, ELEMENT_TABLE } from './elements'
import { ComboboxKey } from './Types/Combobox'
import { ComboConfigData, ComboboxConfig } from './Types/MultiCombobox'
import { useEditorStore } from '../Stores/useEditorStore'
import { PlatePlugin } from '@udecode/plate'

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
  plugins?: PlatePlugin[]
}

const PreviewStyles = styled(EditorStyles)<{ noMouseEvents: boolean }>`
  ${({ noMouseEvents }) => noMouseEvents && 'pointer-events: none;'};
  /* user-select: none; */
  font-size: 0.9rem;

  ${TodoContainer}, button, input, textarea, select, option {
    pointer-events: none;
  }
`

const EditorPreviewRenderer = ({
  content,
  editorId,
  blockId,
  noStyle,
  noMouseEvents,
  onDoubleClick,
  plugins
}: EditorPreviewRendererProps) => {
  const editableProps = {
    placeholder: 'Murmuring the mex hype... ',
    spellCheck: false,
    style: noStyle
      ? {}
      : {
          padding: '15px'
        },
    readOnly: true
  }

  // We get memoized plugins
  const setHighlights = useBlockHighlightStore((s) => s.setHighlightedBlockIds)
  const { focusBlock } = useFocusBlock()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blockId) {
        // mog('editorPreviewRenderer', { blockId, editorId })
        focusBlock(blockId, editorId)
        setHighlights([blockId], 'preview')
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [blockId, editorId, content])

  useEditorChange(editorId, content)

  const { getSnippetConfigs } = useSnippets()
  const snippetConfigs = getSnippetConfigs()
  const { params, location } = useRouting()
  const slashCommands = useDataStore((store) => store.slashCommands)
  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)
  const ilinks = useDataStore((store) => store.ilinks)
  const addILink = useDataStore((store) => store.addILink)
  const nodeid = useEditorStore((store) => store.node.nodeid)

  const ilinksForCurrentNode = useMemo(() => {
    if (params.snippetid) return ilinks

    return ilinks.filter((item) => item.nodeid !== nodeid)
  }, [nodeid, ilinks])

  const slashInternals = useMemo(() => {
    const snippetName = (location?.state as any)?.title
    if (params.snippetid && snippetName) {
      return slashCommands.internal.filter((item) => snippetName !== item.text)
    }

    return slashCommands.internal
  }, [slashCommands.internal])

  const internals: ComboboxItem[] = [
    ...ilinksForCurrentNode.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? 'ri:file-list-2-line',
      type: QuickLinkType.backlink
    })),
    ...slashInternals.map((l) => ({ ...l, value: l.command, text: l.text, type: l.type }))
  ]

  const comboOnKeyDownConfig: ComboConfigData = {
    keys: {
      inline_block: {
        slateElementType: ELEMENT_INLINE_BLOCK,
        newItemHandler: (newItem, parentId?) => {
          const link = addILink({ ilink: newItem, parentId })
          return link.nodeid
        },
        renderElement: QuickLinkComboboxItem
      },
      tag: {
        slateElementType: ELEMENT_TAG,
        newItemHandler: (newItem) => {
          addTag(newItem)
          return newItem
        },
        renderElement: TagComboboxItem
      },
      slash_command: {
        slateElementType: 'slash_command',
        newItemHandler: () => undefined,
        renderElement: SlashComboboxItem
      },
      internal: {
        slateElementType: 'internal',
        newItemHandler: (newItem, parentId?) => {
          const link = addILink({ ilink: newItem, parentId })
          // mog('Link', { link, newItem, parentId })
          return link.nodeid
        },
        renderElement: SlashComboboxItem
      }
    },
    internal: {
      ilink: {
        slateElementType: ELEMENT_ILINK,
        newItemHandler: (newItem, parentId?) => {
          const link = addILink({ ilink: newItem, parentId })
          // mog('Link', { link, newItem, parentId })
          return link.nodeid
        },
        renderElement: QuickLinkComboboxItem
      },
      commands: {
        ...snippetConfigs
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
  }

  const comboOnChangeConfig: Record<string, ComboboxType> = {
    internal: {
      cbKey: ComboboxKey.INTERNAL,
      trigger: '[[',
      blockTrigger: ':',
      data: internals,
      icon: 'ri:file-list-2-line'
    },
    tag: {
      cbKey: ComboboxKey.TAG,
      trigger: '#',
      data: tags.map((t) => ({ ...t, value: t.text })),
      icon: 'ri:hashtag'
    },
    slash_command: {
      cbKey: ComboboxKey.SLASH_COMMAND,
      trigger: '/',
      icon: 'ri:flask-line',
      data: slashCommands.default.map((l) => ({ ...l, value: l.command, type: CategoryType.action, text: l.text }))
    }
  }

  const comboboxConfig: ComboboxConfig = {
    onChangeConfig: comboOnChangeConfig,
    onKeyDownConfig: comboOnKeyDownConfig
  }

  return (
    <PreviewStyles
      noMouseEvents={noMouseEvents}
      onClick={(ev) => {
        if (onDoubleClick && ev.detail === 2) {
          onDoubleClick(ev)
        }
      }}
    >
      <MexEditor
        comboboxConfig={comboboxConfig}
        options={{ editableProps: editableProps }}
        editorId={editorId}
        value={content}
        plugins={plugins}
      />
    </PreviewStyles>
  )
}
export default EditorPreviewRenderer
