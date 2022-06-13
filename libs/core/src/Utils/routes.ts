export const IS_DEV = (() => {
  if (import.meta.env && import.meta.env.MODE) return import.meta.env.MODE === 'development' ? true : false
  else if (process.env['NX_BUILD_MODE'] === 'development') return true
  return false
})()

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
export const BASE_USER_URL = 'https://http.workduck.io'

export const BOOKMARK_URL = BASE_API_URL
export const LINK_SHORTENER_URL_BASE = IS_DEV ? 'http://localhost:3002' : 'https://url.workduck.io/link'

export const MEXIT_BACKEND_URL_BASE = IS_DEV
  ? 'http://localhost:5000/api/v1'
  : 'https://mex-webapp-dev.workduck.io/api/v1'

export const MEXIT_FRONTEND_URL_BASE = IS_DEV ? 'http://localhost:3333' : 'https://mexit.workduck.io'
export const MEXIT_FRONTEND_AUTH_BASE = `${MEXIT_FRONTEND_URL_BASE}/oauth/google`
export const MEXIT_ACTIONS_URL_BASE = `${MEXIT_FRONTEND_URL_BASE}/actions`

export const WORKDUCK_API_BASE = 'https://api.workduck.io'
export const CDN_BASE = 'https://cdn.workduck.io'

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
  getUserRecords: `${BASE_USER_URL}/user/`,
  registerUser: `${MEXIT_BACKEND_URL_BASE}/user/register`,

  // Archive
  archiveNodes: () => `${MEXIT_BACKEND_URL_BASE}/node/archive`,
  deleteArchiveNodes: () => `${MEXIT_BACKEND_URL_BASE}/node/archive`,
  getArchivedNodes: (workspaceId: string) => `${MEXIT_BACKEND_URL_BASE}/node/archive/${workspaceId}`,
  unArchiveNodes: () => `${MEXIT_BACKEND_URL_BASE}/node/unarchive`,

  // Workspace
  createWorkspace: `${BASE_API_URL}/workspace`,
  getNodesByWorkspace: (workspaceId: string) => `${BASE_API_URL}/node/workspace/${workspaceId}/namespace/NAMESPACE1`,
  getWorkspace: (workspace_id: string) => `${BASE_API_URL}/workspace/${workspace_id}`,

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
  createNode: `${MEXIT_BACKEND_URL_BASE}/node`,
  bulkCreateNodes: `${MEXIT_BACKEND_URL_BASE}/node/bulkCreate`,
  makeNodePublic: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/node/${uid}/makePublic`,
  makeNodePrivate: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/node/${uid}/makePrivate`,
  getPublicNode: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/public/${uid}`,
  getNodePublicURL: (uid: string) => `${MEXIT_FRONTEND_URL_BASE}/share/${uid}`,

  createSnippet: `${MEXIT_BACKEND_URL_BASE}/snippet`,
  getAllSnippetsByWorkspace: `${MEXIT_BACKEND_URL_BASE}/snippet/all`,
  getSnippetById: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/snippet/${uid}`,

  getUserByLinkedin: `${MEXIT_BACKEND_URL_BASE}/user/linkedin`,
  getPublicNodePath: (uid: string) => `${MEXIT_FRONTEND_URL_BASE}/share/${uid}`,

  // Screenshot capture URLs
  createImageLink: `${BASE_USER_URL}/testing/upload/s3`,
  getImagePublicLink: (path: string) => `${CDN_BASE}/${path}`,

  // Get Ilinks from Middleware
  getILink: () => `${MEXIT_BACKEND_URL_BASE}/node/linkhierarchy`
}
