<template>
  <div class="w-full">
    <label v-if="label" :for="textareaId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="textareaClasses"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

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
  modelValue: String,
  label: String,
  placeholder: String,
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
  rows: {
    type: Number,
    default: 4
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const textareaId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)

const textareaClasses = computed(() => [
  'w-full px-3 py-2 border rounded-lg text-sm transition-colors resize-y',
  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  {
    'border-danger focus:ring-danger': props.error,
    'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary': !props.error,
    'opacity-50 cursor-not-allowed': props.disabled
  }
])
</script>
