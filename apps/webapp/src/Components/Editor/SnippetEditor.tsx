import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useParams } from 'react-router-dom'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import { debounce } from 'lodash'

import { IconButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { BannerType, DRAFT_NODE, getSlug, mog, useRouteStore, useSnippetStore } from '@mexit/core'
import { EditorHeader, EditorWrapper, InfoTools, Input, NodeInfo, NoteTitle, StyledEditor } from '@mexit/shared'

import { useSnippetBuffer, useSnippetBufferStore } from '../../Hooks/useEditorBuffer'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

import Banner from './Banner'
import Editor from './Editor'

const SnippetEditor = () => {
  const snippetId = useParams().snippetid
  const snippet = useSnippetStore((store) => store.snippets[snippetId])
  const { goTo } = useRouting()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const location = useLocation()
  const isBannerVisible = useRouteStore((s) => s.routes?.[location.pathname]?.banners?.includes(BannerType.editor))
  const _hasHydrated = useSnippetStore((store) => store._hasHydrated)
  const { addOrUpdateValBuffer, saveAndClearBuffer, getBufferVal } = useSnippetBuffer()
  const addTitle = useSnippetBufferStore((store) => store.addTitle)
  const addAll = useSnippetBufferStore((store) => store.addAll)
  const toggleTemplate = useSnippetBufferStore((store) => store.toggleTemplate)

  useEffect(() => {
    if (snippet) {
      mog('Snippy', { snippet })
      addAll(snippet.id, snippet.content, snippet.title)
      setContent(snippet.content)
    } else {
      if (_hasHydrated) {
        returnToSnippets()
      }
    }
  }, [snippet, _hasHydrated])

  const getSnippetExtras = () => {
    const val = getBufferVal(snippet?.id)
    return { title: val?.title || snippet?.title || '', template: val?.template || snippet?.template || false }
  }

  const onChangeSave = (val: any[]) => {
    mog('onChangeSave', { val })
    if (val) {
      addOrUpdateValBuffer(snippet.id, val)
    }
  }

  const onChangeTitle = (title: string) => {
    const snippetTitle = title ? getSlug(title) : DRAFT_NODE
    addTitle(snippet.id, snippetTitle)
  }

  const onFocusClick = () => {
    const editorRef = getPlateEditorRef()

    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  const onToggleTemplate = () => {
    const val = getBufferVal(snippet.id)
    if (val && val.template !== undefined) {
      toggleTemplate(snippet.id, !val.template)
    } else toggleTemplate(snippet.id, !snippet.template)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        returnToSnippets()
      },
      '$mod+s': (event) => {
        event.preventDefault()
        saveSnippet()
        toast('Saved')
      }
    })

    return () => {
      saveSnippet()
      unsubscribe()
    }
  }, [snippetId])

  const saveSnippet = () => {
    saveAndClearBuffer()
  }

  const returnToSnippets = () => goTo(ROUTE_PATHS.snippets, NavigationType.push)
  const defaultValue = useMemo(() => (snippet?.title !== DRAFT_NODE ? snippet?.title : ''), [snippet])

  const onDelay = debounce((value) => onChangeTitle(value), 250)

  const onChange = (e) => {
    const value = e.target.value
    onDelay(value)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleBannerButtonClick = () => {}

  return (
    <>
      <StyledEditor className="snippets_editor">
        <EditorHeader>
          {isBannerVisible && (
            <Banner
              onClick={handleBannerButtonClick}
              title="Same Snippet is being accessed by multiple users. Data may get lost!"
            />
          )}
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
                [[{' '}
                <Input
                  autoFocus
                  key={defaultValue}
                  placeholder={DRAFT_NODE}
                  defaultValue={defaultValue}
                  onChange={onChange}
                />{' '}
                ]]
              </>
            </NoteTitle>

            <InfoTools>
              {/* <IconButton
                size={24}
                icon={magicLine}
                onClick={onToggleTemplate}
                highlight={isSnippetTemplate}
                title={isSnippetTemplate ? 'Convert to Snippet' : 'Convert to Template'}
              /> */}
            </InfoTools>
          </NodeInfo>
        </EditorHeader>
        <EditorWrapper>
          {snippet && (
            <Editor
              autoFocus={false}
              withHover={false}
              onChange={onChangeSave}
              content={content}
              nodeUID={snippet?.id ?? snippetId}
            />
          )}
        </EditorWrapper>
      </StyledEditor>
    </>
  )
}

export default SnippetEditor
