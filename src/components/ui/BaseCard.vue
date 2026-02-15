<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="title || subtitle || $slots.header || $slots.actions" class="flex items-start justify-between mb-4">
      <div v-if="title || subtitle || $slots.header" class="flex-1">
        <slot name="header">
          <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="flex-shrink-0 ml-4">
        <slot name="actions" />
      </div>
    </div>

    <!-- Body -->
    <div :class="bodyClasses">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  hoverable: Boolean,
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v)
  },
  shadow: {
    type: String,
    default: 'sm',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v)
  }
})

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8'
}

const shadowClasses = {
  none: '',
  sm: 'shadow-card',
  md: 'shadow-md',
  lg: 'shadow-lg'
}

const cardClasses = computed(() => [
  'bg-white dark:bg-gray-800 rounded-card',
  shadowClasses[props.shadow],
  paddingClasses[props.padding],
  {
    'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer': props.hoverable
  }
])

const bodyClasses = computed(() => ({
  '-mx-6 -my-2 px-6 py-2': props.padding === 'md' && (props.title || props.subtitle)
}))
</script>
