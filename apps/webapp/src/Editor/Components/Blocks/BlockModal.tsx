import { NodeEditorContent, defaultContent, generateTempId, IpcAction, mog } from '@mexit/core'
import {
  AnyObject,
  ELEMENT_PARAGRAPH,
  TNode,
  getNodes,
  getPlateSelectors,
  insertNodes,
  usePlateEditorRef
} from '@udecode/plate'
import Modal from 'react-modal'
import { QuickLink, WrappedNodeSelect } from 'apps/webapp/src/Components/NodeSelect/NodeSelect'
import { useLinks } from 'apps/webapp/src/Hooks/useLinks'
import { useNodes } from 'apps/webapp/src/Hooks/useNodes'
import { useDataSaverFromContent } from 'apps/webapp/src/Hooks/useSave'
import useBlockStore, { ContextMenuActionType } from 'apps/webapp/src/Stores/useBlockStore'
import { useContentStore } from 'apps/webapp/src/Stores/useContentStore'
import { ButtonWrapper } from 'apps/webapp/src/Style/Settings'
import { NodeEntry, Transforms } from 'slate'
import { Button } from '@mexit/shared'
import { updateIds } from '../../Utils/dataTransform'

const BlockModal = () => {
  const blocksFromStore = useBlockStore((store) => store.blocks)
  const isModalOpen = useBlockStore((store) => store.isModalOpen)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  const { addNode } = useNodes()
  // TODO: replace this our comparable object
  // const { saveData } = useSaveData()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()
  const editor = usePlateEditorRef()
  const { getNodeidFromPath } = useLinks()

  const toggleModal = () => {
    setIsModalOpen(undefined)
  }

  const getEditorBlocks = (): Array<NodeEntry<TNode<AnyObject>>> => {
    const blocks = Object.values(blocksFromStore)
    const blockIter = getNodes(editor, {
      at: [],
      match: (node) => {
        return blocks.find((block) => {
          return block.id === node.id
        })
      },
      block: true
    })

    const blockEnteries = Array.from(blockIter).map(([block, _path]) => {
      return [updateIds(block), _path]
    })

    return blockEnteries as NodeEntry<TNode<AnyObject>>[]
  }

  const getContentFromBlocks = (
    nodeid: string,
    blocks: NodeEntry<TNode<AnyObject>>[],
    isAppend = true
  ): NodeEditorContent => {
    const blocksContent = blocks.map(([block, _path]) => block)

    if (!isAppend) return blocksContent

    const content = useContentStore.getState().getContent(nodeid)
    return [...(content?.content ?? defaultContent.content), ...blocksContent]
  }

  const deleteContentBlocks = (blocks: NodeEntry<TNode<AnyObject>>[]): void => {
    const selection = editor?.selection
    const moveAction =
      isModalOpen === ContextMenuActionType.move /* Move content blocks */ ||
      isModalOpen === ContextMenuActionType.del /* Delete content blocks */

    if (moveAction) {
      if (blocks.length) {
        blocks.forEach(([block, path], index) => {
          const at = path[0] - index === -1 ? 0 : path[0] - index
          Transforms.delete(editor, { at: [at] })
        })
      } else if (selection) {
        Transforms.removeNodes(editor, { at: selection })
      }
    }

    const isEmpty = editor.children.length === 0

    if (isEmpty)
      insertNodes(editor, { type: ELEMENT_PARAGRAPH, id: generateTempId(), children: [{ text: '' }] }, { at: [0] })
  }

  const onBlockDelete = (): void => {
    const editorBlocks = getEditorBlocks()

    deleteContentBlocks(editorBlocks)
    setIsModalOpen(undefined)
    setIsBlockMode(false)
  }

  const onCancel = (): void => {
    setIsModalOpen(undefined)
    setIsBlockMode(false)
  }

  const onNodeCreate = (quickLink: QuickLink): void => {
    const editorBlocks = getEditorBlocks()
    const blocksContent = getContentFromBlocks(quickLink.value, editorBlocks, false)

    deleteContentBlocks(editorBlocks)
    setIsModalOpen(undefined)
    setIsBlockMode(false)

    //   addNode({ ilink: quickLink.value, showAlert: true }, (node) => {
    //     saveEditorValueAndUpdateStores(node.nodeid, blocksContent)
    //     // appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)
    //     // saveData()
    //   })
  }

  const onNodeSelect = (quickLink: QuickLink) => {
    const nodeid = getNodeidFromPath(quickLink.value)
    const editorBlocks = getEditorBlocks()
    const content = getContentFromBlocks(nodeid, editorBlocks)

    deleteContentBlocks(editorBlocks)
    setIsModalOpen(undefined)
    setIsBlockMode(false)

    saveEditorValueAndUpdateStores(nodeid, content)
    // saveData()
    mog('content length', { content: getPlateSelectors().value(), len: getPlateSelectors().value() })
  }

  const length = Object.values(blocksFromStore).length

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={toggleModal} isOpen={!!isModalOpen}>
      {length ? (
        isModalOpen === ContextMenuActionType.del ? (
          <>
            <h1>{`${isModalOpen}`}</h1>
            <p>{`Are you sure you want to delete ${length} block(s)?`}</p>
            <ButtonWrapper>
              <Button large onClick={onCancel}>
                Cancel
              </Button>
              <Button primary large onClick={onBlockDelete}>
                Delete
              </Button>
            </ButtonWrapper>
            <br />
          </>
        ) : (
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
        )
      ) : (
        <h1>Select Blocks</h1>
      )}
    </Modal>
  )
}

export default BlockModal
