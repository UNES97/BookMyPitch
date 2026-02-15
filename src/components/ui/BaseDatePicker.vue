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
        <CalendarIcon class="w-5 h-5 text-gray-400" />
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
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { useUIStore } from '@stores/ui'

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: {
    type: String,
    default: 'Select date...'
  },
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
  mode: {
    type: String,
    default: 'single', // single, multiple, range
    validator: (v) => ['single', 'multiple', 'range'].includes(v)
  },
  minDate: String,
  maxDate: String,
  enableTime: Boolean,
  dateFormat: {
    type: String,
    default: 'Y-m-d'
  }
})

const emit = defineEmits(['update:modelValue'])

const uiStore = useUIStore()
const inputRef = ref(null)
const flatpickrInstance = ref(null)
const inputId = computed(() => `datepicker-${Math.random().toString(36).substr(2, 9)}`)

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
    mode: props.mode,
    dateFormat: props.dateFormat,
    enableTime: props.enableTime,
    minDate: props.minDate,
    maxDate: props.maxDate,
    defaultDate: props.modelValue,
    onChange: (selectedDates, dateStr) => {
      emit('update:modelValue', dateStr)
    },
    onReady: function(selectedDates, dateStr, instance) {
      // Apply dark mode styling
      if (uiStore.darkMode) {
        instance.calendarContainer.classList.add('flatpickr-dark')
      }
    }
  })
})

// Watch for dark mode changes
watch(() => uiStore.darkMode, (isDark) => {
  if (flatpickrInstance.value?.calendarContainer) {
    if (isDark) {
      flatpickrInstance.value.calendarContainer.classList.add('flatpickr-dark')
    } else {
      flatpickrInstance.value.calendarContainer.classList.remove('flatpickr-dark')
    }
  }
})

// Watch for value changes from parent
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

<style>
/* Flatpickr Dark Mode Styles */
.flatpickr-dark.flatpickr-calendar {
  background: #1f2937;
  border-color: #374151;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.flatpickr-dark .flatpickr-months {
  background: #1f2937;
}

.flatpickr-dark .flatpickr-months .flatpickr-month {
  color: #f9fafb;
}

.flatpickr-dark .flatpickr-current-month .flatpickr-monthDropdown-months {
  background: #374151;
  color: #f9fafb;
}

.flatpickr-dark .flatpickr-weekdays {
  background: #1f2937;
}

.flatpickr-dark .flatpickr-weekday {
  color: #9ca3af;
}

.flatpickr-dark .flatpickr-day {
  color: #e5e7eb;
}

.flatpickr-dark .flatpickr-day:hover {
  background: #374151;
  border-color: #374151;
}

.flatpickr-dark .flatpickr-day.selected {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.flatpickr-dark .flatpickr-day.today {
  border-color: #2563eb;
}

.flatpickr-dark .flatpickr-day.today:hover {
  background: #374151;
  border-color: #2563eb;
}

.flatpickr-dark .flatpickr-time {
  background: #1f2937;
  border-color: #374151;
}

.flatpickr-dark .flatpickr-time input {
  background: #374151;
  color: #f9fafb;
}

.flatpickr-dark .numInputWrapper:hover {
  background: #4b5563;
}

.flatpickr-dark .flatpickr-current-month input.cur-year {
  color: #f9fafb;
}

.flatpickr-dark .flatpickr-prev-month,
.flatpickr-dark .flatpickr-next-month {
  color: #9ca3af;
}

.flatpickr-dark .flatpickr-prev-month:hover,
.flatpickr-dark .flatpickr-next-month:hover {
  color: #f9fafb;
}

/* Light Mode Customization */
.flatpickr-calendar {
  font-family: 'Plus Jakarta Sans', sans-serif;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.flatpickr-day.selected {
  background: #2563eb;
  border-color: #2563eb;
}

.flatpickr-day.selected:hover {
  background: #1e40af;
  border-color: #1e40af;
}

.flatpickr-day.today {
  border-color: #2563eb;
}
</style>
