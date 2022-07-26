import Modal from 'react-modal'

import { QuickLink, WrappedNodeSelect } from '../../../Components/NodeSelect/NodeSelect'
import { useCreateNewNote } from '../../../Hooks/useCreateNewNote'
import { useLinks } from '../../../Hooks/useLinks'
import { useDataSaverFromContent } from '../../../Hooks/useSave'
import useBlockStore from '../../../Stores/useBlockStore'
import { useEditorBlockSelection } from '../../Actions/useEditorBlockSelection'

const BlockModal = () => {
  const blocksFromStore = useBlockStore((store) => store.blocks)
  const isModalOpen = useBlockStore((store) => store.isModalOpen)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)

  const { createNewNote } = useCreateNewNote()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()
  const { getNodeidFromPath } = useLinks()

  const { getContentWithNewBlocks, deleteSelectedBlock } = useEditorBlockSelection()

  const toggleModal = () => {
    setIsModalOpen(undefined)
  }

  const onNodeCreate = (quickLink: QuickLink): void => {
    const editorBlocks = deleteSelectedBlock()
    const blocksContent = getContentWithNewBlocks(quickLink.value, editorBlocks, false)
    createNewNote({ path: quickLink.value, noteContent: blocksContent })
    setIsModalOpen(undefined)
  }

  const onNodeSelect = (quickLink: QuickLink) => {
    const nodeid = getNodeidFromPath(quickLink.value)
    const editorBlocks = deleteSelectedBlock()
    const content = getContentWithNewBlocks(nodeid, editorBlocks)

    saveEditorValueAndUpdateStores(nodeid, content)
    setIsModalOpen(undefined)
  }

  const length = Object.values(blocksFromStore).length

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={toggleModal} isOpen={!!isModalOpen}>
      {length ? (
        // isModalOpen === ContextMenuActionType.del ? (
        //   <>
        //     <h1>{`${isModalOpen}`}</h1>
        //     <p>{`Are you sure you want to delete ${length} block(s)?`}</p>
        //     <ButtonWrapper>
        //       <Button large onClick={onCancel}>
        //         Cancel
        //       </Button>
        //       <Button primary large onClick={() => onBlockDelete()}>
        //         Delete
        //       </Button>
        //     </ButtonWrapper>
        //     <br />
        //   </>
        // ) : (
        <>
          <h1>{`${isModalOpen}  to`}</h1>
          <WrappedNodeSelect
            disallowReserved
            autoFocus
            menuOpen
            handleCreateItem={onNodeCreate}
            handleSelectItem={onNodeSelect}
          />
        </>
      ) : (
        <h1>Select Blocks</h1>
      )}
    </Modal>
  )
}

export default BlockModal
