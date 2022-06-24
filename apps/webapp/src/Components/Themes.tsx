import React from 'react'
import { useTransition } from 'react-spring'
import { ThemeProvider } from 'styled-components'
import useThemeStore from '../Stores/useThemeStore'
import { Wrapper } from '@mexit/shared'
import { Theme, ThemeColorDots, ThemeHeader, ThemePreview, ThemePreviews } from '../Style/Settings'

const Themes = () => {
  const themes = useThemeStore((state) => state.themes)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  console.log('Current Theme: ', theme)
  console.log('Themes: ', themes)
  const transition = useTransition(themes, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    keys: (item) => {
      console.log('Item: ', item)
      return item.id
    },
    trail: 100,
    duration: 300,
    config: {
      mass: 1,
      tension: 200,
      friction: 16
    }
  })

  const onThemeSelect = (i: number) => {
    if (themes[i]) {
      setTheme(themes[i])
    }
  }

  return (
    <Wrapper>
      <ThemePreviews>
        {transition((styles, t, _t, i) => {
          return (
            <ThemeProvider key={`mex_theme_key_${t.id}`} theme={t.themeData}>
              <Theme selected={t.id === theme.id} onClick={() => onThemeSelect(i)} style={styles}>
                <ThemePreview back={t.themeData.backgroundImages ? t.themeData.backgroundImages.app : undefined}>
                  <ThemeColorDots>
                    <div className="primary"></div>
                    <div className="secondary"></div>
                    <div className="text"></div>
                    <div className="text_fade"></div>
                    <div className="background"></div>
                  </ThemeColorDots>
                  <br />
                </ThemePreview>
                <ThemeHeader>
                  <h4>{t.id}</h4>
                </ThemeHeader>
              </Theme>
            </ThemeProvider>
          )
        })}
      </ThemePreviews>
    </Wrapper>
  )
}

export default Themes
