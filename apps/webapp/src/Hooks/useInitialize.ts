import useContentStore from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { InitData } from '../Types/Data'

export enum AppType {
  SPOTLIGHT = 'SPOTLIGHT',
  MEX = 'MEX'
}

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initContents = useContentStore((state) => state.initContents)
  // const setTheme = useThemeStore((state) => state.setTheme)

  const update = (data: InitData) => {
    const { tags, ilinks, linkCache, tagsCache, bookmarks, contents, archive, baseNodeId } = data

    const initData = {
      tags,
      tagsCache,
      ilinks,
      linkCache,
      archive: archive ?? [],
      baseNodeId,
      bookmarks
    }

    initializeDataStore(initData)
    initContents(contents)
    // setTheme(getTheme(data.userSettings.theme))
  }

  const init = (data: InitData, initNodeId?: string, initFor?: AppType) => {
    update(data)
    // const keyToLoad = initNodeId || '@'

    // if (initFor === AppType.SPOTLIGHT) {
    //   loadNodeProps(createNodeWithUid(keyToLoad))
    // }
  }

  return { init, update }
}
