<script setup>
import { useGameStore } from '@/stores/gameStore'
import { ref, nextTick, watch } from 'vue'

const gameStore = useGameStore()
const mobileInput = ref(null)

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

function handleDisplayClick() {
  if (mobileInput.value) {
    mobileInput.value.focus()
  }
}

function handleMobileInput(event) {
  const value = event.target.value

  if (value.length > 0) {
    const lastChar = value[value.length - 1]
    gameStore.handleKeyPress(lastChar)
  }

  nextTick(() => {
    event.target.value = ''
  })
}

function handleMobileKeydown(event) {
  event.stopPropagation()

  if (event.key === 'Backspace') {
    event.preventDefault()
    gameStore.handleKeyPress('Backspace')
  }
}

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function handleInputBlur() {
  if (gameStore.gameStatus === 'playing' && isMobileDevice()) {
    nextTick(() => {
      if (mobileInput.value) {
        mobileInput.value.focus()
      }
    })
  }
}

watch(
  () => gameStore.gameStatus,
  (newStatus) => {
    if (newStatus === 'finished' && mobileInput.value) {
      mobileInput.value.blur()
    }
  },
)
</script>

<template>
  <div
    class="game-display bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 transition-colors duration-300 relative cursor-text"
    @click="handleDisplayClick"
  >
    <!-- mobile keyboard support -->
    <input
      ref="mobileInput"
      type="text"
      class="mobile-input"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      @input="handleMobileInput"
      @keydown="handleMobileKeydown"
      @blur="handleInputBlur"
      aria-label="Type the displayed text"
    />

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

<style scoped>
.mobile-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  /* Prevent zoom on iOS when focusing input */
  font-size: 16px;
}

.game-display {
  -webkit-tap-highlight-color: transparent;
}

@media (hover: none) and (pointer: coarse) {
  .game-display::after {
    content: 'Tap here to type';
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 12px;
    color: #9ca3af;
    opacity: 0;
    animation: fadeInOut 3s ease-in-out;
    pointer-events: none;
  }

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0;
    }
    10%,
    90% {
      opacity: 0.6;
    }
  }
}
</style>
