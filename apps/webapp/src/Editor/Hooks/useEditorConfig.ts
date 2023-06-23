import { useMemo } from 'react'

import {
  apiURLs,
  ComboboxType,
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TAG,
  getMIcon,
  PromptRenderType,
  SEPARATOR,
  SuperBlocks,
  useAuthStore,
  useDataStore,
  useEditorStore,
  useLinkStore,
  useMentionStore,
  useShareModalStore
} from '@mexit/core'
import { DefaultMIcons } from '@mexit/shared'

import { useOpenReminderModal } from '../../Components/Reminders/CreateReminderModal'
import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { useMentions } from '../../Hooks/useMentions'
import usePrompts from '../../Hooks/usePrompts'
import { useRouting } from '../../Hooks/useRouting'
import { useSnippets } from '../../Hooks/useSnippets'
import { useViews } from '../../Hooks/useViews'
import { useViewStore } from '../../Stores/useViewStore'
import { QuickLinkComboboxItem } from '../Components/QuickLink/QuickLinkComboboxItem'
import { SlashComboboxItem } from '../Components/SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from '../Components/Tags/TagComboboxItem'
import { AI_RENDER_TYPE, CategoryType, QuickLinkType } from '../constants'
import { PluginOptionType } from '../Plugins'
import { ComboboxKey } from '../Types/Combobox'
import { ComboboxConfig, ComboConfigData } from '../Types/MultiCombobox'
import { getNodeIdFromEditor } from '../Utils/helper'

