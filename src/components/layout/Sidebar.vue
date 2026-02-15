<template>
  <aside
    :class="[
      'hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30',
      uiStore.sidebarCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </div>
        <span v-if="!uiStore.sidebarCollapsed" class="text-lg font-bold text-gray-900 dark:text-white">
          BookMyPitch
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.route">
          <router-link
            :to="{ name: item.route }"
            :class="[
              'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              $route.name === item.route
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <component
              :is="getIcon(item.icon)"
              class="w-5 h-5 flex-shrink-0"
            />
            <span v-if="!uiStore.sidebarCollapsed" class="ml-3">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Collapse Toggle -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="uiStore.toggleSidebar"
        class="w-full flex items-center justify-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronLeftIcon v-if="!uiStore.sidebarCollapsed" class="w-5 h-5" />
        <ChevronRightIcon v-else class="w-5 h-5" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useUIStore } from '@stores/ui'
import {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  MapIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon
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
