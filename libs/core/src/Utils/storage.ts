export const getLocalStorage = () => {
  return typeof window !== 'undefined' ? window.localStorage : null
}