export const useEditorPluginConfig = (editorId: string, options?: PluginOptionType): ComboboxConfig => {
  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)

  const ilinks = useDataStore((store) => store.ilinks)
  const nodeUID = getNodeIdFromEditor(editorId)
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
  const sharedNodes = useDataStore((store) => store.sharedNodes)
  const userDetails = useAuthStore((state) => state.userDetails)
  const nodeid = useEditorStore((state) => state.node.nodeid)
  const views = useViewStore((state) => state.views)
  const webLinks = useLinkStore((s) => s.links?.filter((i) => i.alias) ?? [])
  const getWorkspaceId = useAuthStore((s) => s.getWorkspaceId)

  const { allPrompts } = usePrompts()
  const { getViewNamedPath } = useViews()

  const { createNewNote } = useCreateNewNote()

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

  const internals: any[] = [
    ...ilinksForCurrentNode.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? DefaultMIcons.NOTE,
      type: QuickLinkType.backlink
    })),
    ...views.map((l) => ({
      value: l.id,
      text: getViewNamedPath(l.id, l.path),
      icon: { type: 'ICON', value: 'ri:share-line' },
      type: QuickLinkType.taskView
    })),
    ...allPrompts.map((prompt) => ({
      value: prompt.entityId,
      text: prompt.title,
      icon: DefaultMIcons.PROMPT,
      type: QuickLinkType.prompts
    })),
    ...sharedNodes.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? DefaultMIcons.SHARED_NOTE,
      type: QuickLinkType.backlink
    })),
    ...slashInternals.map((l) => ({ ...l, value: l.command, text: l.text, type: l.type })),
    ...webLinks.map((l) => ({
      value: apiURLs.links.shortendLink(l?.alias, getWorkspaceId()),
      text: l.alias,
      icon: DefaultMIcons.WEB_LINK,
      type: QuickLinkType.webLinks
    }))
  ]

  const mentions = useMemo(() => {
    const icon = getMIcon('ICON', 'ri:user-line')
    return userDetails
      ? [
          {
            value: userDetails.id,
            text: `${userDetails.alias} (you)`,
            icon,
            type: QuickLinkType.mentions
          },
          ...mentionable
            .filter((m) => m.alias !== undefined)
            .filter((m) => m.id !== userDetails.id)
            .map((m) => ({
              value: m.id,
              text: m.alias,
              icon,
              type: QuickLinkType.mentions
            })),
          ...invitedUsers.map((m) => ({
            value: m.alias,
            text: m.alias,
            icon,
            type: QuickLinkType.mentions,
            additional: { email: m.email }
          }))
        ]
      : []
  }, [mentionable, invitedUsers, userDetails])

  const onKeyDownConfig: ComboConfigData = {
    keys: {
      inline_block: {
        slateElementType: ELEMENT_INLINE_BLOCK,
        newItemHandler: (newItem, openedNoteId?) => {
          const openedNode = useDataStore.getState().ilinks.find((l) => l.nodeid === openedNoteId)
          const link = addILink({ ilink: newItem, openedNotePath: openedNode?.path, namespace: openedNode?.namespace })
          return link.nodeid
        },
        renderElement: QuickLinkComboboxItem
      },
      web_link: {
        slateElementType: ELEMENT_LINK,
        newItemHandler: () => undefined,
        renderElement: SlashComboboxItem
      },
      prompts: {
        slateElementType: PromptRenderType,
        newItemHandler: () => undefined,
        renderElement: SlashComboboxItem
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
        newItemHandler: (path, openedNoteId?) => {
          const openedNode = useDataStore.getState().ilinks.find((l) => l.nodeid === openedNoteId)
          const note = createNewNote({
            path: path.startsWith(SEPARATOR) ? `${openedNode?.path}${path}` : path,
            parent: path.startsWith(SEPARATOR)
              ? {
                  path: openedNode?.path,
                  namespace: openedNode?.namespace
                }
              : undefined,
            noRedirect: true,
            namespace: openedNode?.namespace
          })
          return note?.nodeid
        },
        renderElement: SlashComboboxItem
      },
      mention: !options?.exclude?.mentions
        ? {
            slateElementType: ELEMENT_MENTION,
            onItemInsert: (alias) => {
              grantUserAccessOnMention(alias, nodeid)
            },
            newItemHandler: (newAlias) => {
              prefillShareModal('invite', 'note', { alias: newAlias, fromEditor: true })
              return newAlias
            },
            renderElement: TagComboboxItem
          }
        : undefined
    },
    internal: {
      ilink: {
        slateElementType: ELEMENT_ILINK,
        newItemHandler: (path, openedNoteId?) => {
          const openedNode = useDataStore.getState().ilinks.find((l) => l.nodeid === openedNoteId)
          const note = createNewNote({
            path: path.startsWith(SEPARATOR) ? `${openedNode?.path}${path}` : path,
            parent: path.startsWith(SEPARATOR)
              ? {
                  path: openedNode?.path,
                  namespace: openedNode?.namespace
                }
              : undefined,
            noRedirect: true,
            namespace: openedNode?.namespace
          })
          return note?.nodeid
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
          url: 'https://example.com/'
        }
      },
      ai: {
        slateElementType: AI_RENDER_TYPE,
        command: 'ai'
      },
      task: {
        slateElementType: SuperBlocks.TASK,
        command: 'task',
        getData: () => ({
          type: SuperBlocks.TASK,
          children: [{ text: '' }],
          metadata: {
            properties: {
              status: 'todo'
            }
          }
        })
      },
      table: {
        slateElementType: ELEMENT_TABLE,
        command: 'table'
      },
      ...(!nodeUID?.startsWith('SNIPPET_') && {
        remind: {
          slateElementType: ELEMENT_PARAGRAPH,
          command: 'remind',
          onExtendedCommand: (newValue, editor) => {
            openReminderModal(newValue, 'node')
          }
        }
      })
    }
  }

  let onChangeConfig: Record<string, ComboboxType> = {
    internal: {
      cbKey: ComboboxKey.INTERNAL,
      trigger: '[[',
      blockTrigger: ':',
      data: internals,
      icon: DefaultMIcons.NOTE
    },
    tag: {
      cbKey: ComboboxKey.TAG,
      trigger: '#',
      data: tags.map((t) => ({ ...t, text: t.value, type: CategoryType.tag })),
      icon: getMIcon('ICON', 'ri:hashtag')
    },
    slash_command: {
      cbKey: ComboboxKey.SLASH_COMMAND,
      trigger: '/',
      icon: getMIcon('ICON', 'ri:flask-line'),
      data: slashCommands.default
        .map((l) => ({ ...l, value: l.command, type: CategoryType.action, text: l.text }))
        .filter((item) => {
          if (nodeUID?.startsWith('SNIPPET_') && item.command === 'remind') {
            return false
          }
          return true
        })
    }
  }

  onChangeConfig = options?.exclude?.mentions
    ? onChangeConfig
    : {
        ...onChangeConfig,
        mention: {
          cbKey: ComboboxKey.MENTION,
          trigger: '@',
          data: mentions,
          icon: getMIcon('ICON', 'ri:at-line')
        }
      }

  return {
    onChangeConfig,
    onKeyDownConfig
  }
}
