<template>
  <div class="w-full">
    <Combobox
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :disabled="disabled"
    >
      <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {{ label }}
        <span v-if="required" class="text-danger">*</span>
      </label>

      <div class="relative">
        <ComboboxInput
          :displayValue="(value) => getDisplayValue(value)"
          @change="query = $event.target.value"
          :placeholder="placeholder"
          :required="required"
          :class="inputClasses"
          autocomplete="off"
        />

        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredOptions.length === 0 && query !== ''"
              class="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300"
            >
              No results found.
            </div>

            <ComboboxOption
              v-for="option in filteredOptions"
              :key="option.value"
              :value="option.value"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  'relative cursor-pointer select-none py-2 pl-3 pr-9',
                  active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                ]"
              >
                <span :class="['block truncate', selected ? 'font-semibold' : 'font-normal']">
                  {{ option.label }}
                </span>

                <span
                  v-if="selected"
                  :class="[
                    'absolute inset-y-0 right-0 flex items-center pr-4',
                    active ? 'text-white' : 'text-primary'
                  ]"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>

    <p v-if="error" class="mt-1.5 text-sm text-danger">
      {{ error }}
    </p>

    <p v-else-if="hint" class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

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

const query = ref('')

const filteredOptions = computed(() => {
  if (query.value === '') {
    return props.options
  }

  return props.options.filter((option) =>
    option.label.toLowerCase().includes(query.value.toLowerCase())
  )
})

const getDisplayValue = (value) => {
  if (!value) return ''
  const option = props.options.find(o => o.value === value)
  return option ? option.label : ''
}

const inputClasses = computed(() => [
  'w-full py-2 pl-3 pr-10 border rounded-lg text-sm transition-colors',
  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  {
    'border-danger focus:ring-danger': props.error,
    'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary': !props.error,
    'opacity-50 cursor-not-allowed': props.disabled
  }
])
</script>
