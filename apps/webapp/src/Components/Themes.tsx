import React from 'react'
import { useTransition } from 'react-spring'

import moonClearFill from '@iconify/icons-ri/moon-clear-fill'
import sunFill from '@iconify/icons-ri/sun-fill'
import { Icon } from '@iconify/react'

import { defaultThemes, ManagedProvider, useThemeContext } from '@workduck-io/mex-themes'

import { userPreferenceStore as useUserPreferenceStore } from '@mexit/core'
import { ToggleButton } from '@mexit/shared'

import { useUserService } from '../Hooks/API/useUserAPI'
import { Theme, ThemeHeader, ThemeModeDiv, ThemePreviews, ThemeSwitch } from '../Style/Settings'

import ThemeDemo from './ThemeDemo'

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
      <ThemeSwitch>
        <ThemeModeDiv>
          <Icon icon={sunFill} /> Light
        </ThemeModeDiv>
        <ToggleButton checked={theme.mode === 'dark'} onChange={onToggleMode} />
        <ThemeModeDiv>
          <Icon icon={moonClearFill} /> Dark
        </ThemeModeDiv>
      </ThemeSwitch>
      <ThemePreviews>
        {transition((styles, t, _t, i) => {
          return (
            <ManagedProvider mode="dark" key={`mex_theme_key_${t.id}`} tokens={t.data['dark']}>
              {/* eslint-disable-next-line */}
              {/* @ts-ignore */}
              <Theme selected={t.id === theme.themeId} onClick={() => onThemeSelect(i)} style={styles}>
                <ThemeDemo theme={t} />
                <ThemeHeader>
                  <h4>{t.name}</h4>
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
