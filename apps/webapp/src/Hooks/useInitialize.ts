import { PersistentData } from './../Types/Data'
import useContentStore from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import useThemeStore from '../Stores/useThemeStore'
import useTodoStore from '../Stores/useTodoStore'
import useLoad from './useLoad'
import { useSlashCommands } from './useSlashCommands'

export enum AppType {
  SPOTLIGHT = 'SPOTLIGHT',
  MEX = 'MEX'
}

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initTodos = useTodoStore((store) => store.initTodos)
  const initContents = useContentStore((state) => state.initContents)
  const setReminders = useReminderStore((state) => state.setReminders)
  const initSnippets = useSnippetStore((state) => state.initSnippets)
  const { generateSlashCommands } = useSlashCommands()

  const update = (data: PersistentData) => {
    const { baseNodeId, tags, todos, reminders, ilinks, linkCache, tagsCache, bookmarks, contents, archive, snippets } =
      data
    const slashCommands = generateSlashCommands(snippets)

    const initData = {
      tags,
      tagsCache,
      ilinks,
      slashCommands,
      linkCache,
      archive: archive ?? [],
      baseNodeId,
      bookmarks
    }

    initializeDataStore(initData)
    initContents(contents)
    initSnippets(snippets)
    initTodos(todos)
    setReminders(reminders)
  }

  const init = (data: PersistentData, initNodeId?: string, initFor?: AppType) => {
    update(data)
  }

  return { init, update }
}
