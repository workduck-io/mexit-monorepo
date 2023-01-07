type ComboboxItemPreviewProps = {
  show?: boolean
}

const ComboboxItemPreview: React.FC<ComboboxItemPreviewProps> = ({ show }) => {
  if (!show) return

  return <></>
}

export default ComboboxItemPreview
