import { getMentionsFromContent, getTagsFromContent, NodeEditorContent, TodoType } from "@mexit/core"
import { createTodo } from "../../Stores/useTodoStore"

export const createDefaultTodo = (nodeid: string, content?: NodeEditorContent): TodoType => {
  const block = content?.[0]
  const tags = content ? getTagsFromContent(content) : []
  const mentions = content ? getMentionsFromContent(content) : []

  const todo = createTodo(nodeid, block.id, content, tags, mentions)

  return todo;
}
