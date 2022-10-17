import { ELEMENT_PARAGRAPH, ELEMENT_TABLE, ELEMENT_TH, ELEMENT_TR } from '@mexit/core'

/** Only converts simple text content
 * TODO: Generic converter irrespective of type
 * */
export const convert2DArrayToTable = (data: string[][]) => {
  return {
    type: ELEMENT_TABLE,
    children: data.map((row) => {
      return {
        type: ELEMENT_TR,
        children: row.map((cell) => {
          return {
            type: ELEMENT_TH,
            children: [
              {
                type: ELEMENT_PARAGRAPH,
                children: [{ content: cell }]
              }
            ]
          }
        })
      }
    })
  }
}

/** Only converts to simple text content
 * TODO: Generic converter irrespective of type
 * */
export const convertTableTo2DArray = (tableBlock, DELIMITER = '\n') => {
  return tableBlock.children((rowBlock) => {
    return rowBlock.children((cellBlock) =>
      cellBlock.children.reduce((p, c) => p + DELIMITER + c.children[0].content, '')
    ) //Reduce function to collect all the children into a single item
  })
}
