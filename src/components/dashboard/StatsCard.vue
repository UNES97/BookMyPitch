<template>
  <BaseCard :hoverable="false" padding="md" shadow="sm">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ label }}</p>
        <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        <p v-if="change" class="mt-2 flex items-center text-sm">
          <span :class="changeColorClass" class="flex items-center">
            <component :is="changeIcon" class="w-4 h-4 mr-1" />
            {{ change }}
          </span>
        </p>
      </div>
      <div v-if="icon" :class="iconBgClass" class="p-3 rounded-lg">
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/solid'
import BaseCard from '@components/ui/BaseCard.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  change: String,
  trend: {
    type: String,
    validator: (v) => ['up', 'down', 'neutral'].includes(v)
  },
  icon: Object
})

const changeIcon = computed(() => {
  if (!props.trend) return null
  return props.trend === 'up' ? ArrowUpIcon : ArrowDownIcon
})

const changeColorClass = computed(() => {
  if (!props.trend) return 'text-gray-600 dark:text-gray-400'
  return props.trend === 'up'
    ? 'text-success'
    : 'text-danger'
})

const iconBgClass = computed(() => {
  if (!props.trend) return 'bg-primary'
  return props.trend === 'up'
    ? 'bg-success'
    : props.trend === 'down'
    ? 'bg-danger'
    : 'bg-primary'
})
</script>
