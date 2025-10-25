<script setup>
import { onErrorCaptured, onMounted, ref, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useStatsStore } from '@/stores/statsStore'
import SimpleKeyboard from '@/components/SimpleKeyboard.vue'
import GameDisplay from '@/components/GameDisplay.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AppLogo from '@/components/AppLogo.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useSettingsStore } from '@/stores/settingsStore.js'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import GameFinished from '@/components/animations/GameFinished.vue'

const gameStore = useGameStore()
const statsStore = useStatsStore()
const settingsStore = useSettingsStore()
const error = ref(null)

onErrorCaptured((err) => {
  error.value = err
  return false
})

const handleKeyPress = (key) => {
  gameStore.handleKeyPress(key)
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    e.preventDefault()

    if (e.key.length && e.key !== 'CapsLock') {
      gameStore.handleKeyPress(e.key)
    }
  })

  gameStore.startGame(settingsStore.gameSettings.preferredDifficulty)
})

const handleStartGame = () => {
  console.log('Ready')
}

const handleResetGame = () => {
  //wrapper
  gameStore.resetGame()
}

watch(
  () => gameStore.gameStatus,
  (newStatus) => {
    if (newStatus === 'finished') {
      statsStore.saveGame({
        wpm: gameStore.wpm,
        accuracy: gameStore.accuracy,
        difficulty: gameStore.difficulty,
        timeTaken: gameStore.elapsedTime,
        errors: gameStore.errors,
      })

      settingsStore.saveSettings({
        showKeyboard: settingsStore.gameSettings.showKeyboard,
        preferredDifficulty: settingsStore.gameSettings.preferredDifficulty,
      })
    }
  },
)
</script>

<template>
  <div class="app min-h-screen py-8">
    <AppLogo />

    <div v-if="error" class="text-center text-red-600 p-8">
      <h2 class="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p>{{ error.message }}</p>
      <button
        @click="error = null"
        class="w-full mt-6 bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition font-semibold"
      >
        Try Again
      </button>
    </div>

    <div class="fixed top-4 right-4 z-40">
      <ThemeSwitch
        v-model="settingsStore.isDark"
        v-if="gameStore.gameStatus !== 'finished' && gameStore.targetText"
      />
    </div>

    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <header class="text-center mb-8">
        <div class="mt-4 text-sm text-gray-500" v-if="gameStore.targetText">
          Best : {{ statsStore.bestWpm }} WPM | Avg: {{ statsStore.averageWpm }} WPM | Games Played:
          {{ statsStore.gamesPlayed }}
        </div>
      </header>

      <LoadingSpinner v-if="!gameStore.targetText" />

      <div v-if="!gameStore.targetText" class="fixed bottom-50 left-1/2 -translate-x-1/2 mb-4">
        <div class="p-4 text-center font-mono leading-relaxed dark:text-white">
          If this takes long, the quote wizard is probably asleep right now 💤
        </div>
      </div>

      <!-- Stats Panel -->
      <StatsPanel
        @start-game="handleStartGame"
        @reset-game="handleResetGame"
        v-if="gameStore.targetText"
      />

      <!-- Game Display -->
      <GameDisplay v-if="gameStore.targetText" />

      <div class="difficulty-selector flex gap-2 mb-6 justify-center" v-if="gameStore.targetText">
        <label
          v-for="level in ['easy', 'medium', 'hard', 'expert']"
          :key="level"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition cursor-pointer',
            settingsStore.preferredDifficulty === level
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100',
          ]"
        >
          <input
            type="radio"
            :value="level"
            v-model="settingsStore.gameSettings.preferredDifficulty"
            @change="gameStore.startGame(level)"
            class="sr-only"
          />
          {{ level.charAt(0).toUpperCase() + level.slice(1) }}
        </label>
      </div>

      <div class="mb-4">
        <ToggleSwitch
          class="hidden md:flex"
          v-model="settingsStore.gameSettings.showKeyboard"
          label="Virtual Keyboard"
          v-if="gameStore.targetText"
        />
      </div>
      <SimpleKeyboard
        @on-key-press="handleKeyPress"
        v-if="gameStore.targetText && settingsStore.showKeyboard"
        class="mt-4"
        :isDark="settingsStore.isDark"
      />

      <!-- Game Over Modal -->
      <div
        v-if="gameStore.gameStatus === 'finished'"
        class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center"
        @click="handleResetGame"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md shadow-2xl" @click.stop>
          <h2 class="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Great Job!
          </h2>

          <GameFinished class="m-4 mx-auto" />

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Speed:</span>
              <span class="text-2xl font-bold text-blue-600 dark:text-blue-400"
                >{{ gameStore.wpm }} WPM</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Accuracy:</span>
              <span class="text-2xl font-bold text-purple-600 dark:text-purple-400"
                >{{ gameStore.accuracy }}%</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Time:</span>
              <span class="text-2xl font-bold text-green-600 dark:text-green-400"
                >{{ gameStore.elapsedTime.toFixed(1) }}s</span
              >
            </div>
          </div>

          <button
            @click="handleResetGame"
            class="w-full mt-6 bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition font-semibold"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
