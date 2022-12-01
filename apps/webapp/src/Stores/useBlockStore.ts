import { BlockMode, blockStoreConstructor } from '@mexit/core'

import create from 'zustand'

const useBlockStore = create<BlockMode>(blockStoreConstructor)

export default useBlockStore
