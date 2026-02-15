<template>
  <header class="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
    <div class="h-full px-4 lg:px-6 flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <!-- Mobile Menu Button -->
        <button
          @click="uiStore.toggleMobileSidebar"
          class="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Desktop Collapse Toggle -->
        <button
          @click="uiStore.toggleSidebar"
          class="hidden lg:block p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Page Title -->
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $route.meta.title || 'BookMyPitch' }}
        </h1>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-2">
        <!-- Search (Desktop) -->
        <div class="hidden md:flex items-center">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              class="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <!-- Dark Mode Toggle -->
        <button
          @click="uiStore.toggleDarkMode"
          class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <MoonIcon v-if="!uiStore.darkMode" class="w-5 h-5" />
          <SunIcon v-else class="w-5 h-5" />
        </button>

        <!-- Notifications -->
        <Menu as="div" class="relative">
          <MenuButton class="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <BellIcon class="w-5 h-5" />
            <span v-if="unreadNotifications > 0" class="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 mt-2 w-80 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <MenuItem v-for="notification in uiStore.notifications.slice(0, 5)" :key="notification.id">
                  <div class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <p class="text-sm text-gray-900 dark:text-white">{{ notification.message }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(notification.timestamp) }}</p>
                  </div>
                </MenuItem>
                <div v-if="uiStore.notifications.length === 0" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Aucune notification
                </div>
              </div>
            </MenuItems>
          </transition>
        </Menu>

        <!-- Profile -->
        <Menu as="div" class="relative">
          <MenuButton class="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">AD</span>
            </div>
            <ChevronDownIcon class="hidden sm:block w-4 h-4 text-gray-600 dark:text-gray-400" />
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Utilisateur Admin</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">admin@bookmypitch.com</p>
              </div>
              <div class="py-2">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      'w-full px-4 py-2 text-left text-sm',
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    ]"
                  >
                    <UserIcon class="w-4 h-4 inline mr-2" />
                    Profil
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      'w-full px-4 py-2 text-left text-sm',
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    ]"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4 inline mr-2" />
                    Déconnexion
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '@stores/ui'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { formatDistanceToNow } from 'date-fns'

const uiStore = useUIStore()

const unreadNotifications = computed(() =>
  uiStore.notifications.filter(n => !n.read).length
)

const formatTime = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}
</script>
