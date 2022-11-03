// different import path!
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'

import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import { useMatch } from 'react-router-dom'
import { useTheme } from 'styled-components'

import { Button, MexIcon } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { NodeEditorContent, getNameFromPath, mog } from '@mexit/core'
import {
  EditorPreviewControls,
  EditorPreviewEditorWrapper,
  EditorPreviewNoteName,
  EditorPreviewWrapper,
  PreviewActionHeader,
  NestedFloating,
  Tooltip
} from '@mexit/shared'

import { TagsRelatedTiny } from '../../../Components/Editor/TagsRelated'
import { useBufferStore, useEditorBuffer } from '../../../Hooks/useEditorBuffer'
import { useLinks } from '../../../Hooks/useLinks'
import useLoad from '../../../Hooks/useLoad'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../../Hooks/useRouting'
import { useTags } from '../../../Hooks/useTags'
import { useContentStore } from '../../../Stores/useContentStore'
import useMultipleEditors from '../../../Stores/useEditorsStore'
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
                editable={editable}
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
  const addToBuffer = useBufferStore((store) => store.add)
  const removeEditor = useMultipleEditors((store) => store.removeEditor)
  const presentEditor = useMultipleEditors((store) => store.editors)?.[nodeId]
  const changeEditorState = useMultipleEditors((store) => store.changeEditorState)
  const lastOpenedEditorId = useMultipleEditors((store) => store.lastOpenedEditor)

  const { saveAndClearBuffer } = useEditorBuffer()
  const ref = useRef()

  const onEditorClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (editable) changeEditorState(nodeId, { editing: true })
  }

  useEffect(() => {
    return () => {
      if (onClose) onClose()

      saveAndClearBuffer(false)
      removeEditor(nodeId)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      KeyE: (e) => {
        const lastOpened = lastOpenedEditorId()
        if (editable && (nodeId === lastOpened?.nodeId || hover) && !lastOpened?.editorState?.editing) {
          onEditorClick(e)
          const editor = getPlateEditorRef(editorId)
          mog('IS EDITOR FOCUESED', { editor })
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

  return (
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
  )
}

export default EditorPreview
