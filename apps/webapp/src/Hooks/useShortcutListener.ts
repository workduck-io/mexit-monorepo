import { useEffect } from 'react'

import { tinykeys } from '@workduck-io/tinykeys'

import { blurEditableElement, isOnEditableElement } from '@mexit/shared'

import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore } from '../Stores/useEditorStore'
import { useHelpStore } from '../Stores/useHelpStore'

import { useKeyListener } from './useChangeShortcutListener'
import { getNodeidFromPathAndLinks } from './useLinks'
import useLoad from './useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from './useRouting'

export const useShortcutListener = () => {
  const { goTo } = useRouting()
  const { loadNode } = useLoad()
  const { shortcutHandler, shortcutDisabled } = useKeyListener()
  const shortcuts = useHelpStore((s) => s.shortcuts)
  const toggleHelpModal = useHelpStore((s) => s.toggleModal)

  const ilinks = useDataStore((s) => s.ilinks)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event: any) => {
        if (isOnEditableElement(event)) {
          blurEditableElement(event.target)
        }
      },
      [shortcuts.showSnippets.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showSnippets, () => {
            goTo(ROUTE_PATHS.snippets, NavigationType.push)
          })
        }
      },
      [shortcuts.showHelp.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showHelp, () => {
            toggleHelpModal()
          })
        }
      },
      [shortcuts.showIntegrations.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showIntegrations, () => {
            goTo(ROUTE_PATHS.integrations, NavigationType.push)
          })
        }
      },
      [shortcuts.showEditor.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showEditor, () => {
            const node = useEditorStore.getState().node
            if (node.nodeid === '__null__') {
              const baseNodeId = getNodeidFromPathAndLinks(ilinks, node.path, node.namespace)
              loadNode(baseNodeId)
            }

            loadNode(node.nodeid)
            goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
          })
        }
      },
      [shortcuts.showTasks.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showEditor, () => {
            goTo(ROUTE_PATHS.tasks, NavigationType.push)
          })
        }
      },
      [shortcuts.showReminder.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showReminder, () => {
            goTo(ROUTE_PATHS.reminders, NavigationType.push)
          })
        }
      },
      [shortcuts.goToLinks.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.goToLinks, () => {
            goTo(ROUTE_PATHS.links, NavigationType.push)
          })
        }
      },
      [shortcuts.showArchive.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showArchive, () => {
            goTo(ROUTE_PATHS.archive, NavigationType.push)
          })
        }
      },
      [shortcuts.showSearch.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showSearch, () => {
            goTo(ROUTE_PATHS.search, NavigationType.push)
          })
        }
      },
      [shortcuts.showSettings.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showSettings, () => {
            goTo(`${ROUTE_PATHS.settings}/about`, NavigationType.push)
          })
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, ilinks])
}
