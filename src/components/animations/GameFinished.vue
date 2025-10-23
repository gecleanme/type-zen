<script setup lang="ts">
import { motion } from 'motion-v'

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => {
    const delay = i * 0.5
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: 'spring', duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    }
  },
}

/**
 * ==============   Styles   ================
 */

const image = {
  maxWidth: '50%',
}

const shape = {
  strokeWidth: 2,
  strokeLinecap: 'round',
  fill: 'transparent',
}

const star =
  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
</script>

<template>
  <motion.svg
    width="200"
    height="200"
    viewBox="0 0 24 24"
    initial="hidden"
    animate="visible"
    :style="image"
  >
    <motion.path
      class="star-path"
      :d="star"
      stroke="#FFD700"
      :variants="draw"
      :custom="1"
      :style="shape"
    />
  </motion.svg>
</template>
