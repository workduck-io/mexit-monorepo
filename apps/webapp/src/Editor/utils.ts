import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_HR,
  //   ELEMENT_INDENT,
  ELEMENT_LI,
  ELEMENT_LINK,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  //   ELEMENT_TABLE_CELL,
  //   ELEMENT_TABLE_PRE,
  //   ELEMENT_TABLE_ROW,
  //   ELEMENT_TABLE_SUF,
  //   ELEMENT_TABLE_WRAP,
  //   ELEMENT_TASK_LIST,
  ELEMENT_UL
} from '@mexit/core'

const LIST_TYPES = [
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_HR,
  //   ELEMENT_INDENT,
  ELEMENT_LI,
  ELEMENT_LINK,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  //   ELEMENT_TABLE_CELL,
  //   ELEMENT_TABLE_PRE,
  //   ELEMENT_TABLE_ROW,
  //   ELEMENT_TABLE_SUF,
  //   ELEMENT_TABLE_WRAP,
  //   ELEMENT_TASK_LIST,
  ELEMENT_UL
]

type LeafType = {
  text: string
  strikeThrough?: boolean
  bold?: boolean
  italic?: boolean
}

type BlockType = {
  type: string
  parentType?: string
  link?: string
  children: Array<any>
}

export default function parseToMarkdown(chunk: any, ignoreParagraphNewline = false, listDepth = 0) {
  console.log({ chunk })

  const text = chunk.text || ''
  let type = chunk.type || ''

  let children =
    type && chunk.children
      ? // if we have a type, we're a BlockType element which _always_ has a children array.
        // $FlowFixMe
        chunk.children
          ?.map((c) => {
            const isList = LIST_TYPES.includes(c.type || '')
            const selfIsList = LIST_TYPES.includes(chunk.type || '')
            const childrenHasLink =
              Array.isArray(chunk.children) && chunk.children.some((f) => f.type && f.type === 'link')

            return parseToMarkdown(
              { ...c, parentType: type },
              // WOAH.
              // what we're doing here is pretty tricky, it relates to the block below where
              // we check for ignoreParagraphNewline and set type to paragraph.
              // We want to strip out empty paragraphs sometimes, but other times we don't.
              // If we're the descendant of a list, we know we don't want a bunch
              // of whitespace. If we're parallel to a link we also don't want
              // to respect neighboring paraphs
              ignoreParagraphNewline || isList || selfIsList || childrenHasLink,
              // track depth of nested lists so we can add proper spacing
              LIST_TYPES.includes(c.type || '') ? listDepth + 1 : listDepth
            )
          })
          .join('')
      : text

  // This is pretty fragile code, check the long comment where we iterate over children
  if (!ignoreParagraphNewline && chunk.text === '' && chunk.parentType === ELEMENT_PARAGRAPH) {
    type = ELEMENT_PARAGRAPH
    children = '<br>'
  }

  if (children === '' && type != ELEMENT_HR) return

  if (chunk.bold) {
    children = retainWhitespaceAndFormat(children, '**')
  }

  if (chunk.italic) {
    children = retainWhitespaceAndFormat(children, '_')
  }

  if (chunk.strikeThrough) {
    children = `~~${children}~~`
  }

  console.log({ type })
  switch (type) {
    case 'h1':
      return `# ${children}\n`
    case 'h2':
      return `## ${children}\n`
    case ELEMENT_HR:
      return `\n---\n`
    case 'block_quote':
      // For some reason, marked is parsing blockquotes w/ one new line
      // as contiued blockquotes, so adding two new lines ensures that doesn't
      // happen
      return `> ${children}\n\n`
    case 'link':
      return `[${children}](${chunk.link || ''})`
    case ELEMENT_UL:
    case ELEMENT_OL:
      return `${children}`
    case ELEMENT_LI: {
      // $FlowFixMe // We're not a LeafType here and flow doesn't get that
      const isOL = chunk && chunk.parentType === ELEMENT_OL

      let spacer = ''
      for (let k = 1; listDepth > k; k++) {
        if (isOL) {
          // https://github.com/remarkjs/remark-react/issues/65
          spacer += '   '
        } else {
          spacer += '  '
        }
      }
      return `${spacer}${isOL ? '1.' : '-'} ${children}`
    }
    case ELEMENT_PARAGRAPH:
      return `${children}\n`
    default:
      return `${children}\n`
  }
}

// This function handles the case of a string like this: "   foo   "
// Where it would be invalid markdown to generate this: "**   foo   **"
// We instead, want to trim the whitespace out, apply formatting, and then
// bring the whitespace back. So our returned string looks like this: "   **foo**   "
function retainWhitespaceAndFormat(string: string, format: string) {
  const left = string.trimLeft()
  const right = string.trimRight()
  let children = string.trim()

  const fullFormat = `${format}${children}${format}`

  if (children.length === string.length) {
    return fullFormat
  }

  const leftFormat = `${format}${children}`

  if (left.length !== string.length) {
    const diff = string.length - left.length
    children = `${new Array(diff + 1).join(' ')}${leftFormat}`
  } else {
    children = leftFormat
  }

  const rightFormat = `${children}${format}`

  if (right.length !== string.length) {
    const diff = string.length - right.length
    children = `${rightFormat}${new Array(diff + 1).join(' ')}`
  } else {
    children = rightFormat
  }

  return children
}
