import React, { useEffect, useMemo, useState } from 'react'
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { usePlateEditorRef, selectEditor } from '@udecode/plate'
import { useForm } from 'react-hook-form'

import Editor from './Editor'
import { EditorWrapper, InfoTools, NodeInfo, NoteTitle, StyledEditor } from '@mexit/shared'
import { Input } from '@mexit/shared'
import { DRAFT_NODE, getSlug, IS_DEV, mog } from '@mexit/core'
import { IconButton } from '@mexit/shared'
import { debounce } from 'lodash'
import tinykeys from 'tinykeys'
import { useSnippetBuffer, useSnippetBufferStore } from '../../Hooks/useEditorBuffer'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { SnippetSaverButton } from '../Saver'
import { useApi } from '../../Hooks/useApi'
import { useSnippetStore } from '../../Stores/useSnippetStore'

type Inputs = {
  title: string
}

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const { goTo } = useRouting()

  const api = useApi()
  const {
    register,
    formState: { errors }
  } = useForm<Inputs>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)
  // const [value, setValue] = useState('')

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { addOrUpdateValBuffer, saveAndClearBuffer, getBufferVal } = useSnippetBuffer()
  const addTitle = useSnippetBufferStore((store) => store.addTitle)
  const buffer = useSnippetBufferStore((store) => store.buffer)
  const addAll = useSnippetBufferStore((store) => store.addAll)
  const toggleIsTemplate = useSnippetBufferStore((store) => store.toggleIsTemplate)

  useEffect(() => {
    if (snippet) {
      mog('Snippy', { snippet })
      addAll(snippet.id, snippet.content, snippet.title)
      setContent(snippet.content)
    } else {
      returnToSnippets()
    }
  }, [snippet])

  const getSnippetExtras = () => {
    const val = getBufferVal(snippet?.id)
    return { title: val?.title || snippet?.title || '', isTemplate: val?.isTemplate || snippet?.isTemplate || false }
  }

  const isSnippetTemplate = useMemo(() => {
    const val = getBufferVal(snippet?.id)
    console.log('Getting whether snippet is a template or not', { val, snippet })
    if (val && val.isTemplate !== undefined) {
      return val.isTemplate
    }
    return snippet?.isTemplate || false
  }, [snippet, buffer])

  const onChangeSave = (val: any[]) => {
    mog('onChangeSave', { val })
    if (val) {
      addOrUpdateValBuffer(snippet.id, val)
      api.saveSnippetAPI(snippet.id, snippet.title, val)
    }
  }

  const onChangeTitle = (title: string) => {
    const snippetTitle = title ? getSlug(title) : DRAFT_NODE
    addTitle(snippet.id, snippetTitle)
  }

  const { params } = useRouting()
  const snippetid = snippet?.id ?? params.snippetid
  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  const onToggleTemplate = () => {
    const val = getBufferVal(snippet.id)
    if (val && val.isTemplate !== undefined) {
      toggleIsTemplate(snippet.id, !val.isTemplate)
    } else toggleIsTemplate(snippet.id, !snippet.isTemplate)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        returnToSnippets()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const callbackAfterSave = () => {
    const { title } = getSnippetExtras()
    loadSnippet(snippet.id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippet.id, { title })
    // const snippet = useSnippetStore.getState().sn
  }

  const returnToSnippets = () => {
    saveAndClearBuffer()
    // updater()
    goTo(ROUTE_PATHS.snippets, NavigationType.push)
  }

  const defaultValue = snippet && snippet.title !== DRAFT_NODE ? snippet.title : ''

  const onDelay = debounce((value) => onChangeTitle(value), 250)

  const onChange = (e) => {
    const value = e.target.value
    onDelay(value)
  }

  return (
    <>
      <StyledEditor className="snippets_editor">
        <NodeInfo>
          <IconButton
            size={24}
            shortcut={`Esc`}
            icon={arrowLeftLine}
            onClick={returnToSnippets}
            title={'Return To Snippets'}
          />
          <NoteTitle>
            <>
              [[ <Input autoFocus placeholder={DRAFT_NODE} defaultValue={defaultValue} onChange={onChange} /> ]]
            </>
          </NoteTitle>

          {snippet && (
            <InfoTools>
              {/* {isSnippetTemplate && (
                <ItemTag tag={'Template'} icon={'ri-magic-line'} tooltip={'This snippet is a Template'} />
              )} */}
              {/* <IconButton
                size={24}
                icon={magicLine}
                onClick={onToggleTemplate}
                highlight={isSnippetTemplate}
                title={isSnippetTemplate ? 'Convert to Snippet' : 'Convert to Template'}
              /> */}
              <SnippetSaverButton
                getSnippetExtras={getSnippetExtras}
                callbackAfterSave={callbackAfterSave}
                title="Save Snippet"
              />
              {/* {IS_DEV && <SnippetCopierButton />} */}
            </InfoTools>
          )}
        </NodeInfo>

        {snippet && (
          <EditorWrapper onClick={onFocusClick}>
            {
              <Editor
                autoFocus={false}
                // focusAtBeginning={false}
                onChange={onChangeSave}
                content={content}
                nodeUID={snippetid}
              />
            }
          </EditorWrapper>
        )}
      </StyledEditor>
      {/* <CustomDevOnly editorId={snippetid} snippet={snippet} /> */}
    </>
  )
}

export default SnippetEditor
