import { ELEMENT_TODO_LI } from '@udecode/plate'
import { uniq } from 'lodash'
import { ELEMENT_TAG } from '@workduck-io/mex-editor'
import { NodeEditorContent, generateTempId } from '@mexit/core'

export const getTagsFromContent = (content: any[]): string[] => {
    let tags: string[] = []

    content.forEach((n) => {
        if (n.type === 'tag' || n.type === ELEMENT_TAG) {
            tags.push(n.value)
        }
        if (n.children && n.children.length > 0) {
            tags = tags.concat(getTagsFromContent(n.children))
        }
    })

    return uniq(tags)
}

export const getTodosFromContent = (content: NodeEditorContent): NodeEditorContent => {
    const todos: NodeEditorContent = []

    content.forEach((n) => {
        if (n.type === ELEMENT_TODO_LI) {
            todos.push(n)
        }
    })

    return todos
}

// Inserts temporary ids to all elements
export const insertId = (content: any[]) => {
    if (content.length === 0) {
        return content
    }
    return content.map((item) => {
        if (item.children) item.children = insertId(item.children)
        return {
            ...item,
            id: generateTempId()
        }
    })
}

// Removes existing element IDs
export const removeId = (content: any[]) => {
    if (content.length === 0) {
        return content
    }
    return content.map((item) => {
        if (item.children) item.children = removeId(item.children)
        if (item.id) delete item.id
        return item
    })
}
