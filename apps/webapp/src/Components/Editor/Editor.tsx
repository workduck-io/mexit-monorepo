import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ELEMENT_MEDIA_EMBED, ELEMENT_TABLE, ELEMENT_LINK, withProps } from '@udecode/plate'
import { useDebouncedCallback } from 'use-debounce'

import { LinkElement, MediaEmbedElement, TableWrapper } from '@mexit/shared'

import TagWrapper from './TagWrapper'
import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'
import { ELEMENT_ILINK, ELEMENT_INLINE_BLOCK, ELEMENT_TAG, ELEMENT_TODO_LI } from '@mexit/core'
import Todo from '../Todo'
import { useEditorChange } from '@mexit/shared'
import { EditorStyles } from '@mexit/shared'
import { useDataStore } from '../../Stores/useDataStore'
import { ComboboxKey } from '../../Editor/Types/Combobox'
import MexEditor, { MexEditorOptions } from '../../Editor/MexEditor'
import { ComboboxConfig, ComboboxItem, ComboboxType, ComboConfigData } from '../../Editor/Types/MultiCombobox'
import { useRouting } from '../../Hooks/useRouting'
import { useSnippets } from '../../Hooks/useSnippets'
import { CategoryType, QuickLinkType } from '../../Editor/constants'
import { SlashComboboxItem } from '../../Editor/Components/SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from '../../Editor/Components/Tags/TagComboboxItem'
import { QuickLinkComboboxItem } from '../../Editor/Components/QuickLink/QuickLinkComboboxItem'
import components from '../../Editor/Components/EditorPreviewComponents'
import { useNewNodes } from '../../Hooks/useNewNodes'

const EditorWrapper = styled(EditorStyles)`
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

const Editor: React.FC<EditorProps> = ({ nodeUID, nodePath, content, readOnly, onChange, autoFocus }) => {
  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)
  const ilinks = useDataStore((store) => store.ilinks)
  const addILink = useDataStore((store) => store.addILink)
  const slashCommands = useDataStore((store) => store.slashCommands)

  const { getSnippetConfigs } = useSnippets()

  const snippetConfigs = getSnippetConfigs()
  const { params, location } = useRouting()

  const ilinksForCurrentNode = useMemo(() => {
    if (params.snippetid) return ilinks

    return ilinks.filter((item) => item.nodeid !== nodeUID)
  }, [nodeUID, ilinks])

  const slashInternals = useMemo(() => {
    const snippetName = (location?.state as any)?.title
    if (params.snippetid && snippetName) {
      return slashCommands.internal.filter((item) => snippetName !== item.text)
    }

    return slashCommands.internal
  }, [slashCommands.internal])

  const { addNodeOrNodes } = useNewNodes()

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
        newItemHandler: async (newItem, parentId?) => {
          const node = await addNodeOrNodes(newItem, true, parentId)
          return node.id
        },
        renderElement: SlashComboboxItem
      }
    },
    internal: {
      ilink: {
        slateElementType: ELEMENT_ILINK,
        newItemHandler: (newItem, parentId?) => {
          return addNodeOrNodes(newItem, true, parentId).then((node) => {
            return node.id
          })
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

  useEditorChange(nodeUID, content)

  const editorOptions: MexEditorOptions = {
    editableProps: {
      readOnly: readOnly,
      // placeholder: "Let's try something here...",
      autoFocus: true
    },
    focusOptions: {
      edge: 'start',
      focus: true
    },
    withDraggable: false,
    withBalloonToolbar: true
  }

  const debounced = useDebouncedCallback((value) => {
    const f = !readOnly && typeof onChange === 'function' ? onChange : () => undefined
    f(value)
  }, 1000)

  const comboboxConfig: ComboboxConfig = {
    onChangeConfig: comboOnChangeConfig,
    onKeyDownConfig: comboOnKeyDownConfig
  }

  return (
    <EditorWrapper>
      <MexEditor
        comboboxConfig={comboboxConfig}
        components={components}
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
