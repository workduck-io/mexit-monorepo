import { useCallback, useEffect, useMemo, useRef } from 'react'

import { usePlateEditorRef, selectEditor } from '@udecode/plate'
import toast from 'react-hot-toast'
import shallow from 'zustand/shallow'

import { tinykeys } from '@workduck-io/tinykeys'

import { defaultContent } from '@mexit/core'
import { StyledEditor, EditorWrapper } from '@mexit/shared'

import { BlockOptionsMenu } from '../../Editor/Components/BlockContextMenu'
import { useComboboxOpen } from '../../Editor/Hooks/useComboboxOpen'
import { useApi } from '../../Hooks/API/useNodeAPI'
import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import useLayout from '../../Hooks/useLayout'
import useLoad from '../../Hooks/useLoad'
import { useNodes } from '../../Hooks/useNodes'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useAnalysisTodoAutoUpdate } from '../../Stores/useAnalysis'
import useBlockStore from '../../Stores/useBlockStore'
import { useContentStore } from '../../Stores/useContentStore'
import { getContent, useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { getEditorId } from '../../Utils/editor'
import { areEqual } from '../../Utils/hash'
import BlockInfoBar from '../EditorInfobar/BlockInfobar'
import Metadata from '../EditorInfobar/Metadata'
import NavBreadCrumbs from '../NavBreadcrumbs'
import Editor from './Editor'
import Toolbar from './Toolbar'
import { usePermissions } from '../../Hooks/usePermissions'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)
  const { accessWhenShared } = usePermissions()

  const { getDataAPI } = useApi()
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const isComboOpen = useComboboxOpen()

  const infobar = useLayoutStore((store) => store.infobar)

  const editorWrapperRef = useRef<HTMLDivElement>(null)
  // const { debouncedAddLastOpened } = useLastOpened()

  const { addOrUpdateValBuffer, getBufferVal, saveAndClearBuffer } = useEditorBuffer()
  const { node } = useEditorStore((state) => ({ nodeid: state.node.nodeid, node: state.node }), shallow)
  const fsContent = useContentStore((state) => state.contents[node.nodeid])

  const { shortcutHandler } = useKeyListener()
  // const { getSuggestions } = useSuggestions()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const editorRef = usePlateEditorRef()

  const nodeContent = useMemo(() => {
    if (fsContent?.content) return fsContent.content
    return defaultContent.content
  }, [node.nodeid, fsContent])

  const onChangeSave = useCallback(
    async (val: any[]) => {
      if (val && node && node.nodeid !== '__null__') {
        addOrUpdateValBuffer(node.nodeid, val)
        // debouncedAddLastOpened(node.nodeid)
      }
    },
    [node.nodeid]
  )

  const onAutoSave = useCallback((val) => {
    saveAndClearBuffer(false)
  }, [])

  useEffect(() => {
    return () => {
      const isBlockMode = useBlockStore.getState().isBlockMode
      if (isBlockMode) setIsBlockMode(true)
      saveAndClearBuffer(false)
    }
  }, [])

  const editorId = useMemo(() => getEditorId(node.nodeid, false), [node, fetchingContent])

  const onFocusClick = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    if (editorRef) {
      if (editorWrapperRef.current) {
        const el = editorWrapperRef.current
        const hasScrolled = el.scrollTop > 0
        // mog('ElScroll', { hasScrolled })
        if (!hasScrolled) {
          selectEditor(editorRef, { focus: true })
        }
      }
    }
  }

  useAnalysisTodoAutoUpdate()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.toggleFocusMode, () => {
          toggleFocusMode()
        })
      },
      [shortcuts.refreshNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          const node = useEditorStore.getState().node
          const val = getBufferVal(node.nodeid)
          const content = getContent(node.nodeid)
          const res = areEqual(content.content, val)

          if (!res) {
            saveApiAndUpdate(node, val)
          } else {
            // * If buffer hasn't changed, refresh the note
            getDataAPI(node.nodeid, false, true)
          }
        })
      },
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          saveAndClearBuffer()
          toast('Saved!')
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  const viewOnly = useMemo(() => {
    const access = accessWhenShared(node?.nodeid)
    return access?.note === 'READ' || access?.space === 'READ'
  }, [node?.nodeid])

  return (
    <>
      <StyledEditor showGraph={infobar.mode === 'graph'} className="mex_editor">
        <NavBreadCrumbs nodeId={node.nodeid} />
        <Toolbar />

        {isBlockMode ? <BlockInfoBar /> : <Metadata node={node} />}

        <EditorWrapper
          comboboxOpen={isComboOpen}
          isUserEditing={isUserEditing}
          ref={editorWrapperRef}
          onClick={onFocusClick}
        >
          <Editor
            // showBalloonToolbar
            onAutoSave={onAutoSave}
            // getSuggestions={getSuggestions}
            onChange={onChangeSave}
            content={nodeContent?.length ? nodeContent : defaultContent.content}
            nodeUID={editorId}
            readOnly={viewOnly}
          />
        </EditorWrapper>
      </StyledEditor>
      <BlockOptionsMenu blockId="one" />
      {/* <NodeIntentsModal nodeid={nodeid} /> */}
    </>
  )
}

export default ContentEditor
