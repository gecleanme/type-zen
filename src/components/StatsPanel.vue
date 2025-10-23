<script setup>
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'

const gameStore = useGameStore()

// Emit events for parent to handle
const emit = defineEmits(['startGame', 'resetGame'])

const statusColor = computed(() => {
  if (gameStore.accuracy >= 95) return 'text-green-600 dark:text-green-400'
  if (gameStore.accuracy >= 85) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
})
</script>

<template>
  <div class="stats-panel grid grid-cols-4 gap-4 mb-6">
    <!-- WPM -->
    <div
      class="stat-card bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center transition-colors duration-300"
    >
      <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
        {{ gameStore.wpm }}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400">WPM</div>
    </div>

    <!-- Accuracy -->
    <div
      class="stat-card bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 text-center transition-colors duration-300"
    >
      <div class="text-3xl font-bold" :class="statusColor">{{ gameStore.accuracy }}%</div>
      <div class="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
    </div>

    <!-- Time -->
    <div
      class="stat-card bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center transition-colors duration-300"
    >
      <div class="text-3xl font-bold text-green-600 dark:text-green-400">
        {{ gameStore.elapsedTime.toFixed(1) }}s
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400">Time</div>
    </div>

    <!-- Errors -->
    <div
      class="stat-card bg-red-50 dark:bg-red-900/30 rounded-lg p-4 text-center transition-colors duration-300"
    >
      <div class="text-3xl font-bold text-red-600 dark:text-red-400">
        {{ gameStore.errors }}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400">Errors</div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="actions flex gap-3 mb-6">
    <button
      v-if="gameStore.gameStatus === 'idle'"
      @click="emit('startGame')"
      class="flex-1 bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg transition font-semibold hover:bg-green-600 dark:hover:bg-green-700"
    >
      Game Ready! Start Typing
    </button>

    <button
      v-if="gameStore.gameStatus === 'playing' || gameStore.gameStatus === 'finished'"
      @click="emit('resetGame')"
      class="flex-1 bg-gray-500 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 transition font-semibold"
    >
      Reset
    </button>
  </div>
</template>
