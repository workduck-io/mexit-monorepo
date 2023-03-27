import { config } from './config'

type AllNamespaceOption = 'onlyShared' | 'onlyWorkspace'

const { MEXIT_BACKEND_URL_BASE, MEX_API_GATEWAY_URL_BASE, MEXIT_FRONTEND_URL_BASE, MEXIT_LINK_SHORTENER_URL_BASE } =
  config.baseURLs

export const API_BASE_URLS = {
  bookmarks: `${MEXIT_BACKEND_URL_BASE}/userStar`,
  archive: `${MEXIT_BACKEND_URL_BASE}/node/archive`,
  unarchive: `${MEXIT_BACKEND_URL_BASE}/node/unarchive`,
  namespace: `${MEXIT_BACKEND_URL_BASE}/namespace`,
  node: `${MEXIT_BACKEND_URL_BASE}/node`,
  snippet: `${MEXIT_BACKEND_URL_BASE}/snippet`,
  loch: `${MEXIT_BACKEND_URL_BASE}/loch`,
  share: `${MEXIT_BACKEND_URL_BASE}/shared`,
  user: `${MEXIT_BACKEND_URL_BASE}/user`,
  view: `${MEXIT_BACKEND_URL_BASE}/view`,
  link: `${MEXIT_BACKEND_URL_BASE}/link`,
  reminder: `${MEXIT_BACKEND_URL_BASE}/reminder`,
  smartcapture: `${MEXIT_BACKEND_URL_BASE}/capture`,
  comment: `${MEXIT_BACKEND_URL_BASE}/comment`,
  reaction: `${MEXIT_BACKEND_URL_BASE}/reaction`,
  highlight: `${MEXIT_BACKEND_URL_BASE}/highlight`,
  prompt: `${MEXIT_BACKEND_URL_BASE}/prompt`,
  actions: `${MEXIT_FRONTEND_URL_BASE}/actions`,
  oauth: `${MEXIT_FRONTEND_URL_BASE}/oauth`,
  apiGateway: MEX_API_GATEWAY_URL_BASE,
  url: `${MEXIT_LINK_SHORTENER_URL_BASE}/link`,
  cdn: 'https://cdn.workduck.io',
  public: `${MEXIT_BACKEND_URL_BASE}/public`,
  shareFrontend: `${MEXIT_FRONTEND_URL_BASE}/share`,
  frontend: MEXIT_FRONTEND_URL_BASE
}

