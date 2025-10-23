import { computed, ref } from 'vue'

export function useTimer() {
  const startTime = ref(null)
  const currentTime = ref(null)
  const intervalId = ref(null)

  const elapsedSeconds = computed(() => {
    if (!startTime.value) return 0
    const current = currentTime.value || Date.now()
    return Math.floor((current - startTime.value) / 1000)
  })

  function start() {
    startTime.value = Date.now()
    intervalId.value = setInterval(() => {
      currentTime.value = Date.now()
    }, 100)
  }

  const formattedTime = computed(() => {
    const seconds = elapsedSeconds.value
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  })

  function stop() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    currentTime.value = Date.now()
  }

  function reset() {
    stop()
    startTime.value = null
    currentTime.value = null
  }

  return {
    startTime,
    start,
    stop,
    formattedTime,
    reset,
    currentTime,
    elapsedSeconds,
  }
}
