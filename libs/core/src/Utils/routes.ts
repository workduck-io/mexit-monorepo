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

export const BASE_USER_URL = 'https://http.workduck.io/user'

export const LINK_SHORTENER_URL_BASE = 'https://url.workduck.io/link'

export const MEXIT_BACKEND_URL_BASE = IS_DEV
  ? 'http://localhost:5000/api/v1'
  : 'https://mexit-backend-staging.workduck.io/api/v1'

export const CDN_BASE = 'https://cdn.workduck.io'

export const MEX_LOCH_BASE_URL = 'https://http-staging.workduck.io/loch'

export const BASE_URLS = {
  bookmarks: `${MEXIT_BACKEND_URL_BASE}/userStar`,
  archive: `${MEXIT_BACKEND_URL_BASE}/node/archive`,
  unarchive: `${MEXIT_BACKEND_URL_BASE}/node/unarchive`,
  namespace: `${MEXIT_BACKEND_URL_BASE}/namespace`,
  node: `${MEXIT_BACKEND_URL_BASE}/node`,
  snippet: `${MEXIT_BACKEND_URL_BASE}/snippet`,
  loch: `${MEX_LOCH_BASE_URL}/connect`,
  share: `${MEXIT_BACKEND_URL_BASE}/shared`,
  user: `${BASE_USER_URL}`,
  view: `${MEXIT_BACKEND_URL_BASE}/view`,
  link: `${MEXIT_BACKEND_URL_BASE}/link`,
  reminder: `${MEXIT_BACKEND_URL_BASE}/reminder`,
  comment: `https://http-staging.workduck.io/comment`,
  reaction: `https://http-staging.workduck.io/reaction`,
  frontend: IS_DEV ? 'http://localhost:3333' : 'https://mexit.workduck.io'
}

export const MEXIT_FRONTEND_URL_BASE = BASE_URLS.frontend
export const MEXIT_FRONTEND_AUTH_BASE = `${MEXIT_FRONTEND_URL_BASE}/oauth/google`
export const MEXIT_ACTIONS_URL_BASE = `${MEXIT_FRONTEND_URL_BASE}/actions`

export const apiURLs = {
  bookmarks: {
    create: (nodeID: string) => `${BASE_URLS.bookmarks}/${nodeID}`,
    getAll: `${BASE_URLS.bookmarks}`
  },

  archive: {
    archiveNodes: `${BASE_URLS.archive}`,
    deleteArchivedNodes: `${BASE_URLS.archive}/delete`,
    getArchivedNodes: `${BASE_URLS.archive}`,
    unArchiveNodes: `${BASE_URLS.unarchive}`,
    archiveInNamespace: (namespaceId: string) => `${BASE_URLS.archive}/${namespaceId}`
  },

  // Namespaces
  namespaces: {
    getHierarchy: `${BASE_URLS.namespace}/all/hierarchy?getMetadata=true`,
    get: (id: string) => `${BASE_URLS.namespace}/${id}`,
    // https://localhost:4000/v1/namespace/all?onlyShared=&onlyWorkspace=
    getAll: (opt?: AllNamespaceOption) => `${BASE_URLS.namespace}/all${opt ? `?${opt}=true` : ''}`,
    create: `${BASE_URLS.namespace}`,
    update: `${BASE_URLS.namespace}`,
    delete: `${BASE_URLS.namespace}/share`,
    makePublic: (id: string) => `${BASE_URLS.namespace}/makePublic/${id}`,
    makePrivate: (id: string) => `${BASE_URLS.namespace}/makePrivate/${id}`,
    share: `${BASE_URLS.namespace}/share`,
    getUsersOfShared: (id: string) => `${BASE_URLS.namespace}/shared/${id}/users`
  },

  node: {
    get: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/node/${uid}`,
    create: `${BASE_URLS.node}`,
    append: (uid: string) => `${BASE_URLS.node}/${uid}`,
    bulkCreate: `${BASE_URLS.node}/bulk`,
    refactor: `${BASE_URLS.node}/refactor`,
    makePublic: (uid: string) => `${BASE_URLS.node}/${uid}/makePublic`,
    makePrivate: (uid: string) => `${BASE_URLS.node}/${uid}/makePrivate`,
    getMultipleNode: `${BASE_URLS.node}/ids`
  },

  snippet: {
    create: BASE_URLS.snippet,
    getAllSnippetsByWorkspace: `${BASE_URLS.snippet}/all`,
    getSnippetById: (uid: string) => `${BASE_URLS.snippet}/${uid}`,
    deleteAllVersionsOfSnippet: (uid: string) => `${BASE_URLS.snippet}/${uid}/all`,
    deleteSpecificVersionOfSnippet: (uid: string, version?: number) => {
      let baseURL = `${BASE_URLS.snippet}/${uid}`
      if (version) baseURL += `?version=${version}`

      return baseURL
    }
  },

  loch: {
    getAllServices: `${BASE_URLS.loch}/all`,
    getConnectedServices: `${BASE_URLS.loch}`,
    connectToService: `${BASE_URLS.loch}`,
    updateParentNoteOfService: `${BASE_URLS.loch}`
  },

  share: {
    sharedNode: `${BASE_URLS.share}`,
    allSharedNodes: `${BASE_URLS.share}/all`,
    getSharedNode: (nodeid: string) => `${BASE_URLS.share}/${nodeid}`,
    updateNode: `${BASE_URLS.share}/update`,
    getUsersOfSharedNode: (nodeid: string) => `${BASE_URLS.share}/${nodeid}/users`
  },

  user: {
    getUserRecords: `${BASE_URLS.user}/`,
    registerUser: `${MEXIT_BACKEND_URL_BASE}/user/register`,
    getFromEmail: (email: string) => `${BASE_URLS.user}/email/${encodeURIComponent(email)}`,
    getFromUserId: (userId: string) => `${BASE_URLS.user}/${encodeURIComponent(userId)}`,
    updateInfo: `${BASE_URLS.user}/info`,
    getUserByLinkedin: `${MEXIT_BACKEND_URL_BASE}/user/linkedin`
  },

  view: {
    saveView: `${BASE_URLS.view}`,
    deleteView: (id: string) => `${BASE_URLS.view}/${id}`,
    getAllViews: `${BASE_URLS.view}/all/workspace`,
    getView: (id: string) => `${BASE_URLS.view}/${id}`
  },

  links: {
    getLinks: `${BASE_URLS.link}`,
    saveLink: `${BASE_URLS.link}/shorten`,
    deleteLink: (linkId: string) => `${BASE_URLS.link}/${linkId}`,
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
  },

  public: {
    getPublicNS: (id: string) => `${MEXIT_BACKEND_URL_BASE}/public/namespace/${id}`,
    getPublicNode: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/public/${uid}`
  },

  frontend: {
    getPublicNodePath: (uid: string) => `${MEXIT_FRONTEND_URL_BASE}/share/${uid}`,
    getPublicNSURL: (id: string) => `${MEXIT_FRONTEND_URL_BASE}/share/namespace/${id}`,
    getPublicURLofNoteInNS: (namespaceid: string, noteid: string) =>
      `${MEXIT_FRONTEND_URL_BASE}/share/namespace/${namespaceid}/node/${noteid}`
  },

  misc: {
    createImageLink: `https://http.workduck.io/testing/upload/s3`,
    getImagePublicLink: (path: string) => `${CDN_BASE}/${path}`
  }
}
