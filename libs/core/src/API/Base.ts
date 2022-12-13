import { type KyInstance } from 'ky/distribution/types/ky'

import { KYClient } from '@workduck-io/dwindle'

import { BookmarkAPI } from './Bookmarks'
import { CommentAPI } from './Comment'
import { HighlightAPI } from './Highlight'
import { LinkAPI } from './Link'
import { LochAPI } from './Loch'
import { NamespaceAPI } from './Namespace'
import { NodeAPI } from './Node'
import { PromptAPI } from './Prompt'
import { ReactionAPI } from './Reaction'
import { ReminderAPI } from './Reminder'
import { ShareAPI } from './Share'
import { SmartCaptureAPI } from './SmartCapture'
import { SnippetAPI } from './Snippet'
import { UserAPI } from './User'
import { ViewAPI } from './View.ts'

let instance: APIClass
class APIClass {
  private client: KYClient
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
  public prompt: PromptAPI
  public reminder: ReminderAPI
  public user: UserAPI
  public highlight: HighlightAPI
  public smartcapture: SmartCaptureAPI
  constructor() {
    if (instance) {
      throw new Error('New instance cannot be created!!')
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this
  }
  init(client?: KyInstance) {
    this.client = new KYClient(undefined, client)
    this.node = new NodeAPI(this.client)
    this.share = new ShareAPI(this.client)
    this.snippet = new SnippetAPI(this.client)
    this.bookmark = new BookmarkAPI(this.client)
    this.reaction = new ReactionAPI(this.client)
    this.comment = new CommentAPI(this.client)
    this.namespace = new NamespaceAPI(this.client)
    this.loch = new LochAPI(this.client)
    this.prompt = new PromptAPI(this.client)
    this.view = new ViewAPI(this.client)
    this.link = new LinkAPI(this.client)
    this.reminder = new ReminderAPI(this.client)
    this.user = new UserAPI(this.client)
    this.highlight = new HighlightAPI(this.client)
    this.smartcapture = new SmartCaptureAPI(this.client)
  }

  setWorkspaceHeader(workspaceId: string) {
    this.client.setWorkspaceHeader(workspaceId)
  }
}

export const API = new APIClass()
