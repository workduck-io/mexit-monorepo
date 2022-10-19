import { customAlphabet } from 'nanoid'

const nolookalikes = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
const nanoid = customAlphabet(nolookalikes, 21)
const shortId = customAlphabet(nolookalikes, 5)

export const SEPARATOR = '.'
export const ID_SEPARATOR = '_'
export const NODE_ID_PREFIX = 'NODE'
export const WORKSPACE_ID_PREFIX = 'WORKSPACE'
export const IG_ID_PREFIX = 'INTENTGROUP'
export const SYNC_BLOCK_ID_PREFIX = 'SYNC'
export const TEMP_ID_PREFIX = 'TEMP'
export const SNIPPET_PREFIX = 'SNIPPET'
export const SYNCTEMP_PREFIX = 'SYNCTEMP'
export const TODO_PREFIX = 'TODO'
export const DRAFT_PREFIX = 'Drafts'
export const MEETING_PREFIX = 'Meeting'
export const QUESTION_ID_PREFIX = 'WD_MEX_QUESTION'
export const DRAFT_NODE = 'Untitled'
export const REMINDER_ID_PREFIX = 'REMINDER'
export const NAMESPACE_ID_PREFIX = 'NAMESPACE'
export const TASK_VIEW_PREFIX = 'TASKVIEW'
export const CreateNewPrefix = `Create `
export const SnippetCommandPrefix = `snip`
export const FILTER_ID_PREFIX = 'FILTER'

export const HASH_SEPARATOR = '#'

export const getSnippetCommand = (title: string) => `${SnippetCommandPrefix}${SEPARATOR}${title}`
export const generateNodeUID = () => `${NODE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateNodeId = () => `${NODE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateWorkspaceId = () => `${WORKSPACE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateNamespaceId = () => `${NAMESPACE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateIgId = () => `${IG_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateSyncBlockId = () => `${SYNC_BLOCK_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateTempId = () => `${TEMP_ID_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateSnippetId = () => `${SNIPPET_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateSyncTempId = () => `${SYNCTEMP_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateTodoId = () => `${TODO_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateQuestionId = () => `${QUESTION_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateReminderId = () => `${REMINDER_ID_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateTaskViewId = () => `${TASK_VIEW_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateFilterId = () => `${FILTER_ID_PREFIX}${ID_SEPARATOR}${shortId()}`

export const cleanString = (str: string) =>
  str?.startsWith(`${DRAFT_PREFIX}${SEPARATOR}`) ? str.replace(`${DRAFT_PREFIX}${SEPARATOR}`, '') : str
