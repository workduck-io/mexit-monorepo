import React from 'react'
import { useTransition } from 'react-spring'

import { Button } from '@workduck-io/mex-components'
import { defaultThemes, ManagedProvider, useThemeContext } from '@workduck-io/mex-themes'

import { useUserService } from '../Hooks/API/useUserAPI'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { Theme, ThemeColorDots, ThemeHeader, ThemePreview, ThemePreviews } from '../Style/Settings'

const Themes = () => {
  const themes = defaultThemes
  const { changeTheme, toggleMode } = useThemeContext()
  const theme = useUserPreferenceStore((state) => state.theme)
  const setTheme = useUserPreferenceStore((state) => state.setTheme)

  const { updateUserPreferences } = useUserService()

  const transition = useTransition(themes, {
    from: {
      opacity: 0,
      transform: 'translate3d(-100px,0,0) scale(0.5) '
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0px,0,0) scale(1) '
    },
    keys: (item) => item.id,
    trail: 50,
    duration: 100,
    config: {
      mass: 1,
      tension: 100,
      friction: 16
    }
  })

  const onThemeSelect = (i: number) => {
    if (themes[i]) {
      setTheme(themes[i].id)
      changeTheme(themes[i].id)
    }

    updateUserPreferences()
  }

  const onToggleMode = () => {
    toggleMode()
    setTheme(theme.themeId, theme.mode === 'light' ? 'dark' : 'light')
  }

  return (
    <>
      <Button onClick={onToggleMode}>Toggle Mode</Button>
      <ThemePreviews>
        {transition((styles, t, _t, i) => {
          return (
            <ManagedProvider key={`mex_theme_key_${t.id}`} tokens={t.data['dark']}>
              {/* eslint-disable-next-line */}
              {/* @ts-ignore */}
              <Theme selected={t.id === theme.themeId} onClick={() => onThemeSelect(i)} style={styles}>
                <ThemePreview back={undefined}>
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
            </ManagedProvider>
          )
        })}
      </ThemePreviews>
    </>
  )
}

export default Themes
