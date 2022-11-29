// different import path!
import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import { getNameFromPath,NodeEditorContent } from '@mexit/core'
import {
  EditorPreviewControls,
  EditorPreviewEditorWrapper,
  EditorPreviewNoteName,
  EditorPreviewWrapper,
  NestedFloating,
  PreviewActionHeader,
  Tooltip
} from '@mexit/shared'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import { Button, MexIcon } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'
import React, { useEffect, useMemo, useRef } from 'react'
import { useLocation, useMatch } from 'react-router-dom'
import { useTheme } from 'styled-components'

import Banner from '../../../Components/Editor/Banner'
import { TagsRelatedTiny } from '../../../Components/Editor/TagsRelated'
import { useBufferStore, useEditorBuffer } from '../../../Hooks/useEditorBuffer'
import { useLinks } from '../../../Hooks/useLinks'
import useLoad from '../../../Hooks/useLoad'
import { isReadonly, usePermissions } from '../../../Hooks/usePermissions'
import { NavigationType,ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import useSocket from '../../../Hooks/useSocket'
import { useTags } from '../../../Hooks/useTags'
import { useContentStore } from '../../../Stores/useContentStore'
import { useDataStore } from '../../../Stores/useDataStore'
import useMultipleEditors from '../../../Stores/useEditorsStore'
import useRouteStore, { BannerType } from '../../../Stores/useRouteStore'
import { SocketActionType } from '../../../Types/Socket'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'

export interface EditorPreviewProps {
  nodeid: string
  children: React.ReactElement
  placement?: string
  delay?: number
  preview?: boolean
  previewRef?: any
  hover?: boolean
  editable?: boolean
  label?: string
  blockId?: string
  content?: NodeEditorContent
  allowClosePreview?: boolean
  icon?: string
  iconTooltip?: string
  setPreview?: (open: boolean) => void
}

const EditorPreview = ({
  nodeid,
  allowClosePreview,
  children,
  content,
  hover,
  blockId,
  label,
  editable = true,
  setPreview,
  icon,
  iconTooltip,
  preview
}: EditorPreviewProps) => {
  const { getILinkFromNodeid } = useLinks()

  const { hasTags } = useTags()
  const editorContentFromStore = useContentStore((store) => store.contents?.[nodeid])
  const { loadNode, getNoteContent } = useLoad()
  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const { goTo } = useRouting()
  const { accessWhenShared } = usePermissions()
  const _hasHydrated = useDataStore((state) => state._hasHydrated)

  const cc = useMemo(() => {
    const nodeContent = getNoteContent(nodeid)

    const ccx = content ?? nodeContent
    return ccx
  }, [nodeid, editorContentFromStore])

  const ilink = getILinkFromNodeid(nodeid, true)

  const editorId = `${nodeid}_Preview`

  const onClickNavigate = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    loadNode(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const checkIfAlreadyPresent = (noteId: string) => {
    const params = match?.params
    const isPresent = useMultipleEditors.getState().editors?.[noteId]?.blink
    const isEditorNote = params?.nodeid === noteId

    return isPresent || isEditorNote
  }

  const theme = useTheme()
  const showPreview = !checkIfAlreadyPresent(nodeid)

  const viewOnly = useMemo(() => {
    const access = accessWhenShared(nodeid)
    return isReadonly(access)
  }, [nodeid, _hasHydrated])

  if (cc) {
    return (
      <NestedFloating
        hover={hover}
        label={label}
        persist={!allowClosePreview}
        open={preview}
        setOpen={setPreview}
        render={({ close, labelId }) =>
          showPreview && (
            <EditorPreviewWrapper id={labelId} className="__editor__preview" tabIndex={-1}>
              {(allowClosePreview || hasTags(nodeid) || ilink?.path) && (
                <EditorPreviewControls hasTags={hasTags(nodeid)}>
                  {ilink?.path && (
                    <PreviewActionHeader>
                      <EditorPreviewNoteName onClick={onClickNavigate}>
                        <Icon icon={ilink?.icon ?? fileList2Line} />
                        {getNameFromPath(ilink.path)}
                      </EditorPreviewNoteName>
                      {icon && iconTooltip && (
                        <Tooltip key={labelId} content={iconTooltip}>
                          <MexIcon color={theme.colors.gray[5]} noHover icon={icon} height="14" width="14" />
                        </Tooltip>
                      )}
                    </PreviewActionHeader>
                  )}
                  <PreviewActionHeader>
                    <TagsRelatedTiny nodeid={nodeid} />
                    <Button
                      transparent
                      onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        close()
                      }}
                    >
                      <Icon icon={closeCircleLine} />
                    </Button>
                  </PreviewActionHeader>
                </EditorPreviewControls>
              )}
              <EditablePreview
                editable={editable && !viewOnly}
                onClose={close}
                id={nodeid}
                blockId={blockId}
                hover={hover}
                editorId={editorId}
                content={cc}
              />
            </EditorPreviewWrapper>
          )
        }
      >
        {children}
      </NestedFloating>
    )
  } else return children
}

