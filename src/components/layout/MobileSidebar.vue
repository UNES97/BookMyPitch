<template>
  <TransitionRoot :show="uiStore.mobileSidebarOpen" as="template">
    <Dialog as="div" class="relative z-40 lg:hidden" @close="uiStore.closeMobileSidebar">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/80" />
      </TransitionChild>

      <div class="fixed inset-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
            <!-- Close button -->
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button type="button" class="-m-2.5 p-2.5" @click="uiStore.closeMobileSidebar">
                  <span class="sr-only">Close sidebar</span>
                  <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>

            <!-- Sidebar content -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4">
              <!-- Logo -->
              <div class="flex h-16 shrink-0 items-center">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </div>
                  <span class="text-lg font-bold text-gray-900 dark:text-white">BookMyPitch</span>
                </div>
              </div>

              <!-- Navigation -->
              <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" class="-mx-2 space-y-1">
                      <li v-for="item in navItems" :key="item.route">
                        <router-link
                          :to="{ name: item.route }"
                          @click="uiStore.closeMobileSidebar"
                          :class="[
                            'flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            $route.name === item.route
                              ? 'bg-primary text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          ]"
                        >
                          <component :is="getIcon(item.icon)" class="h-6 w-6 shrink-0" />
                          {{ item.name }}
                        </router-link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { useUIStore } from '@stores/ui'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  MapIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const uiStore = useUIStore()

const navItems = [
  { name: 'Dashboard', route: 'dashboard', icon: 'HomeIcon' },
  { name: 'Calendar', route: 'calendar', icon: 'CalendarIcon' },
  { name: 'Bookings', route: 'bookings', icon: 'ClipboardDocumentListIcon' },
  { name: 'Subscriptions', route: 'subscriptions', icon: 'ArrowPathIcon' },
  { name: 'Fields', route: 'fields', icon: 'MapIcon' },
  { name: 'Customers', route: 'customers', icon: 'UsersIcon' },
  { name: 'Payments', route: 'payments', icon: 'CurrencyDollarIcon' },
  { name: 'Settings', route: 'settings', icon: 'Cog6ToothIcon' }
]

const iconMap = {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  MapIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon
}

const getIcon = (iconName) => iconMap[iconName]
</script>
