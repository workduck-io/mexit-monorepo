import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/beige.css'

import { ReactElement, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Plate, PlatePluginComponent, SelectEditorOptions } from '@udecode/plate'
import Markdown from 'markdown-to-jsx'
import Reveal from 'reveal.js'
import { EditableProps } from 'slate-react/dist/components/editable'

import { ELEMENT_PARAGRAPH } from '@mexit/core'

import { useGlobalListener } from '../Hooks/useGlobalListener'
import useMultipleEditors from '../Stores/useEditorsStore'
import { useBlockHighlightStore, useFocusBlock } from '../Stores/useFocusBlock'

import { useComboboxConfig } from './Components/Combobox/config'
import { MultiComboboxContainer } from './Components/MultiCombobox/multiComboboxContainer'
import { useMexEditorStore } from './Hooks/useMexEditorStore'
import { MexEditorValue } from './Types/Editor'
import { ComboboxConfig } from './Types/MultiCombobox'
import { PluginOptionType } from './Plugins'
import parseToMarkdown from './utils'

export interface MexEditorOptions {
  editableProps?: EditableProps
  focusOptions?: SelectEditorOptions
  withDraggable?: boolean
  withBalloonToolbar?: boolean
  withGlobalListener?: boolean
}

export interface InternalMetadata {
  path: string
  delimiter?: string
}

export interface MexEditorProps {
  comboboxConfig: ComboboxConfig
  components?: Record<string, PlatePluginComponent<any | undefined>> // * Pass components which you want to replace
  editorId: string // * Unique ID for the Mex Editor
  className?: string // * Pass className to styled Mex Editor
  value: MexEditorValue // * Initial value of editor, to set onChange content, use `editor.children = content`
  // placeholders?: Options<Array<PlaceholderProps>> // * Array of objects with `placeholder` text and element `key
  onChange?: (value: MexEditorValue) => void // * Callback on change
  options?: MexEditorOptions // * Power the editor with options
  meta?: InternalMetadata // * MetaData of current editor
  pluginOptions?: PluginOptionType // * Plugins to power the editor
  debug?: boolean // * Debug mode for content
  md?: boolean //Markdown converter
  exclude?: Array<string> // * Array of elements from MEX_EDITOR_ELEMENTS
  BalloonMarkToolbarButtons?: ReactElement
  portalElement?: Element
}

export const MexEditorBase = (props: MexEditorProps) => {
  const [content, setContent] = useState<MexEditorValue>([])
  const [md, setMd] = useState<string>('')
  const setInternalMetadata = useMexEditorStore((store) => store.setInternalMetadata)
  const isEmpty = useMultipleEditors((store) => store.isEmpty)

  const { focusBlock, selectBlock } = useFocusBlock()
  const clearHighlights = useBlockHighlightStore((store) => store.clearAllHighlightedBlockIds)
  const hightlightedBlockIds = useBlockHighlightStore((store) => store.hightlighted.editor)

  useEffect(() => {
    // const editorRef = getPlateEditorRef()

    // if (editorRef && props?.options?.focusOptions) {
    //   selectEditor(editorRef, props.options.focusOptions)
    // }
    if (props.meta) setInternalMetadata(props.meta)
  }, [props.editorId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    Reveal.initialize()
  }, [])

  const { plugins, comboConfigData } = useComboboxConfig(
    props.editorId,
    props?.comboboxConfig,
    props?.components,
    props?.pluginOptions
  )

  useEffect(() => {
    // Timeout inside a timeout
    // Clear highlights when highlightedBlockIds present
    const timeoutIds = []
    const timeoutId = setTimeout(() => {
      if (hightlightedBlockIds.length > 0) {
        // mog('Focusing highlights', { hightlightedBlockIds, props })
        selectBlock(hightlightedBlockIds[hightlightedBlockIds.length - 1], props.editorId)
        const clearHighlightTimeoutId = setTimeout(() => {
          // mog('clearing highlights')
          if (!props?.options?.editableProps?.readOnly) clearHighlights()
        }, 2000)
        timeoutIds.push(clearHighlightTimeoutId)
      }
    }, 1000)
    timeoutIds.push(timeoutId)
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
    }
  }, [hightlightedBlockIds, props.editorId])

  const onChange = (value: MexEditorValue) => {
    if (props?.debug) setContent(value)

    try {
      console.log('MARKDOWN', value, parseToMarkdown({ children: value, type: ELEMENT_PARAGRAPH }))
    } catch (e) {
      console.log('MARKDOWN ERROR', value, e)
    }
    if (props?.md) setMd(parseToMarkdown({ children: value, type: ELEMENT_PARAGRAPH }))

    console.log({ splitMD: md?.split('---').map((mark) => mark) })
    if (props.onChange) {
      props.onChange(value)
    }
  }

  return (
    <>
      <Plate
        id={props.editorId}
        editableProps={props?.options?.editableProps}
        value={props.value}
        plugins={plugins}
        onChange={onChange}
      >
        {props.options?.withBalloonToolbar && props.BalloonMarkToolbarButtons}
        {isEmpty && <MultiComboboxContainer config={comboConfigData} />}
        {props.options?.withGlobalListener !== false && <GlobalEditorListener />}
      </Plate>
      {props.debug && <pre>{JSON.stringify(content, null, 2)}</pre>}
      {props.md && (
        <div>
          <div className="main">
            <div className="reveal" style={{ height: '50vh' }}>
              <div className="slides">
                {md?.split('---').map((mark) => (
                  <Markdown options={{ wrapper: 'section', forceWrapper: true }}>{mark}</Markdown>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const withDndProvider = (Component: any) => {
  const DndDefaultEditor = (props: MexEditorProps) => (
    <DndProvider backend={HTML5Backend}>
      <Component {...props} />
    </DndProvider>
  )
  return DndDefaultEditor
}

const GlobalEditorListener = () => {
  useGlobalListener()
  return null
}

withDndProvider.displayName = 'DefaultEditor'

export default withDndProvider(MexEditorBase)