const EditablePreview = ({ content, editable, editorId, id: nodeId, blockId, onClose, hover }: any) => {
  const ref = useRef()

  const addToBuffer = useBufferStore((store) => store.add)
  const removeEditor = useMultipleEditors((store) => store.removeEditor)
  const presentEditor = useMultipleEditors((store) => store.editors)?.[nodeId]
  const changeEditorState = useMultipleEditors((store) => store.changeEditorState)
  const lastOpenedEditorId = useMultipleEditors((store) => store.lastOpenedEditor)

  const fromSocket = useSocket()
  const location = useLocation()
  const { saveAndClearBuffer } = useEditorBuffer()
  const routePath = `${ROUTE_PATHS.node}/${nodeId}`

  const removeRouteInfo = useRouteStore((r) => r.removeRouteInfo)
  const removePreviousRouteInfo = useRouteStore((r) => r.removePreviousRouteInfo)
  const isBannerVisible = useRouteStore((r) => r.routes?.[routePath]?.banners?.includes(BannerType.editor))

  const onEditorClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (editable) {
      changeEditorState(nodeId, { editing: true })

      removePreviousRouteInfo()
      fromSocket.sendJsonMessage({
        action: SocketActionType.ROUTE_CHANGE,
        data: { route: routePath }
      })
    }
  }

  useEffect(() => {
    return () => {
      if (onClose) onClose()

      saveAndClearBuffer(false)
      removeEditor(nodeId)
      removeRouteInfo(routePath)
      fromSocket.sendJsonMessage({ action: SocketActionType.ROUTE_CHANGE, data: { route: location.pathname } })
    }
  }, [])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      KeyE: (e) => {
        const lastOpened = lastOpenedEditorId()
        if (editable && (nodeId === lastOpened?.nodeId || hover) && !lastOpened?.editorState?.editing) {
          onEditorClick(e)
          const editor = getPlateEditorRef(editorId)
          if (editor) selectEditor(editor, { edge: 'start', focus: true })
        } else {
          unsubscribe()
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const onChange = (val: NodeEditorContent) => {
    addToBuffer(nodeId, val)
  }

  const handleBannerButtonClick = () => {}

  return (
    <>
      {isBannerVisible && (
        <Banner
          route={routePath}
          onClick={handleBannerButtonClick}
          title="Same Note is being accessed by multiple users. Data may get lost!"
          withDetails={false}
        />
      )}
      <EditorPreviewEditorWrapper
        ref={ref}
        tabIndex={-1}
        id={editorId}
        blink={presentEditor?.blink}
        editable={!!presentEditor?.editing}
        onClick={(ev) => {
          ev.stopPropagation()

          if (ev.detail === 2) {
            onEditorClick(ev)
          }
        }}
      >
        <EditorPreviewRenderer
          onChange={onChange}
          content={content}
          blockId={blockId}
          draftView={false}
          readOnly={!editable || !presentEditor?.editing}
          editorId={editorId}
        />
      </EditorPreviewEditorWrapper>
    </>
  )
}

export default EditorPreview
