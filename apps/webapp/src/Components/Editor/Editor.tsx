import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ELEMENT_MEDIA_EMBED, ELEMENT_TABLE } from '@udecode/plate'
import { useDebouncedCallback } from 'use-debounce'

import {
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_MENTION,
  ELEMENT_TAG,
  mog,
  NodeEditorContent,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI
} from '@mexit/core'
import { useEditorChange, EditorStyles } from '@mexit/shared'

import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'
import Todo from '../Todo'
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
import { useOpenReminderModal } from '../Reminders/CreateReminderModal'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useMentions } from '../../Hooks/useMentions'
import { useShareModalStore } from '../../Stores/useShareModalStore'

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
  onAutoSave?: (content: NodeEditorContent) => void
}

const Editor: React.FC<EditorProps> = ({ nodeUID, nodePath, content, readOnly, onChange, autoFocus, onAutoSave }) => {
  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)
  const ilinks = useDataStore((store) => store.ilinks)
  const addILink = useDataStore((store) => store.addILink)
  const slashCommands = useDataStore((store) => store.slashCommands)
  const { openReminderModal } = useOpenReminderModal()
  const { getSnippetConfigs } = useSnippets()
  const snippetConfigs = getSnippetConfigs()
  const { params, location } = useRouting()
  const mentionable = useMentionStore((state) => state.mentionable)
  const invitedUsers = useMentionStore((state) => state.invitedUsers)
  const prefillShareModal = useShareModalStore((state) => state.prefillModal)
  const { grantUserAccessOnMention } = useMentions()

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

  const { addNodeOrNodesFast } = useNewNodes()

  const internals: any[] = [
    ...ilinksForCurrentNode.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? 'ri:file-list-2-line',
      type: QuickLinkType.backlink
    })),
    ...slashInternals.map((l) => ({ ...l, value: l.command, text: l.text, type: l.type }))
  ]
  const mentions = useMemo(
    () => [
      ...mentionable.map((m) => ({
        value: m.userid,
        text: m.alias,
        icon: 'ri:user-line',
        type: QuickLinkType.mentions
      })),
      ...invitedUsers.map((m) => ({
        value: m.alias,
        text: m.alias,
        icon: 'ri:user-line',
        type: QuickLinkType.mentions,
        additional: { email: m.email }
      }))
    ],
    [mentionable, invitedUsers]
  )

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
          const { id } = addNodeOrNodesFast(newItem, true, parentId)
          return id
        },
        renderElement: SlashComboboxItem
      },
      mention: {
        slateElementType: ELEMENT_MENTION,
        onItemInsert: (alias) => {
          mog('Inserted new item', { alias })
          grantUserAccessOnMention(alias, nodeUID)
        },
        newItemHandler: (newAlias) => {
          // addTag(newItem)
          mog('ELEMENT_MENTIONS', { newAlias })
          prefillShareModal('invite', newAlias, true)
          return newAlias
        },
        renderElement: TagComboboxItem
      }
    },
    internal: {
      ilink: {
        slateElementType: ELEMENT_ILINK,
        newItemHandler: (newItem, parentId?) => {
          const { id } = addNodeOrNodesFast(newItem, true, parentId)
          return id
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
      },
      remind: {
        slateElementType: ELEMENT_PARAGRAPH,
        command: 'remind',
        onExtendedCommand: (newValue, editor) => {
          openReminderModal(newValue)
        }
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
      data: tags.map((t) => ({ ...t, text: t.value })),
      icon: 'ri:hashtag'
    },
    slash_command: {
      cbKey: ComboboxKey.SLASH_COMMAND,
      trigger: '/',
      icon: 'ri:flask-line',
      data: slashCommands.default.map((l) => ({ ...l, value: l.command, type: CategoryType.action, text: l.text }))
    },
    mention: {
      cbKey: ComboboxKey.MENTION,
      trigger: '@',
      data: mentions,
      icon: 'ri:at-line'
    }
  }

  useEditorChange(nodeUID, content)

  const editorOptions: MexEditorOptions = {
    editableProps: {
      readOnly,
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

  const onDelayPerform = useDebouncedCallback((value) => {
    const f = !readOnly && typeof onChange === 'function' ? onChange : () => undefined
    f(value)
  }, 400)

  const saveAfterDelay = useDebouncedCallback(
    typeof onAutoSave === 'function' ? onAutoSave : () => undefined,
    30 * 1000 // After 30 seconds
  )

  const onChangeContent = (val: NodeEditorContent) => {
    onDelayPerform(val)

    if (onAutoSave) {
      saveAfterDelay.cancel()
      saveAfterDelay(val)
    }
  }

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
        onChange={onChangeContent}
        options={editorOptions}
        editorId={nodeUID}
        value={content}
      />
    </EditorWrapper>
  )
}

export default Editor
