<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div class="relative">
      <div v-if="$slots.prefix || prefixIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <slot name="prefix">
          <component v-if="prefixIcon" :is="prefixIcon" class="w-5 h-5 text-gray-400" />
        </slot>
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <div v-if="$slots.suffix || suffixIcon" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <slot name="suffix">
          <component v-if="suffixIcon" :is="suffixIcon" class="w-5 h-5 text-gray-400" />
        </slot>
      </div>
    </div>

    <p v-if="error" class="mt-1.5 text-sm text-danger">
      {{ error }}
    </p>

    <p v-else-if="hint" class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text'
  },
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
  prefixIcon: Object,
  suffixIcon: Object,
  min: [String, Number],
  max: [String, Number],
  step: [String, Number]
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const slots = useSlots()
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => [
  'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  {
    'border-danger focus:ring-danger': props.error,
    'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary': !props.error,
    'opacity-50 cursor-not-allowed': props.disabled,
    'pl-10': slots.prefix || props.prefixIcon,
    'pr-10': slots.suffix || props.suffixIcon
  }
])
</script>
