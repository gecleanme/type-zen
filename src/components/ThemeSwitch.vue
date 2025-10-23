<template>
  <button
    @click="isDark = !isDark"
    class="relative w-20 h-10 rounded-full p-1 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl"
    :style="{
      background: isDark
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    }"
    tabindex="-1"
    @mouseup="(e) => e.target.blur()"
  >
    <!-- Glow effect -->
    <div
      class="absolute inset-0 rounded-full blur-md opacity-50"
      :style="{
        background: isDark
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      }"
    />

    <!-- Thumb -->
    <div
      :class="[
        'relative w-8 h-8 rounded-full bg-white shadow-xl transform transition-all duration-500 ease-out flex items-center justify-center',
        isDark ? 'translate-x-10' : 'translate-x-0',
      ]"
    >
      <!-- Moon Icon -->
      <svg
        :class="[
          'w-4 h-4 absolute transition-all duration-500 text-indigo-600',
          isDark ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0',
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      <!-- Sun Icon -->
      <svg
        :class="[
          'w-4 h-4 absolute transition-all duration-500 text-amber-500',
          isDark ? '-rotate-180 opacity-0' : 'rotate-0 opacity-100',
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </div>
  </button>
</template>

<script setup>
const isDark = defineModel({ type: Boolean, default: false })
</script>
