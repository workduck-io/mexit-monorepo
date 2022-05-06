import { useApi } from '../Hooks/useApi'
import useDataStore from '../Stores/useDataStore'

export const useInternalLinks = () => {
  const setILinks = useDataStore((store) => store.setIlinks)
  const { getILinks } = useApi()
  const refreshILinks = async () => {
    const updatedILinks = await getILinks()
    setILinks(updatedILinks)
  }

  return { refreshILinks }
}
