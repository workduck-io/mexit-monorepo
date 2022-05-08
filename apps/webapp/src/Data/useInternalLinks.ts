import { mog } from '@mexit/core'
import { useApi } from '../Hooks/useApi'
import useDataStore from '../Stores/useDataStore'

export const useInternalLinks = () => {
  const setILinks = useDataStore((store) => store.setIlinks)
  const { getILinks } = useApi()
  const refreshILinks = async () => {
    const updatedILinks: any[] = await getILinks()
    if (updatedILinks && updatedILinks.length > 0) {
      setILinks(updatedILinks)
    }
  }
  return { refreshILinks }
}
