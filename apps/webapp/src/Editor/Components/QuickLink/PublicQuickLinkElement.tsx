import { useMemo } from 'react'
import { useMatch } from 'react-router-dom'

import { usePublicNodeStore } from '@mexit/core'
import { SILink } from '@mexit/shared'

import { getTitleFromPath } from '../../../Hooks/useLinks'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import EditorPreview from '../EditorPreview/EditorPreview'

const PublicQuickLinkElement = ({ nodeId, setPreview, preview, selected, onClickProps }) => {
  const getContent = usePublicNodeStore((s) => s.getContent)
  const ilinks = usePublicNodeStore((s) => s.iLinks)
  const { goTo } = useRouting()
  const publicNamespaceMatch = useMatch(`${ROUTE_PATHS.namespaceShare}/:namespaceid/node/:nodeid`)

  const { title, content } = useMemo(() => {
    const note = ilinks.find((i) => i.nodeid === nodeId)

    return {
      content: getContent(nodeId)?.content,
      title: getTitleFromPath(note.path)
    }
  }, [nodeId, ilinks])

  const goToNodeId = (nodeId: string) => {
    if (publicNamespaceMatch) {
      goTo(`${ROUTE_PATHS.namespaceShare}/${publicNamespaceMatch.params.namespaceid}/node`, NavigationType.push, nodeId)
    } else {
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
    }
  }

  if (!content) {
    return (
      <SILink
        $selected={selected}
        onClick={(e) => {
          if (e.detail === 2) goToNodeId(nodeId)
        }}
      >
        <span className="ILink_decoration ILink_decoration_left">[[</span>
        <span className="ILink_decoration ILink_decoration_value">{title}</span>
        <span className="ILink_decoration ILink_decoration_right">]]</span>
      </SILink>
    )
  }

  return (
    <EditorPreview
      placement="auto"
      preview={preview}
      title={title}
      nodeid={nodeId}
      allowClosePreview
      content={content}
      setPreview={setPreview}
    >
      <SILink $selected={selected} onClick={onClickProps}>
        <span className="ILink_decoration ILink_decoration_left">[[</span>
        <span className="ILink_decoration ILink_decoration_value">{title}</span>
        <span className="ILink_decoration ILink_decoration_right">]]</span>
      </SILink>
    </EditorPreview>
  )
}

export default PublicQuickLinkElement
