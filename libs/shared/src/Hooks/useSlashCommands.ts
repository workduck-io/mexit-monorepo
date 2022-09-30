import { uniq } from 'lodash'

import { SlashCommand, Snippet, getSnippetCommand, QuickLinkType, defaultCommands } from '@mexit/core'

export const addIconToSlashCommand = (items: SlashCommand[], icon: string) =>
  items.map((i: SlashCommand): SlashCommand => ({ ...i, icon }))

/*
 * Function to generate combotexts with value as the number in string.
 */
export const generatorCombo = <T, K>(
  vals: T[],
  transform: (i: T) => K | T = (i) => i,
  addIndexAsValue: boolean | undefined = true
) => {
  return vals.map(transform).map((k, i) => {
    if (addIndexAsValue) return { ...k, value: String(i) }
    return k
  })
}

export const extractSnippetCommands = (snippets: Snippet[]): string[] => {
  return snippets.map((c) => getSnippetCommand(c.title))
}

export const useSlashCommands = () => {
  const generateInternalSlashCommands = (snippets: Snippet[]) => {
    const snippetCommands = extractSnippetCommands(snippets)

    const commands: SlashCommand[] = generatorCombo(
      uniq([
        ...addIconToSlashCommand(
          snippetCommands.map((command) => ({
            command,
            text: command.replace('snip.', ''),
            type: QuickLinkType.snippet
          })),
          'ri:quill-pen-line'
        )
      ])
    )

    return Array.from(commands)
  }
  const generateDefaultSlashCommands = () => {
    const commands: SlashCommand[] = generatorCombo([...defaultCommands])

    return Array.from(commands)
  }

  const generateSlashCommands = (snippets: Snippet[]) => {
    return {
      internal: generateInternalSlashCommands(snippets),
      default: generateDefaultSlashCommands()
    }
  }
  return { generateInternalSlashCommands, generateSlashCommands, generateDefaultSlashCommands }
}
