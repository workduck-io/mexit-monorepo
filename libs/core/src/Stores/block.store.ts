import { StoreIdentifier } from "../Types/Store"
import { createStore } from "../Utils/storeCreator"

export type BlockMetaDataType = {
  source?: string // * NodeId or Website URL
  origin?: string
}

export type BlockType = {
  id: string
  children: BlockType[]
  type: string
  text?: string
  blockMeta?: BlockMetaDataType
}

export enum ContextMenuActionType {
  move = 'Move',
  send = 'Send'
}

export type ModalOpenType = ContextMenuActionType | undefined

export const blockStoreConfig = (set, get) => ({
  blocks: {} as Record<string, BlockType>,
  setBlocks: (blocks: Record<string, BlockType>) => set({ blocks }),
  addBlock: (blockId: string, block: BlockType) => {
    const blocks = get().blocks
    set({ blocks: { ...blocks, [blockId]: block } })
  },
  getBlocks: () => {
    const blocks = get().blocks
    return Object.values<BlockType>(blocks)
  },
  deleteBlock: (blockId: string) => {
    const blocks = get().blocks
    const newBlocks = { ...blocks }
    delete newBlocks[blockId]
    set({ blocks: newBlocks })
  },
  isModalOpen: undefined as ModalOpenType,
  setIsModalOpen: (isModalOpen: ModalOpenType) => set({ isModalOpen }),
  isBlockMode: false as boolean,
  setIsBlockMode: (isBlockMode: boolean) => {
    if (!isBlockMode) set({ blocks: {}, isBlockMode })
    else set({ isBlockMode })
  }
})


export const useBlockStore = createStore(blockStoreConfig, StoreIdentifier.CONTENTS, true)