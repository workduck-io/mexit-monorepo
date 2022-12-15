import { uniq } from 'lodash'

import { defaultCommands, getSnippetCommand, MIcon, QuickLinkType, SlashCommand, Snippet } from '@mexit/core'

import { DefaultMIcons } from '../Components/Icons'

export const addIconToSlashCommand = (items: SlashCommand[], icon: MIcon) =>
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
    const commands: SlashCommand[] = generatorCombo(
      uniq(
        snippets.map((s) => {
          const command = getSnippetCommand(s.title)
          return {
            command,
            icon: s.icon ?? DefaultMIcons.SNIPPET,
            text: command.replace('snip.', ''),
            type: QuickLinkType.snippet
          }
        })
      )
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
