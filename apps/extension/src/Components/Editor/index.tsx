import { createPlugins, ELEMENT_MEDIA_EMBED, ELEMENT_TABLE } from '@udecode/plate'
import { MexEditor, ComboboxKey, QuickLinkElement } from '@workduck-io/mex-editor'
import { MexEditorOptions } from '@workduck-io/mex-editor/lib/types/editor'
import { useSpring } from 'react-spring'

import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { useEditorChange } from '@mexit/shared'
import generatePlugins from '../../Utils/plugins'
import { useAuthStore } from '../../Hooks/useAuth'
import { EditorWrapper } from './styled'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useTagStore } from '../../Hooks/useTags'

import components from './Components'
import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'
import { Tag, CaptureType, QuickLinkType, ActionType } from '@mexit/core'
import { useEditorContext } from '../../Hooks/useEditorContext'

interface EditorProps {
  nodePath?: string
  nodeId?: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
  handleSave: (payload: any) => void
}

const commands = [
  {
    command: 'table',
    text: 'Insert Table',
    icon: 'ri:table-line',
    type: 'Quick Actions'
  },
  // {
  //   command: 'canvas',
  //   text: 'Insert Drawing canvas',
  //   icon: 'ri:markup-line',
  //   type: 'Quick Actions'
  // },
  {
    command: 'webem',
    text: 'Insert Web embed',
    icon: 'ri:global-line',
    type: 'Quick Actions'
  }
]

export const Editor: React.FC<EditorProps> = ({ nodeId, nodePath, readOnly, onChange, handleSave }) => {
  const { searchResults, activeIndex, activeItem } = useSputlitContext()
  const { previewMode, setPreviewMode, nodeContent } = useEditorContext()
  const currTabURL = window.location.href
  const [pageMetaTags, setPageMetaTags] = useState<any[]>([])
  const [userTags, setUserTags] = useState<Tag[]>([])

  const addTags = useTagStore((store) => store.addTags)
  const tags = useTagStore((store) => store.tags)

  const plugins = createPlugins(generatePlugins())
  const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  useEffect(() => {
    // if (checkMetaParseableURL(currTabURL)) {
    //   const mt = parsePageMetaTags()
    //   setPageMetaTags(mt)
    // }

    return () => {
      const payload = {
        nodePath: nodePath,
        type: CaptureType.DRAFT,
        createdBy: userDetails.email,
        metadata: {
          metaTags: pageMetaTags,
          userTags: userTags
        }
      }

      handleSave(payload)
    }
  }, [currTabURL])

  useEditorChange(nodeId, nodeContent)

  const comboboxConfig = {
    onKeyDownConfig: {
      keys: {
        tag: {
          newItemHandler: (tag: string) => addTags({ id: 'TAG_1234', text: tag })
        },
        ilink: {
          newItemHandler: (ilink: string, parentId?: string) => console.log(`ilink: ${ilink} | ParentID: ${parentId}`)
        },
        slash_command: {
          newItemHandler: () => undefined
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
        }
      }
    },
    onChangeConfig: {
      tag: {
        cbKey: ComboboxKey.TAG,
        trigger: '#',
        data: tags.map((t) => ({ ...t, text: t.text })),
        icon: 'add-something-here'
      },
      ilink: {
        cbKey: ComboboxKey.ILINK,
        trigger: '[[',
        data: [],
        icon: 'add-something-here'
      },
      slash_command: {
        cbKey: ComboboxKey.SLASH_COMMAND,
        trigger: '/',
        data: commands.map((l) => ({ ...l, value: l.command })),
        icon: 'ri:flask-line'
      }
    }
  }

  const editorOptions: MexEditorOptions = {
    editableProps: {
      readOnly,
      placeholder: "Let's try something here...",
      autoFocus: false,
      style: {
        padding: '1em'
      }
    },
    focusOptions: {
      edge: 'end',
      focus: false
    },
    withBalloonToolbar: true
  }

  const springProps = useSpring(
    useMemo(() => {
      const style = { width: '45%' }

      if (!previewMode) {
        style.width = '100%'
      }

      if (searchResults[activeIndex] && searchResults[activeIndex]?.category === QuickLinkType.action) {
        style.width = '0%'
      }

      if (activeItem?.type === ActionType.RENDER) {
        style.width = '0%'
      }

      return style
    }, [previewMode, activeIndex, searchResults, activeItem])
  )

  return (
    <EditorWrapper
      style={springProps}
      readOnly={readOnly}
      onFocus={() => setPreviewMode(false)}
      onBlur={() => setPreviewMode(true)}
    >
      <MexEditor
        comboboxConfig={comboboxConfig}
        meta={{
          path: nodePath
        }}
        components={components}
        BalloonMarkToolbarButtons={<BallonMarkToolbarButtons />}
        onChange={onChange}
        options={editorOptions}
        editorId={nodeId}
        value={nodeContent}
      />
    </EditorWrapper>
  )
}
