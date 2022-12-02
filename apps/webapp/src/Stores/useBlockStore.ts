import create from 'zustand'

import { BlockMode, blockStoreConstructor } from '@mexit/core'

const useBlockStore = create<BlockMode>(blockStoreConstructor)

export default useBlockStore
