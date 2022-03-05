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

export const BASE_API_URL = 'https://http.workduck.io/mex'
export const BASE_USER_URL = 'https://http.workduck.io/user'

export const BOOKMARK_URL = BASE_API_URL
export const LINK_SHORTENER_URL_BASE = 'https://url.workduck.io/link'

export const MEXIT_BACKEND_URL_BASE = 'http://localhost:5000/api/v1'

export const MEXIT_FRONTEND_URL_BASE = 'http://localhost:3000'
export const MEXIT_ACTIONS_URL_BASE = `${MEXIT_FRONTEND_URL_BASE}/actions`

export const apiURLs = {
  //node
  saveNode: `${BASE_API_URL}/node`,

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
  getUserRecords: (userId: string) => `${BASE_USER_URL}/user/${userId}/MEX`,
  registerUser: `${BASE_API_URL}/user/register`,

  // Archive
  archiveNodes: () => `${BASE_API_URL}/node/archive`,
  deleteArchiveNodes: () => `${BASE_API_URL}/node/archive`,
  getArchivedNodes: (workspaceId: string) => `${BASE_API_URL}/node/archive/${workspaceId}`,
  unArchiveNodes: () => `${BASE_API_URL}/node/unarchive`,

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
  fetchActivities: (userId: string) => `${MEXIT_BACKEND_URL_BASE}/activities/${userId}`,
  getNode: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/api/v1/node/${uid}`,
  // getNode: (uid: string) => `http://localhost:8000/node.json`,
  createNode: `${MEXIT_BACKEND_URL_BASE}/api/v1/node`
}
