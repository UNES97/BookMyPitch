<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <p v-if="error" class="mt-1.5 text-sm text-danger">
      {{ error }}
    </p>

    <p v-else-if="hint" class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean
})

defineEmits(['update:modelValue'])

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const selectClasses = computed(() => [
  'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  {
    'border-danger focus:ring-danger': props.error,
    'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary': !props.error,
    'opacity-50 cursor-not-allowed': props.disabled
  }
])
</script>
