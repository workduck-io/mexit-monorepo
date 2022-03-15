import Fuse from 'fuse.js'

export const fuzzySearch = (list: any[], text: string, options: Fuse.IFuseOptions<any>) => {
  const fuse = new Fuse(list, options)
  return fuse.search(text).map((l) => l.item)
}
