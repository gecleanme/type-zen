import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStatsStore = defineStore('stats', () => {
  // STATE
  const gameHistory = ref([])

  const savedHistory = localStorage.getItem('typing-game-history')
  if (savedHistory) {
    gameHistory.value = JSON.parse(savedHistory)
  }

  // GETTERS
  const gamesPlayed = computed(() => gameHistory.value.length)

  const averageWpm = computed(() => {
    if (gamesPlayed.value === 0) return 0
    const total = gameHistory.value.reduce((sum, game) => sum + game.wpm, 0)
    return Math.round(total / gamesPlayed.value)
  })

  const bestWpm = computed(() => {
    if (gamesPlayed.value === 0) return 0
    return Math.max(...gameHistory.value.map((game) => game.wpm))
  })

  const averageAccuracy = computed(() => {
    if (gamesPlayed.value === 0) return 0
    const total = gameHistory.value.reduce((sum, game) => sum + game.accuracy, 0)
    return Math.round(total / gamesPlayed.value)
  })

  const recentGames = computed(() => {
    return gameHistory.value.slice(-10).reverse() // Last 10 games
  })

  // ACTIONS
  function saveGame(gameData) {
    const record = {
      id: Date.now(),
      date: new Date().toISOString(),
      wpm: gameData.wpm,
      accuracy: gameData.accuracy,
      difficulty: gameData.difficulty,
      timeTaken: gameData.timeTaken,
      errors: gameData.errors,
    }

    gameHistory.value.push(record)

    localStorage.setItem('typing-game-history', JSON.stringify(gameHistory.value))
  }

  function clearHistory() {
    gameHistory.value = []
    localStorage.removeItem('typing-game-history')
  }

  return {
    gameHistory,

    gamesPlayed,
    averageWpm,
    bestWpm,
    averageAccuracy,
    recentGames,

    saveGame,
    clearHistory,
  }
})
