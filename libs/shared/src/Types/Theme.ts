export interface Theme {
  id: string
  themeData: any
}

export interface ThemeStoreState {
  theme: Theme
  themes: Theme[]
  setTheme: (theme: Theme) => void
  setThemes: (theme: Theme[]) => void
}
