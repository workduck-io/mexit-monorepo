import { customAlphabet } from 'nanoid'

const nolookalikes = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
const nanoid = customAlphabet(nolookalikes, 21)
const shortId = customAlphabet(nolookalikes, 5)

export const SEPARATOR = '.'
export const SLIDE_SEPARATOR = '---'
export const SECTION_SEPARATOR = '***'
export const ID_SEPARATOR = '_'
export const NODE_ID_PREFIX = 'NODE'
export const WORKSPACE_ID_PREFIX = 'WORKSPACE'
export const IG_ID_PREFIX = 'INTENTGROUP'
export const SYNC_BLOCK_ID_PREFIX = 'SYNC'
export const TEMP_ID_PREFIX = 'TEMP'
export const CONDITION_ID_PREFIX = 'CONDITION'
export const SNIPPET_PREFIX = 'SNIPPET'
export const SYNCTEMP_PREFIX = 'SYNCTEMP'
export const TODO_PREFIX = 'TODO'
export const DRAFT_PREFIX = 'Drafts'
export const PROFILE_PREFIX = 'Profile'
export const MEETING_PREFIX = 'Meeting'
export const QUESTION_ID_PREFIX = 'WD_MEX_QUESTION'
export const DRAFT_NODE = 'Untitled'
export const REMINDER_ID_PREFIX = 'REMINDER'
export const NAMESPACE_ID_PREFIX = 'NAMESPACE'
export const TASK_VIEW_PREFIX = 'TASKVIEW'
export const CreateNewPrefix = `Create `
export const SnippetCommandPrefix = `snip`
export const FILTER_ID_PREFIX = 'FILTER'
export const COMMENT_ID_PREFIX = 'COMMENT'
export const REACTION_ID_PREFIX = 'REACTION'
export const HIGHLIGHT_ID_PREFIX = 'HIGHLIGHT'
export const CONTENT_ID_PREFIX = 'CONTENT'
const MESSAGE_ID_PREFIX = 'MESSAGE'

export const HASH_SEPARATOR = '#'

export const getSnippetCommand = (title: string) => `${SnippetCommandPrefix}${SEPARATOR}${title}`
export const generateNodeUID = () => `${NODE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateNodeId = () => `${NODE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateWorkspaceId = () => `${WORKSPACE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateNamespaceId = () => `${NAMESPACE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateIgId = () => `${IG_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateSyncBlockId = () => `${SYNC_BLOCK_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateTempId = () => `${TEMP_ID_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateConditionId = () => `${CONDITION_ID_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateSnippetId = () => `${SNIPPET_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateSyncTempId = () => `${SYNCTEMP_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateTodoId = () => `${TODO_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateQuestionId = () => `${QUESTION_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateReminderId = () => `${REMINDER_ID_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateTaskViewId = () => `${TASK_VIEW_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateFilterId = () => `${FILTER_ID_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateCommentId = () => `${COMMENT_ID_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateReactionId = () => `${REACTION_ID_PREFIX}${ID_SEPARATOR}${shortId()}`
export const generateHighlightId = () => `${HIGHLIGHT_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateMessageId = () => `${MESSAGE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
export const generateContentId = () => `${CONTENT_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`

export const cleanString = (str: string) =>
  str?.startsWith(`${DRAFT_PREFIX}${SEPARATOR}`) ? str.replace(`${DRAFT_PREFIX}${SEPARATOR}`, '') : str
