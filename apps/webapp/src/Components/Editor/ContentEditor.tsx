import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { focusEditor, getPlateEditorRef } from '@udecode/plate'
import toast from 'react-hot-toast'
import { useLocation, useParams } from 'react-router-dom'

import { tinykeys } from '@workduck-io/tinykeys'

import { defaultContent, NodeEditorContent } from '@mexit/core'
import { StyledEditor, EditorWrapper, isOnEditableElement } from '@mexit/shared'

import { BlockOptionsMenu } from '../../Editor/Components/BlockContextMenu'
import { useComboboxOpen } from '../../Editor/Hooks/useComboboxOpen'
import { useApi } from '../../Hooks/API/useNodeAPI'
import { useKeyListener } from '../../Hooks/useChangeShortcutListener'
import { useComments } from '../../Hooks/useComments'
import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import { useLastOpened } from '../../Hooks/useLastOpened'
import useLayout from '../../Hooks/useLayout'
import useLoad from '../../Hooks/useLoad'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { usePermissions, isReadonly, compareAccessLevel } from '../../Hooks/usePermissions'
import { useReactions } from '../../Hooks/useReactions'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useAnalysisTodoAutoUpdate } from '../../Stores/useAnalysis'
import useBlockStore from '../../Stores/useBlockStore'
import { useContentStore } from '../../Stores/useContentStore'
import { useDataStore } from '../../Stores/useDataStore'
import { getContent, useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import useRouteStore, { BannerType } from '../../Stores/useRouteStore'
import { areEqual } from '../../Utils/hash'
import BlockInfoBar from '../EditorInfobar/BlockInfobar'
import Metadata from '../EditorInfobar/Metadata'
import NavBreadCrumbs from '../NavBreadcrumbs'
import Banner from './Banner'
import Editor from './Editor'
import Toolbar from './Toolbar'

const ContentEditor = () => {
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)
  const { accessWhenShared } = usePermissions()
  const { getAllCommentsOfNode } = useComments()
  const { getAllReactionsOfNode } = useReactions()

  const { getDataAPI } = useApi()
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const isComboOpen = useComboboxOpen()
  const _hasHydrated = useDataStore((state) => state._hasHydrated)

  const infobar = useLayoutStore((store) => store.infobar)

  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const { debouncedAddLastOpened } = useLastOpened()
  const { getNamespaceOfNodeid } = useNamespaces()

  const { addOrUpdateValBuffer, getBufferVal, saveAndClearBuffer } = useEditorBuffer()
  const nodeid = useParams()?.nodeId
  const location = useLocation()
  const fsContent = useContentStore((state) => state.contents[nodeid])

  const isBannerVisible = useRouteStore((s) =>
    s.routes?.[`${ROUTE_PATHS.node}/${nodeid}`]?.banners?.includes(BannerType.editor)
  )

  const { goTo } = useRouting()

  const { shortcutHandler } = useKeyListener()
  // const { getSuggestions } = useSuggestions()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const setInternalUpdate = useContentStore((store) => store.setInternalUpdate)

  const [nodeContent, setNodeContent] = useState<NodeEditorContent>(
    useContentStore.getState().contents?.[nodeid]?.content ?? defaultContent.content
  )

  useEffect(() => {
    const internalUpdate = useContentStore.getState().internalUpdate

    if (!internalUpdate && fsContent?.content) setNodeContent(fsContent?.content)
    else setInternalUpdate(false)
  }, [nodeid, fsContent])

  const onChangeSave = useCallback(
    async (val: any[]) => {
      if (val && nodeid !== '__null__') {
        addOrUpdateValBuffer(nodeid, val)
        debouncedAddLastOpened(nodeid)
      }
    },
    [nodeid]
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

  const onFocusClick = (ev) => {
    // ev.preventDefault()
    // ev.stopPropagation()
    // mog('focus beeches')
    // const editorRef = getPlateEditorRef()
    // if (editorRef) {
    //   if (editorWrapperRef.current) {
    //     const el = editorWrapperRef.current
    //     const hasScrolled = el.scrollTop > 0
    //     if (!hasScrolled) {
    //       selectEditor(editorRef, { focus: true })
    //     }
    //   }
    // }
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
      Enter: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          const editorRef = getPlateEditorRef(nodeid) ?? getPlateEditorRef()
          focusEditor(editorRef)
        }
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
            getAllCommentsOfNode(node.nodeid)
            getAllReactionsOfNode(node.nodeid)
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
    const access = accessWhenShared(nodeid)
    // mog('Access', { access, node })
    return isReadonly(access)
  }, [nodeid, _hasHydrated])

  const handleBannerButtonClick = (e) => {
    goTo(ROUTE_PATHS.namespaceShare, NavigationType.replace, 'NODE_ID_OF_SHARED_NODE')
  }

  const hideShareDetails = () => {
    const access = accessWhenShared(nodeid)
    const accessPriority = compareAccessLevel(access?.note, access?.space)

    return accessPriority !== 'MANAGE' && accessPriority !== 'OWNER'
  }

  return (
    <>
      <StyledEditor showGraph={infobar.mode === 'graph'} className="mex_editor">
        {isBannerVisible && (
          <Banner
            route={location.pathname}
            onClick={handleBannerButtonClick}
            title="Same Note is being accessed by multiple users. Data may get lost!"
          />
        )}
        <NavBreadCrumbs nodeId={nodeid} />
        <Toolbar />
        {isBlockMode ? (
          <BlockInfoBar />
        ) : (
          <Metadata
            hideShareDetails={hideShareDetails()}
            namespaceId={getNamespaceOfNodeid(nodeid)?.id}
            nodeId={nodeid}
          />
        )}

        <EditorWrapper
          comboboxOpen={isComboOpen}
          isUserEditing={isUserEditing}
          ref={editorWrapperRef}
          onClick={onFocusClick}
        >
          <Editor
            // showBalloonToolbar
            onAutoSave={onAutoSave}
            includeBlockInfo={true}
            // getSuggestions={getSuggestions}
            onChange={onChangeSave}
            content={nodeContent}
            nodeUID={nodeid}
            readOnly={viewOnly}
            autoFocus={false}
          />
        </EditorWrapper>
      </StyledEditor>
      <BlockOptionsMenu blockId="one" />
      {/* <NodeIntentsModal nodeid={nodeid} /> */}
    </>
  )
}

export default ContentEditor
