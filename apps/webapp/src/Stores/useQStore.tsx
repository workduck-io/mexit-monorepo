import create from 'zustand'
import { useDataSaverFromContent } from '../Hooks/useSave'

interface QStoreProps {
  q: string[]
  setQ: (q: string[]) => void
  add2Q: (nodeid: string) => void
  clearQ: () => void
}

export const useQStore = create<QStoreProps>((set, get) => ({
  q: [],
  setQ: (q) => set({ q }),
  add2Q: (nodeid) => set({ q: Array.from(new Set([...get().q, nodeid])) }),
  clearQ: () => set({ q: [] })
}))

export const useSaveQ = () => {
  const q = useQStore((s) => s.q)
  const clearQ = useQStore((s) => s.clearQ)

  // const getContent = useContentStore((s) => s.getContent)
  const { saveNodeAPIandFs } = useDataSaverFromContent()

  const saveQ = () => {
    ;[...q].map((nodeid) => {
      saveNodeAPIandFs(nodeid)
    })
    // console.log('saving q', { q })
    clearQ()
  }

  return { q, saveQ }
}
