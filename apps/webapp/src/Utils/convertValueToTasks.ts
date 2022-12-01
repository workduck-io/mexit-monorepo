import { ELEMENT_MEDIA_EMBED, ELEMENT_TODO_LI,generateTempId, NodeEditorContent } from '@mexit/core'

import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_PARAGRAPH, ELEMENT_UL } from '@udecode/plate'

/**
 * Converts the content to a list of tasks
 *
 * Supports both internal content
 * and deserialized content from spotlight
 *
 * Flattens the lists when converting to tasks
 *
 * Skip Logic:
 *   - Elements that are not convertable -> Are left as is
 *   - Empty paragraphs -> Are removed
 */
export const convertValueToTasks = (val: NodeEditorContent): NodeEditorContent => {
  return val.reduce((p, node) => {
    const basicConvertedNode = {
      type: ELEMENT_TODO_LI,
      id: generateTempId(),
      children: [node]
    }
    if (node.type === ELEMENT_TODO_LI) {
      return [...p, node]
    } else if (node.type === undefined && node.text !== '') {
      return [...p, basicConvertedNode]
    } else if (node.type === ELEMENT_PARAGRAPH) {
      // Check for text in paragraph itself
      if (node.text !== undefined) {
        if (node.text.length > 0) {
          return basicConvertedNode
        } else return p
      } else {
        const children = node.children.reduce((p2, item) => {
          if (item.text !== undefined) {
            // console.log('item.text', { item })
            // Check for empty text
            if (item.text !== '') {
              // console.log('Adding for item.text', { p2, item })
              return [...p2, item]
            } else return p2
          } else return [...p2, item]
        }, [])

        // console.log('children', { node, children })

        if (children.length > 0)
          return [
            ...p,
            {
              ...basicConvertedNode,
              children
            }
          ]
        else return p
      }
    } else if (node.type === ELEMENT_UL || node.type === ELEMENT_OL) {
      // console.log('Lists bro', { node })
      const convertedItems = node.children.reduce((p2, item) => {
        // console.log('item', { item })
        if (item.type === ELEMENT_LI) {
          const child1 = item.children
          if (child1 !== undefined && child1?.length > 0) {
            const child1converted = child1.reduce((p3, child2) => {
              // mog('child1converted go brr', { child2, p3 })
              // Note that only internal lists have the LIC type
              if (child2.type === ELEMENT_LIC) {
                return [
                  ...p3,
                  {
                    type: ELEMENT_TODO_LI,
                    id: generateTempId(),
                    children: child2.children
                  }
                ]
              } else if (child2.type === ELEMENT_UL || child2.type === ELEMENT_OL) {
                // If list is embedded in another list
                // Recursive go brrrr
                const convertedTasksForList = convertValueToTasks([child2])
                return [...p3, ...convertedTasksForList]
              } else if (child2.type === ELEMENT_PARAGRAPH) {
                // This is applied for external content which does not insert LIC
                return [...p3, ...convertValueToTasks([child2])]
              } else if (child2.text !== undefined) {
                return [
                  ...p3,
                  {
                    type: ELEMENT_TODO_LI,
                    id: generateTempId(),
                    children: [child2]
                  }
                ]
              }
              return [...p3]
            }, [])
            return [...p2, ...child1converted]
          }
        }
        return p2
      }, [])
      return [...p, ...convertedItems]
    } else if (node.type === ELEMENT_MEDIA_EMBED) {
      // We skip the unconvertable nodes and let them be
      return [...p, node]
    }

    return [...p, basicConvertedNode]
  }, [])
}
