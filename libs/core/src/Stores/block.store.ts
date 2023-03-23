import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export type BlockMetaDataType = {
  source?: string // * NodeId or Website URL
  origin?: string
}

type BlocksType = Record<string, BlockType>

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
  blocks: {} as BlocksType,
  isModalOpen: undefined as ModalOpenType,
  isBlockMode: false as boolean,
  addBlock: (blockId: string, block: BlockType) => {
    const blocks = get().blocks
    set({ blocks: { ...blocks, [blockId]: block } })
  },
  deleteBlock: (blockId: string) => {
    const blocks = get().blocks
    const newBlocks = { ...blocks }
    delete newBlocks[blockId]
    set({ blocks: newBlocks })
  },
  setBlocks: (blocks: BlocksType) => set({ blocks }),
  getBlocks: (): BlockType[] => {
    const blocks = get().blocks
    return Object.values<BlockType>(blocks)
  },
  setIsModalOpen: (isModalOpen: ModalOpenType) => set({ isModalOpen }),
  setIsBlockMode: (isBlockMode: boolean) => {
    if (!isBlockMode) set({ blocks: {}, isBlockMode })
    else set({ isBlockMode })
  }
})

export const useBlockStore = createStore(blockStoreConfig, StoreIdentifier.BLOCK, false)