export const apiURLs = {
  bookmarks: {
    create: (nodeID: string) => `${API_BASE_URLS.bookmarks}/${nodeID}`,
    getAll: `${API_BASE_URLS.bookmarks}`
  },

  archive: {
    archiveNodes: `${API_BASE_URLS.archive}`,
    deleteArchivedNodes: `${API_BASE_URLS.archive}/delete`,
    getArchivedNodes: `${API_BASE_URLS.archive}`,
    unArchiveNodes: `${API_BASE_URLS.unarchive}`,
    unArchiveInNamespace: (namespaceID: string) => `${API_BASE_URLS.unarchive}?namespaceID=${namespaceID}`,
    archiveInNamespace: (namespaceID: string) => `${API_BASE_URLS.archive}?namespaceID=${namespaceID}`
  },

  openAi: {
    perform: (actionId: string) => `${API_BASE_URLS.actions}/ai/${actionId}`
  },

  // Namespaces
  namespaces: {
    getHierarchy: `${API_BASE_URLS.namespace}/all/hierarchy?getMetadata=true`,
    get: (id: string) => `${API_BASE_URLS.namespace}/${id}`,
    getAll: (opt?: AllNamespaceOption) => `${API_BASE_URLS.namespace}/all${opt ? `?${opt}=true` : ''}`,
    create: `${API_BASE_URLS.namespace}`,
    update: `${API_BASE_URLS.namespace}`,
    deleteNamespace: (namespaceId: string) => `${API_BASE_URLS.namespace}/delete/${namespaceId}`,
    delete: `${API_BASE_URLS.namespace}/share`,
    makePublic: (id: string) => `${API_BASE_URLS.namespace}/makePublic/${id}`,
    makePrivate: (id: string) => `${API_BASE_URLS.namespace}/makePrivate/${id}`,
    share: `${API_BASE_URLS.namespace}/share`,
    getUsersOfShared: (id: string) => `${API_BASE_URLS.namespace}/shared/${id}/users`
  },

  node: {
    get: (uid: string) => `${API_BASE_URLS.node}/${uid}`,
    create: `${API_BASE_URLS.node}`,
    append: (uid: string) => `${API_BASE_URLS.node}/${uid}`,
    updateMetadata: (uid: string) => `${API_BASE_URLS.node}/metadata/${uid}`,
    bulkCreate: `${API_BASE_URLS.node}/bulk`,
    refactor: `${API_BASE_URLS.node}/refactor`,
    deleteBlock: `${API_BASE_URLS.node}/delete`,
    makePublic: (uid: string) => `${API_BASE_URLS.node}/${uid}/makePublic`,
    makePrivate: (uid: string) => `${API_BASE_URLS.node}/${uid}/makePrivate`,
    getMultipleNode: (namespaceID?: string) =>
      `${API_BASE_URLS.node}/ids${namespaceID ? `?namespaceID=${namespaceID}` : ''}`
  },

  snippet: {
    create: API_BASE_URLS.snippet,
    getAllSnippetsByWorkspace: `${API_BASE_URLS.snippet}/all`,
    getById: (uid: string) => `${API_BASE_URLS.snippet}/${uid}`,
    bulkGet: `${API_BASE_URLS.snippet}/ids`,
    updateMetadata: (uid: string) => `${API_BASE_URLS.snippet}/metadata/${uid}`,
    deleteAllVersionsOfSnippet: (uid: string) => `${API_BASE_URLS.snippet}/${uid}/all`,
    deleteSpecificVersionOfSnippet: (uid: string, version?: number) =>
      `${API_BASE_URLS.snippet}/${uid}${version ? `?version=${version}` : ''}`
  },
  smartcapture: {
    public: `${API_BASE_URLS.smartcapture}/all/public`
  },
  loch: {
    getAllServices: `${API_BASE_URLS.loch}/all`,
    getConnectedServices: `${API_BASE_URLS.loch}`,
    connectToService: `${API_BASE_URLS.loch}`,
    updateParentNoteOfService: `${API_BASE_URLS.loch}`
  },
  prompt: {
    getAllPrompts: `${API_BASE_URLS.prompt}/all`, // Returns `downloaded` and `created` prompts
    promptUserAuthInfo: `${API_BASE_URLS.prompt}/userAuth`,
    generateResult: (promptId: string) => `${API_BASE_URLS.prompt}/result/${promptId}`,
    getAllPromptsProvider: `${API_BASE_URLS.prompt}/providers`
  },
  share: {
    sharedNode: `${API_BASE_URLS.share}`,
    allSharedNodes: `${API_BASE_URLS.share}/all`,
    getSharedNode: (nodeid: string) => `${API_BASE_URLS.share}/${nodeid}`,
    updateNode: `${API_BASE_URLS.share}/update`,
    getUsersOfSharedNode: (nodeid: string) => `${API_BASE_URLS.share}/${nodeid}/users`,
    getBulk: `${API_BASE_URLS.share}/ids`
  },

  user: {
    getUserRecords: `${API_BASE_URLS.user}/`,
    getAllUserRecordsOfWorkspace: `${API_BASE_URLS.user}/all`,
    getFromEmail: (email: string) => `${API_BASE_URLS.user}/email/${encodeURIComponent(email)}`,
    getFromUserId: (userId: string) => `${API_BASE_URLS.user}/${encodeURIComponent(userId)}`,
    updateInfo: `${API_BASE_URLS.user}/info`,
    updatePreference: `${API_BASE_URLS.user}/preference`,
    getUserByLinkedin: (url: string) => `${API_BASE_URLS.user}/linkedin/${url}`,
    registerStatus: `${API_BASE_URLS.user}/status`
  },

  view: {
    saveView: `${API_BASE_URLS.view}`,
    deleteView: (id: string) => `${API_BASE_URLS.view}/${id}`,
    getAllViews: `${API_BASE_URLS.view}/all/workspace`,
    getView: (id: string) => `${API_BASE_URLS.view}/${id}`
  },

  links: {
    getLinks: `${API_BASE_URLS.link}`,
    saveLink: `${API_BASE_URLS.link}/shorten`,
    deleteLink: (linkId: string) => `${API_BASE_URLS.link}/${linkId}`,
    shortendLink: (shortId: string, workspaceId: string) => `${API_BASE_URLS.url}/${workspaceId}/${shortId}`
  },

  reminders: {
    saveReminder: API_BASE_URLS.reminder,
    reminderByID: (id: string) => `${API_BASE_URLS.reminder}/${id}`,
    remindersOfNode: (nodeID: string) => `${API_BASE_URLS.reminder}/node/${nodeID}`,
    remindersOfWorkspace: `${API_BASE_URLS.reminder}/workspace`
  },

  comments: {
    /** POST */
    saveComment: `${API_BASE_URLS.comment}/`,

    /** GET, DELETE */
    comment: (nodeid: string, commentId: string) => `${API_BASE_URLS.comment}/${nodeid}/${commentId}`,

    /** GET, DELETE */
    allNote: (nodeId: string) => `${API_BASE_URLS.comment}/node/${nodeId}`,

    /** GET, DELETE */
    allBlock: (nodeId: string, blockId: string) => `${API_BASE_URLS.comment}/node/${nodeId}/block/${blockId}`,

    /** GET, DELETE */
    allThread: (nodeId: string, blockId: string, threadId: string) =>
      `${API_BASE_URLS.comment}/node/${nodeId}/block/${blockId}/thread/${threadId}`
  },

  reactions: {
    /** POST */
    react: `${API_BASE_URLS.reaction}/`,

    /** GET */
    allNote: (nodeId: string) => `${API_BASE_URLS.reaction}/node/${nodeId}`,

    /** GET */
    allBlock: (nodeId: string, blockId: string) => `${API_BASE_URLS.reaction}/node/${nodeId}/block/${blockId}`,

    /** GET */
    blockReactionDetails: (nodeId: string, blockId: string) =>
      `${API_BASE_URLS.reaction}/node/${nodeId}/block/${blockId}/details`
  },

  highlights: {
    /** POST */
    saveHighlight: `${API_BASE_URLS.highlight}`,

    /** GET, DELETE */
    byId: (entityId: string) => `${API_BASE_URLS.highlight}/${entityId}`,

    /** GET */
    all: `${API_BASE_URLS.highlight}`,

    /** GET, DELETE */
    allOfUrl: (urlHash: string) => `${API_BASE_URLS.highlight}/all/${urlHash}`
  },

  public: {
    getPublicNS: (id: string) => `${API_BASE_URLS.public}/namespace/${id}`,
    getPublicNode: (uid: string) => `${API_BASE_URLS.public}/${uid}`
  },

  frontend: {
    getNoteUrl: (uid: string) => `${API_BASE_URLS.frontend}/editor/${uid}`,
    getPublicNodePath: (uid: string) => `${API_BASE_URLS.shareFrontend}/${uid}`,
    getPublicNSURL: (id: string) => `${API_BASE_URLS.shareFrontend}/namespace/${id}`,
    getPublicURLofNoteInNS: (namespaceid: string, noteid: string) =>
      `${API_BASE_URLS.shareFrontend}/namespace/${namespaceid}/node/${noteid}`
  },

  misc: {
    createImageLink: `${API_BASE_URLS.apiGateway}/testing/upload/s3`,
    getImagePublicLink: (path: string) => `${API_BASE_URLS.cdn}/${path}`
  }
}
