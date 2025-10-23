import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { useDark, useToggle } from '@vueuse/core'
export const useSettingsStore = defineStore('settings', () => {
  // STATE

  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  })

  const toggleDark = useToggle(isDark)

  const gameSettings = ref({
    showKeyboard: false,
    preferredDifficulty: 'medium',
  })

  const savedSettings = localStorage.getItem('typing-game-settings')
  if (savedSettings) {
    gameSettings.value = JSON.parse(savedSettings)
  }

  // getters

  const showKeyboard = computed(() => gameSettings.value.showKeyboard)
  const preferredDifficulty = computed(() => gameSettings.value.preferredDifficulty)

  // ACTIONS
  function saveSettings(newSettings) {
    gameSettings.value = {
      showKeyboard: newSettings.showKeyboard ?? true,
      preferredDifficulty: newSettings.preferredDifficulty ?? 'medium',
    }

    localStorage.setItem('typing-game-settings', JSON.stringify(gameSettings.value))
  }

  function clearHistory() {
    gameSettings.value = {
      theme: 'light',
      showKeyboard: false,
    }
    localStorage.removeItem('typing-game-settings')
  }

  return {
    gameSettings,
    saveSettings,
    showKeyboard,
    preferredDifficulty,
    isDark,
    toggleDark,
    clearHistory,
  }
})
