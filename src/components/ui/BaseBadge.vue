<template>
  <span :class="badgeClasses">
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full mr-1.5" :class="dotColorClass"></span>
    <slot />
    <button
      v-if="removable"
      @click="$emit('remove')"
      class="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (v) => ['success', 'warning', 'danger', 'info', 'primary', 'gray'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  dot: Boolean,
  removable: Boolean
})

defineEmits(['remove'])

const variantClasses = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm'
}

const dotColorClasses = {
  success: 'bg-green-600 dark:bg-green-400',
  warning: 'bg-yellow-600 dark:bg-yellow-400',
  danger: 'bg-red-600 dark:bg-red-400',
  info: 'bg-blue-600 dark:bg-blue-400',
  primary: 'bg-primary-600 dark:bg-primary-400',
  gray: 'bg-gray-600 dark:bg-gray-400'
}

const badgeClasses = computed(() => [
  'inline-flex items-center rounded-full font-medium',
  variantClasses[props.variant],
  sizeClasses[props.size]
])

const dotColorClass = computed(() => dotColorClasses[props.variant])
</script>
