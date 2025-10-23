<template>
  <div class="flex flex-col transition-all duration-300">
    <div class="flex items-center gap-x-2">
      <span
        v-if="label && label.length && labelStart"
        :class="[
          { 'text-gray-300 dark:text-gray-600': disabled },
          disabled ? 'cursor-none' : 'cursor-default',
          'dark:text-gray-300',
        ]"
        class="select-none"
        @click.stop="$emit('update:modelValue', !modelValue)"
        >{{ label }}</span
      >
      <Switch
        :disabled="disabled || readOnly"
        v-bind="$attrs"
        :default-checked="modelValue"
        @update:model-value="(value) => $emit('update:modelValue', value)"
        as="template"
        #default="{ checked }"
      >
        <button
          class="relative inline-flex h-6 w-11 items-center rounded-full"
          :class="[
            errorMessage.length
              ? 'bg-red-600'
              : checked
                ? 'bg-green-600'
                : 'bg-gray-200 dark:bg-gray-700',
          ]"
          tabindex="-1"
          @mouseup="(e) => e.target.blur()"
        >
          <span class="sr-only">{{ label }}</span>
          <span
            :class="
              checked ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'
            "
            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
          />
        </button>
      </Switch>
      <span
        v-if="label && label.length && !labelStart"
        :class="[
          { 'text-gray-300 dark:text-gray-600': disabled },
          disabled ? 'cursor-none' : 'cursor-default',
          'dark:text-gray-300',
        ]"
        class="select-none"
        @click.stop="$emit('update:modelValue', !modelValue)"
        >{{ label }}</span
      >
    </div>
    <div class="break-words text-gray-400 dark:text-gray-500 select-none">
      <p v-if="hint.length" class="text-sm px-1 mt-1">
        {{ hint }}
      </p>
    </div>
    <div class="break-words select-none" v-if="!hideDetails">
      <p v-if="errorMessage.length" class="text-sm text-red-400 dark:text-red-500 px-1 mt-1">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { Switch } from '@headlessui/vue'

defineOptions({
  name: 'ToggleSwitch',
})
defineProps({
  errorMessage: { type: String, default: '', required: false },
  modelValue: { type: Boolean, default: false, required: false },
  hint: { type: String, default: '', required: false },
  label: { type: String, default: '', required: false },
  disabled: { type: Boolean, default: false, required: false },
  readOnly: { type: Boolean, default: false, required: false },
  labelStart: { type: Boolean, default: false, required: false },
  hideDetails: { type: Boolean, default: false, required: false },
})

defineEmits(['update:modelValue'])
</script>

<style scoped></style>
