<template>
  <div class="flex items-center">
    <Switch
      :checked="modelValue"
      @update:checked="$emit('update:modelValue', $event)"
      :class="[
        modelValue ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      ]"
    >
      <span class="sr-only">{{ label }}</span>
      <span
        :class="[
          modelValue ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        ]"
      />
    </Switch>
    <span v-if="label" class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </span>
  </div>
</template>

<script setup>
import { Switch } from '@headlessui/vue'

defineProps({
  modelValue: Boolean,
  label: String
})

defineEmits(['update:modelValue'])
</script>
