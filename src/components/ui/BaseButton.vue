<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span :class="{ 'opacity-0': loading }" class="flex items-center justify-center">
      <component
        v-if="icon && iconPosition === 'left'"
        :is="icon"
        :class="['flex-shrink-0', $slots.default ? 'mr-2' : '', iconSizeClass]"
      />
      <slot />
      <component
        v-if="icon && iconPosition === 'right'"
        :is="icon"
        :class="['flex-shrink-0', $slots.default ? 'ml-2' : '', iconSizeClass]"
      />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'success', 'ghost', 'outline'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
  },
  type: {
    type: String,
    default: 'button'
  },
  loading: Boolean,
  disabled: Boolean,
  icon: Object,
  iconPosition: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'right'].includes(v)
  },
  block: Boolean
})

defineEmits(['click'])

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-800 focus:ring-primary',
  secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
  danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger',
  success: 'bg-success text-white hover:bg-green-700 focus:ring-success',
  ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500',
  outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary'
}

const sizeClasses = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-lg',
  xl: 'px-6 py-4 text-xl'
}

const iconSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7'
}

const iconSizeClass = computed(() => iconSizeClasses[props.size])

const buttonClasses = computed(() => [
  'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
  {
    'w-full': props.block
  }
])
</script>
