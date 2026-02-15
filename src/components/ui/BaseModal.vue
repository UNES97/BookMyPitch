<template>
  <TransitionRoot :show="modelValue" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel :class="modalClasses">
              <!-- Header -->
              <div v-if="title || $slots.header || showClose" class="flex items-start justify-between mb-6">
                <div class="flex-1">
                  <slot name="header">
                    <DialogTitle v-if="title" class="text-xl font-semibold text-gray-900 dark:text-white">
                      {{ title }}
                    </DialogTitle>
                  </slot>
                </div>
                <button
                  v-if="showClose"
                  @click="closeModal"
                  class="flex-shrink-0 ml-4 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>

              <!-- Body -->
              <div :class="bodyClasses">
                <slot />
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl', 'full'].includes(v)
  },
  persistent: Boolean,
  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl'
}

const modalClasses = computed(() => [
  'relative transform overflow-hidden rounded-modal bg-white dark:bg-gray-800 px-6 py-6 text-left shadow-modal transition-all w-full',
  sizeClasses[props.size]
])

const bodyClasses = computed(() => [
  'text-sm text-gray-600 dark:text-gray-300'
])

const closeModal = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>
