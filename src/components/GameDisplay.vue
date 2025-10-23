<script setup>
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

function getCharClass(status) {
  const base = 'inline-block px-1 py-0.5 text-2xl font-mono transition-all duration-150'
  switch (status) {
    case 'correct':
      return `${base} text-green-600 dark:text-green-400 bg-green-50 border-b-4 border-transparent dark:bg-green-900/30`
    case 'incorrect':
      return `${base} text-red-600 dark:text-red-400 bg-red-50 border-b-4 border-transparent dark:bg-red-900/30 font-bold`
    case 'current':
      return `${base} bg-blue-200 dark:bg-blue-700 border-b-4 border-blue-500 dark:border-blue-400 animate-pulse`
    default:
      return `${base} text-gray-400 border-b-4 border-transparent dark:text-gray-500`
  }
}
</script>

<template>
  <div
    class="game-display bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 transition-colors duration-300"
  >
    <div class="text-display leading-relaxed">
      <span
        v-for="(char, index) in gameStore.targetText"
        :key="index"
        :class="getCharClass(gameStore.characterStatuses[index])"
      >
        {{ char === ' ' ? '␣' : char }}
      </span>
    </div>
  </div>
</template>
