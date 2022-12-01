import { AxiosInstance } from 'axios'

import { AxiosX } from './AxiosX'
import { BookmarkAPI } from './Bookmarks'
import { CommentAPI } from './Comment'
import { HighlightAPI } from './Highlight'
import { LinkAPI } from './Link'
import { LochAPI } from './Loch'
import { NamespaceAPI } from './Namespace'
import { NodeAPI } from './Node'
import { ReactionAPI } from './Reaction'
import { ReminderAPI } from './Reminder'
import { ShareAPI } from './Share'
import { SmartCaptureAPI } from './SmartCapture'
import { SnippetAPI } from './Snippet'
import { UserAPI } from './User'
import { ViewAPI } from './View.ts'

let instance
class APIClass {
  private client: AxiosX
  public node: NodeAPI
  public share: ShareAPI
  public snippet: SnippetAPI
  public bookmark: BookmarkAPI
  public reaction: ReactionAPI
  public comment: CommentAPI
  public namespace: NamespaceAPI
  public view: ViewAPI
  public loch: LochAPI
  public link: LinkAPI
  public reminder: ReminderAPI
  public user: UserAPI
  public highlight: HighlightAPI
  public smartcapture: SmartCaptureAPI
  constructor() {
    if (instance) {
      throw new Error('New instance cannot be created!!')
    }

    instance = this
  }
  init(client: AxiosInstance) {
    this.client = new AxiosX(client)
    this.node = new NodeAPI(this.client)
    this.share = new ShareAPI(this.client)
    this.snippet = new SnippetAPI(this.client)
    this.bookmark = new BookmarkAPI(this.client)
    this.reaction = new ReactionAPI(this.client)
    this.comment = new CommentAPI(this.client)
    this.namespace = new NamespaceAPI(this.client)
    this.loch = new LochAPI(this.client)
    this.view = new ViewAPI(this.client)
    this.link = new LinkAPI(this.client)
    this.reminder = new ReminderAPI(this.client)
    this.user = new UserAPI(this.client)
    this.highlight = new HighlightAPI(this.client)
    this.smartcapture = new SmartCaptureAPI(this.client)
  }

  setWorkspaceHeader(workspaceId: string) {
    this.client.setHeader(workspaceId)
  }
}

export const API = new APIClass()
