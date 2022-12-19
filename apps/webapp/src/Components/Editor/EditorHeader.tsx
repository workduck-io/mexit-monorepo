import { EditorHeader as StyledHeaderEditor } from '@mexit/shared'

import { useNamespaces } from '../../Hooks/useNamespaces'
import { compareAccessLevel, usePermissions } from '../../Hooks/usePermissions'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import useBlockStore from '../../Stores/useBlockStore'
import useRouteStore, { BannerType } from '../../Stores/useRouteStore'
import BlockInfoBar from '../EditorInfobar/BlockInfobar'
import Metadata from '../EditorInfobar/Metadata'
import NavBreadCrumbs from '../NavBreadcrumbs'

import Banner from './Banner'
import Toolbar from './Toolbar'

const EditorHeader: React.FC<{ noteId: string }> = ({ noteId }) => {
  const { goTo } = useRouting()
  const { accessWhenShared } = usePermissions()
  const { getNamespaceOfNodeid } = useNamespaces()

  const isBlockMode = useBlockStore((store) => store.isBlockMode)

  const isBannerVisible = useRouteStore((s) =>
    s.routes?.[`${ROUTE_PATHS.node}/${noteId}`]?.banners?.includes(BannerType.editor)
  )

  const onBannerClick = (e) => {
    goTo(ROUTE_PATHS.namespaceShare, NavigationType.replace, 'NODE_ID_OF_SHARED_NODE')
  }

  const hideShareDetails = () => {
    const access = accessWhenShared(noteId)
    const accessPriority = compareAccessLevel(access?.note, access?.space)

    return accessPriority !== 'MANAGE' && accessPriority !== 'OWNER'
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
      {isBlockMode ? (
        <BlockInfoBar />
      ) : (
        <Metadata
          hideShareDetails={hideShareDetails()}
          namespaceId={getNamespaceOfNodeid(noteId)?.id}
          nodeId={noteId}
        />
      )}
    </StyledHeaderEditor>
  )
}

export default EditorHeader
