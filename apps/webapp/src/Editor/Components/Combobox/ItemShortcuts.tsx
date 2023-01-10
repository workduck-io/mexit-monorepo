import { ComboboxShortcuts, DisplayShortcut, ShortcutText } from '@mexit/shared'

const ItemShortcuts: React.FC<{ shortcuts?: Record<string, any> }> = ({ shortcuts }) => {
  if (!shortcuts) return

  return (
    <ComboboxShortcuts>
      {Object.entries(shortcuts).map(([key, shortcut]) => {
        return (
          <ShortcutText key={key}>
            <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
          </ShortcutText>
        )
      })}
    </ComboboxShortcuts>
  )
}

export default ItemShortcuts
