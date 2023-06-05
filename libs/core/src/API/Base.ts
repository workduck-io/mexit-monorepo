import { type KyInstance } from 'ky/distribution/types/ky'

import { KYClient } from '@workduck-io/dwindle'

import { AiAPI } from './AI'
import { BookmarkAPI } from './Bookmarks'
import { CalendarAPI } from './Calendar'
import { CommentAPI } from './Comment'
import { HighlightAPI } from './Highlight'
import { InviteAPI } from './Invite'
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
import { WorkspaceAPI } from './Workspace'

let instance: APIClass
class APIClass {
  private client: KYClient
  public node: NodeAPI
  public share: ShareAPI
  public snippet: SnippetAPI
  public bookmark: BookmarkAPI
  public reaction: ReactionAPI
  public comment: CommentAPI
  public calendar: CalendarAPI
  public namespace: NamespaceAPI
  public view: ViewAPI
  public loch: LochAPI
  public ai: AiAPI
  public link: LinkAPI
  public prompt: PromptAPI
  public reminder: ReminderAPI
  public user: UserAPI
  public invite: InviteAPI
  public highlight: HighlightAPI
  public smartcapture: SmartCaptureAPI
  public workspace: WorkspaceAPI

  constructor() {
    if (instance) {
      throw new Error('New instance cannot be created!!')
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this
  }
  init(client?: KyInstance) {
    this.client = new KYClient({ timeout: 20000, retry: 0 }, client)
    this.node = new NodeAPI(this.client)
    this.share = new ShareAPI(this.client)
    this.snippet = new SnippetAPI(this.client)
    this.bookmark = new BookmarkAPI(this.client)
    this.reaction = new ReactionAPI(this.client)
    this.comment = new CommentAPI(this.client)
    this.calendar = new CalendarAPI(this.client)
    this.namespace = new NamespaceAPI(this.client)
    this.loch = new LochAPI(this.client)
    this.prompt = new PromptAPI(this.client)
    this.view = new ViewAPI(this.client)
    this.link = new LinkAPI(this.client)
    this.ai = new AiAPI(this.client)
    this.reminder = new ReminderAPI(this.client)
    this.user = new UserAPI(this.client)
    this.invite = new InviteAPI(this.client)
    this.highlight = new HighlightAPI(this.client)
    this.smartcapture = new SmartCaptureAPI(this.client)
    this.workspace = new WorkspaceAPI(this.client)
  }

  reset() {
    this.client.reset()
  }

  setWorkspaceHeader(workspaceId: string) {
    this.client.setWorkspaceHeader(workspaceId)
  }
}

export const API = new APIClass()
