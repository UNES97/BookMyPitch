<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        readonly
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ClockIcon class="w-5 h-5 text-gray-400" />
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import { ClockIcon } from '@heroicons/vue/24/outline'
import { useUIStore } from '@stores/ui'

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: {
    type: String,
    default: 'Select time...'
  },
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
  enableSeconds: {
    type: Boolean,
    default: false
  },
  timeFormat: {
    type: String,
    default: 'H:i'
  }
})

const emit = defineEmits(['update:modelValue'])

const uiStore = useUIStore()
const inputRef = ref(null)
const flatpickrInstance = ref(null)
const inputId = computed(() => `timepicker-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => [
  'w-full px-3 py-2 pr-10 border rounded-lg text-sm transition-colors cursor-pointer',
  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  {
    'border-danger focus:ring-danger': props.error,
    'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary': !props.error,
    'opacity-50 cursor-not-allowed': props.disabled
  }
])

onMounted(() => {
  if (!inputRef.value) return

  flatpickrInstance.value = flatpickr(inputRef.value, {
    enableTime: true,
    noCalendar: true,
    dateFormat: props.timeFormat,
    time_24hr: true,
    enableSeconds: props.enableSeconds,
    defaultDate: props.modelValue,
    onChange: (selectedDates, dateStr) => {
      emit('update:modelValue', dateStr)
    },
    onReady: function(selectedDates, dateStr, instance) {
      if (uiStore.darkMode) {
        instance.calendarContainer.classList.add('flatpickr-dark')
      }
    }
  })
})

watch(() => uiStore.darkMode, (isDark) => {
  if (flatpickrInstance.value?.calendarContainer) {
    if (isDark) {
      flatpickrInstance.value.calendarContainer.classList.add('flatpickr-dark')
    } else {
      flatpickrInstance.value.calendarContainer.classList.remove('flatpickr-dark')
    }
  }
})

watch(() => props.modelValue, (newValue) => {
  if (flatpickrInstance.value && newValue !== flatpickrInstance.value.input.value) {
    flatpickrInstance.value.setDate(newValue, false)
  }
})

onBeforeUnmount(() => {
  if (flatpickrInstance.value) {
    flatpickrInstance.value.destroy()
  }
})
</script>

<style scoped>
/* Styles are inherited from BaseDatePicker global styles */
</style>
