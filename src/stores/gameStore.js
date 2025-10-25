import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuoteApi } from '@/composables/useQuoteApi.js'
import { useSound } from '@vueuse/sound'
import tadaSfx from '/assets/tada.mp3'

export const useGameStore = defineStore('game', () => {
  // STATE
  const gameStatus = ref('idle')
  const difficulty = ref('medium')
  const targetText = ref('')
  const userInput = ref('')
  const startTime = ref(null)
  const endTime = ref(null)
  const errors = ref(0)
  const currentTime = ref(Date.now())
  let intervalId = null
  const cachedQuotes = ref([])
  const { play } = useSound(tadaSfx)

  // GETTERS
  const currentCharIndex = computed(() => userInput.value.length)

  const charactersTyped = computed(() => userInput.value.length)

  const isComplete = computed(() => {
    return userInput.value === targetText.value && userInput.value.length > 0
  })

  const accuracy = computed(() => {
    if (charactersTyped.value === 0) return 100
    const correctChars = charactersTyped.value - errors.value
    return Math.round((correctChars / charactersTyped.value) * 100)
  })

  const elapsedTime = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value || currentTime.value
    return (end - startTime.value) / 1000
  })

  const wpm = computed(() => {
    if (elapsedTime.value === 0) return 0
    const minutes = elapsedTime.value / 60
    const words = charactersTyped.value / 5
    return Math.round(words / minutes)
  })

  const characterStatuses = computed(() => {
    return targetText.value.split('').map((char, index) => {
      if (index < userInput.value.length) {
        return userInput.value[index] === char ? 'correct' : 'incorrect'
      } else if (index === userInput.value.length) {
        return 'current'
      }
      return 'pending'
    })
  })

  function startReactiveTimer() {
    if (intervalId) {
      clearInterval(intervalId)
    }

    intervalId = setInterval(() => {
      currentTime.value = Date.now()
    }, 100)
  }

  function stopReactiveTimer() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    currentTime.value = Date.now()
  }

  // ACTIONS
  async function startGame(selectedDifficulty = null) {
    if (selectedDifficulty) {
      difficulty.value = selectedDifficulty
    }

    userInput.value = ''
    errors.value = 0
    startTime.value = null
    endTime.value = null
    gameStatus.value = 'idle'

    stopReactiveTimer()

    if (cachedQuotes[difficulty.value] !== undefined) {
      targetText.value = cachedQuotes[difficulty.value]
    } else {
      const { getRandomQuote, printQuote, error } = useQuoteApi(difficulty.value)

      await getRandomQuote()

      if (!error.value) {
        targetText.value = printQuote.value
        cachedQuotes[difficulty.value] = targetText.value
      }
    }
  }

  function handleKeyPress(key) {
    const isSpace = key === ' ' || key === '{space}'
    const isCaps = key === 'CapsLock' || key === '{lock}'
    const isShift = key === 'Shift' || key === '{shift}'
    const isBackspace = key === 'Backspace' || key === '{bksp}'
    const isTab = key === 'Tab' || key === '{tab}'

    if (gameStatus.value === 'finished') return
    if (isCaps || isShift || isTab) return

    if (!startTime.value && gameStatus.value === 'idle') {
      startTime.value = Date.now()
      currentTime.value = Date.now()
      gameStatus.value = 'playing'
      startReactiveTimer()
    }

    if (isBackspace) {
      if (userInput.value.length > 0) {
        const removedChar = userInput.value[userInput.value.length - 1]
        const targetChar = targetText.value[userInput.value.length - 1]
        if (removedChar !== targetChar) {
          errors.value = Math.max(0, errors.value - 1)
        }
        userInput.value = userInput.value.slice(0, -1)
      }
      return
    }

    if (key.length > 1 && !isSpace) return
    if (userInput.value.length >= targetText.value.length) return

    const typedChar = isSpace ? ' ' : key
    const expectedChar = targetText.value[userInput.value.length]

    if (typedChar !== expectedChar) {
      errors.value++
    }

    userInput.value += typedChar

    if (userInput.value === targetText.value || targetText.value.length === charactersTyped.value) {
      finishGame()
    }
  }

  function finishGame() {
    endTime.value = Date.now()
    gameStatus.value = 'finished'
    stopReactiveTimer()
    // add sound here
    play()
  }

  function resetGame() {
    startGame(difficulty.value)
  }

  return {
    gameStatus,
    difficulty,
    targetText,
    userInput,
    errors,

    currentCharIndex,
    charactersTyped,
    isComplete,
    accuracy,
    elapsedTime,
    wpm,
    characterStatuses,

    startGame,
    handleKeyPress,
    finishGame,
    resetGame,
  }
})
