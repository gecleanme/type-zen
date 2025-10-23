<script setup>
import SimpleKeyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import { onMounted, ref } from 'vue'

const keyboard = ref(null)
const emit = defineEmits(['OnKeyPress'])
const layoutName = ref('')

const props = defineProps({
  isDark: Boolean,
})
const handleKP = (btn) => {
  if (btn === '{shift}' || btn === '{lock}') handleShift()
  emit('onKeyPress', btn)
}

const handleShift = () => {
  layoutName.value = layoutName.value === 'default' ? 'shift' : 'default'
  keyboard.value.setOptions({
    layoutName: layoutName.value,
  })
}

onMounted(() => {
  keyboard.value = new SimpleKeyboard('simple-keyboard', {
    onKeyPress: handleKP,
    theme: 'hg-theme-default myCustomTheme',
    layoutName: layoutName.value,
  })
})
</script>

<template>
  <div :class="['simple-keyboard-wrapper', { 'dark-mode': isDark }]">
    <div class="simple-keyboard"></div>
  </div>
</template>

<style scoped>
.simple-keyboard-wrapper :deep(.simple-keyboard.myCustomTheme) {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.simple-keyboard-wrapper :deep(.simple-keyboard.myCustomTheme .hg-button) {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.simple-keyboard-wrapper :deep(.simple-keyboard.myCustomTheme .hg-button:hover) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.simple-keyboard-wrapper :deep(.simple-keyboard.myCustomTheme .hg-button:active) {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
  transform: scale(0.95);
}

/* Dark Mode Styles */
.simple-keyboard-wrapper.dark-mode :deep(.simple-keyboard.myCustomTheme) {
  background-color: rgba(31, 41, 55, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.simple-keyboard-wrapper.dark-mode :deep(.simple-keyboard.myCustomTheme .hg-button) {
  background: rgba(55, 65, 81, 0.8);
  color: #e5e7eb;
  border: 1px solid #4b5563;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.simple-keyboard-wrapper.dark-mode :deep(.simple-keyboard.myCustomTheme .hg-button:hover) {
  background: rgba(75, 85, 99, 0.9);
  border-color: #6b7280;
}

.simple-keyboard-wrapper.dark-mode :deep(.simple-keyboard.myCustomTheme .hg-button:active) {
  background: #2563eb;
  color: white;
  border-color: #1d4ed8;
  transform: scale(0.95);
}
</style>
