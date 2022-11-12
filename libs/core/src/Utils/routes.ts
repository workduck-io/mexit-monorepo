export const IS_DEV = (() => {
  if (import.meta.env && import.meta.env.MODE) return import.meta.env.MODE === 'development' ? true : false
  else if (process.env['NX_BUILD_MODE'] === 'development') return true
  return false
})()

type AllNamespaceOption = 'onlyShared' | 'onlyWorkspace'

export const USE_API = () => {
  /** Useful for tracking stopped API calls */
  // if (IS_DEV) console.info('API is set to false')
  // return true
  return !IS_DEV
}

export const BASE_INTEGRATION_URL = 'https://http.workduck.io/integration'

export const integrationURLs = {
  createTemplate: `${BASE_INTEGRATION_URL}/sync/template`,
  getIntentValues: `${BASE_INTEGRATION_URL}/intents/value`,
  listen: (param: string) => `${BASE_INTEGRATION_URL}/listen?${param}`,
  intentGroup: (isNew: boolean) => `${BASE_INTEGRATION_URL}/sync/intent/multiple?isNew=${isNew ? 'true' : 'false'}`,
  getWorkspaceAuth: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/auth`,
  getAllServiceData: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/services/all`,
  getTemplateDetails: (templateId: string) => `${BASE_INTEGRATION_URL}/templates/${templateId}/details`,
  getAllTemplates: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/templates/all`
}

export const BASE_API_URL = 'https://http-test.workduck.io/mex'
export const BASE_USER_URL = 'https://http.workduck.io/user'

export const BOOKMARK_URL = BASE_API_URL
export const LINK_SHORTENER_URL_BASE = 'https://url.workduck.io/link'

export const MEXIT_BACKEND_URL_BASE = IS_DEV
  ? 'http://localhost:5002/api/v1'
  : 'https://mexit-backend-test.workduck.io/api/v1'

export const MEXIT_STAGING_URL_BASE = 'https://http-staging.workduck.io/mex'

export const MEXIT_FRONTEND_URL_BASE = IS_DEV ? 'http://localhost:3333' : 'https://mexit.workduck.io'
export const MEXIT_FRONTEND_AUTH_BASE = `${MEXIT_FRONTEND_URL_BASE}/oauth/google`
export const MEXIT_ACTIONS_URL_BASE = `${MEXIT_FRONTEND_URL_BASE}/actions`

export const WORKDUCK_API_BASE = 'https://api.workduck.io'
export const CDN_BASE = 'https://cdn.workduck.io'

export const MEX_LOCH_BASE_URL = 'https://http-test.workduck.io/loch'

export const USER_SERVICE_HELPER_URL = 'https://3jeonl1fee.execute-api.us-east-1.amazonaws.com'
export const USER_SERVICE_EMAIL_URL = (email: string) =>
  `https://http.workduck.io/user/email/${encodeURIComponent(email)}`

export const BASE_URLS = {
  reminder: `${MEXIT_BACKEND_URL_BASE}/reminder`,

  // TODO: Update these to main endpoint after testing
  // Or after being added to the middleware
  comment: `https://http-test.workduck.io/comment`,
  reaction: `https://http-test.workduck.io/reaction`
}

export const apiURLs = {
  // * User Preference
  getUserPreferences: (userId: string) => `/userPreference/all/${userId}`,
  getPreference: (userId: string, preferenceType: string) => `/userPreference/${userId}/${preferenceType}`,
  saveUserPrefernces: () => `/userPreference`,

  // Bookmarks
  // post to add
  // path to delete
  bookmark: (userId: string, uid: string) => `${BOOKMARK_URL}/userBookmark/${userId}/${uid}`,
  getBookmarks: (userId: string) => `${BOOKMARK_URL}/userBookmark/${userId}`,

  // User
  getUserRecords: `${BASE_USER_URL}/`,
  registerUser: `${MEXIT_BACKEND_URL_BASE}/user/register`,

  // Archive
  archiveNodes: `${MEXIT_BACKEND_URL_BASE}/node/archive`,
  deleteArchivedNodes: `${MEXIT_BACKEND_URL_BASE}/node/archive/delete`,
  getArchivedNodes: `${MEXIT_BACKEND_URL_BASE}/node/archive`,
  unArchiveNodes: `${MEXIT_BACKEND_URL_BASE}/node/unarchive`,
  archiveInNamespace: (namespaceId: string) => `${MEXIT_BACKEND_URL_BASE}/node/archive/${namespaceId}`,

  // Refactor
  refactorHeirarchy: `${MEXIT_BACKEND_URL_BASE}/node/refactor`,

  // Workspace
  createWorkspace: `${BASE_API_URL}/workspace`,
  getNodesByWorkspace: (workspaceId: string) => `${BASE_API_URL}/node/workspace/${workspaceId}/namespace/NAMESPACE1`,
  getHierarchy: `${BASE_API_URL}/workspace/hierarchy`,

  // Namespaces
  namespaces: {
    getHierarchy: `${MEXIT_BACKEND_URL_BASE}/namespace/all/hierarchy?getMetadata=true`,
    get: (id: string) => `${MEXIT_BACKEND_URL_BASE}/namespace/${id}`,
    getAll: (opt?: AllNamespaceOption) => `${MEXIT_BACKEND_URL_BASE}/namespace/all${opt ? `?${opt}=true` : ''}`,
    // https://localhost:4000/v1/namespace/all?onlyShared=&onlyWorkspace=
    create: `${MEXIT_BACKEND_URL_BASE}/namespace`,
    update: `${MEXIT_BACKEND_URL_BASE}/namespace`,
    delete: `${MEXIT_BACKEND_URL_BASE}/namespace/share`,
    makePublic: (id: string) => `${MEXIT_BACKEND_URL_BASE}/namespace/makePublic/${id}`,
    makePrivate: (id: string) => `${MEXIT_BACKEND_URL_BASE}/namespace/makePrivate/${id}`,
    getPublic: (id: string) => `${MEXIT_BACKEND_URL_BASE}/public/namespace/${id}`,
    share: `${MEXIT_BACKEND_URL_BASE}/namespace/share`,
    getUsersOfShared: (id: string) => `${MEXIT_BACKEND_URL_BASE}/namespace/shared/${id}/users`,

    getPublicURL: (id: string) => `${MEXIT_FRONTEND_URL_BASE}/share/namespace/${id}`,
    getPublicURLofNote: (namespaceid: string, noteid: string) =>
      `${MEXIT_FRONTEND_URL_BASE}/share/namespace/${namespaceid}/node/${noteid}`
  },

  // Link Shortener URLs
  updateShort: `${LINK_SHORTENER_URL_BASE}/update`,

  // Mexit Backend URLs
  createShort: `${MEXIT_BACKEND_URL_BASE}/node/capture/link`,
  addLinkCapture: `${MEXIT_BACKEND_URL_BASE}/node/link`,
  addContentCapture: `${MEXIT_BACKEND_URL_BASE}/node/capture`,

  mexitHome: `${MEXIT_FRONTEND_URL_BASE}/`,
  searchMexit: `${MEXIT_FRONTEND_URL_BASE}/search?q=`,

  // Mexit Backend URLs
  fetchActivities: `${MEXIT_BACKEND_URL_BASE}/node/getactivityblocks`,
  getNode: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/node/${uid}`,
  getMultipleNode: () => `${MEXIT_BACKEND_URL_BASE}/node/ids`,
  createNode: `${MEXIT_BACKEND_URL_BASE}/node`,
  appendNode: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/node/${uid}`,
  bulkCreateNodes: `${MEXIT_BACKEND_URL_BASE}/node/bulk`,
  makeNotePublic: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/node/${uid}/makePublic`,
  makeNotePrivate: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/node/${uid}/makePrivate`,
  getPublicNode: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/public/${uid}`,
  getNodePublicURL: (uid: string) => `${MEXIT_FRONTEND_URL_BASE}/share/${uid}`,

  createSnippet: `${MEXIT_BACKEND_URL_BASE}/snippet`,
  getAllSnippetsByWorkspace: `${MEXIT_BACKEND_URL_BASE}/snippet/all`,
  getSnippetById: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/snippet/${uid}`,

  getUserByLinkedin: `${MEXIT_BACKEND_URL_BASE}/user/linkedin`,
  getPublicNodePath: (uid: string) => `${MEXIT_FRONTEND_URL_BASE}/share/${uid}`,

  // Screenshot capture URLs
  createImageLink: `https://http.workduck.io/testing/upload/s3`,
  getImagePublicLink: (path: string) => `${CDN_BASE}/${path}`,

  // Get Ilinks from Middleware
  getILink: () => `${MEXIT_BACKEND_URL_BASE}/node/linkhierarchy`,

  // Loch
  getLochServices: () => `${MEX_LOCH_BASE_URL}/connect/all`,
  getConnectedLochServices: () => `${MEX_LOCH_BASE_URL}/connect`,
  connectToLochService: () => `${MEX_LOCH_BASE_URL}/connect`,
  updateParentNoteOfService: () => `${MEX_LOCH_BASE_URL}/connect`,

  // Sharing and Mentions
  sharedNode: `${MEXIT_BACKEND_URL_BASE}/shared`,
  allSharedNodes: `${MEXIT_BACKEND_URL_BASE}/shared/all`,
  getSharedNode: (nodeid: string) => `${MEXIT_BACKEND_URL_BASE}/shared/${nodeid}`,
  updateSharedNode: `${MEXIT_BACKEND_URL_BASE}/shared/update`,
  getUsersOfSharedNode: (nodeid: string) => `${MEXIT_BACKEND_URL_BASE}/shared/${nodeid}/users`,

  user: {
    getFromEmail: (email: string) => `${BASE_USER_URL}/email/${encodeURIComponent(email)}`,
    getFromUserId: (userId: string) => `${BASE_USER_URL}/${encodeURIComponent(userId)}`,
    updateInfo: `${BASE_USER_URL}/info`
  },

  view: {
    saveView: `${MEXIT_BACKEND_URL_BASE}/view`,
    deleteView: (id: string) => `${MEXIT_BACKEND_URL_BASE}/view/${id}`,
    getAllViews: `${MEXIT_BACKEND_URL_BASE}/view/all/workspace`,
    getView: (id: string) => `${MEXIT_BACKEND_URL_BASE}/view/${id}`
  },

  links: {
    getLinks: `${MEXIT_BACKEND_URL_BASE}/link`,
    saveLink: `${MEXIT_BACKEND_URL_BASE}/link/shorten`,
    deleteLink: (linkId: string) => `${MEXIT_BACKEND_URL_BASE}/link/${linkId}`,
    shortendLink: (shortId: string, workspaceId: string) =>
      `https://url-staging.workduck.io/link/${workspaceId}/${shortId}`
  },

  reminders: {
    saveReminder: BASE_URLS.reminder,
    reminderByID: (id: string) => `${BASE_URLS.reminder}/${id}`,
    remindersOfNode: (nodeID: string) => `${BASE_URLS.reminder}/node/${nodeID}`,
    remindersOfWorkspace: `${BASE_URLS.reminder}/workspace`
  },

  comments: {
    /** POST */
    saveComment: `${BASE_URLS.comment}/`,

    /** GET, DELETE */
    comment: (nodeid: string, commentId: string) => `${BASE_URLS.comment}/${nodeid}/${commentId}`,

    /** GET, DELETE */
    allNote: (nodeId: string) => `${BASE_URLS.comment}/all/${nodeId}`,

    /** GET, DELETE */
    allBlock: (nodeId: string, blockId: string) => `${BASE_URLS.comment}/all/${nodeId}/block/${blockId}`,

    /** GET, DELETE */
    allThread: (nodeId: string, blockId: string, threadId: string) =>
      `${BASE_URLS.comment}/all/${nodeId}/block/${blockId}/thread/${threadId}`
  },
  reactions: {
    /** POST */
    react: `${BASE_URLS.reaction}/`,

    /** GET */
    allNote: (nodeId: string) => `${BASE_URLS.reaction}/node/${nodeId}`,

    /** GET */
    allBlock: (nodeId: string, blockId: string) => `${BASE_URLS.reaction}/node/${nodeId}/block/${blockId}`,

    /** GET */
    blockReactionDetails: (nodeId: string, blockId: string) =>
      `${BASE_URLS.reaction}/node/${nodeId}/block/${blockId}/details`
  }
}
