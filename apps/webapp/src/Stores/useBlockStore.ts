import { BlockMode, blockStoreConstructor } from '@mexit/core'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

const useBlockStore = create<BlockMode>(devtools(blockStoreConstructor))

export default useBlockStore
