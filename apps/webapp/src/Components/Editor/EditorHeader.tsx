import { BannerType, useBlockStore, useRouteStore } from '@mexit/core'
import { EditorHeader as StyledHeaderEditor } from '@mexit/shared'

import { useNamespaces } from '../../Hooks/useNamespaces'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import BlockInfoBar from '../EditorInfobar/BlockInfobar'
import Metadata from '../EditorInfobar/Metadata'
import NavBreadCrumbs from '../NavBreadcrumbs'

import Banner from './Banner'
import Toolbar from './Toolbar'

const EditorHeader: React.FC<{ noteId: string }> = ({ noteId }) => {
  const { goTo } = useRouting()
  const { getNamespaceOfNodeid } = useNamespaces()

  const isBlockMode = useBlockStore((store) => store.isBlockMode)

  const isBannerVisible = useRouteStore((s) =>
    s.routes?.[`${ROUTE_PATHS.node}/${noteId}`]?.banners?.includes(BannerType.editor)
  )

  const onBannerClick = (e) => {
    goTo(ROUTE_PATHS.namespaceShare, NavigationType.replace, 'NODE_ID_OF_SHARED_NODE')
  }

  return (
    <StyledHeaderEditor>
      {isBannerVisible && (
        <Banner
          route={location.pathname}
          onClick={onBannerClick}
          title="Same Note is being accessed by multiple users. Data may get lost!"
        />
      )}
      <NavBreadCrumbs nodeId={noteId} />
      <Toolbar nodeId={noteId} />
      {isBlockMode ? <BlockInfoBar /> : <Metadata namespaceId={getNamespaceOfNodeid(noteId)?.id} nodeId={noteId} />}
    </StyledHeaderEditor>
  )
}

export default EditorHeader
