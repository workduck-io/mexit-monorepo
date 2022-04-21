const EditorIdPrefix = 'StandardEditor'
export const getEditorId = (
    nodeid: string,
    // updatedAt: string,
    loading: boolean
) => {
    if (!loading) return nodeid
    return `${EditorIdPrefix}_${nodeid}`
}
