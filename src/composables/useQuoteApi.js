import { computed, ref } from 'vue'
import axios from 'axios'

export const useQuoteApi = (difficulty = 'default') => {
  // state
  const randomQuoteObject = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // getters
  const getParams = () => {
    switch (difficulty) {
      case 'easy':
        return { maxLength: 50 }
      case 'medium':
        return { maxLength: 100, minLength: 60 }
      case 'hard':
        return { maxLength: 200, minLength: 120 }
      case 'expert':
        return { maxLength: 400, minLength: 240 }
      default:
        return {}
    }
  }

  const printQuote = computed(() => randomQuoteObject.value?.quote)

  // actions
  const getRandomQuote = async () => {
    try {
      loading.value = true
      const res = await axios.get('https://quoteslate.vercel.app/api/quotes/random', {
        params: getParams(),
      })
      randomQuoteObject.value = res.data
    } catch (e) {
      error.value = e.response?.data?.message || e.message || 'Error fetching quote'
    } finally {
      loading.value = false
    }
  }

  return { getRandomQuote, printQuote, randomQuoteObject, error }
}
