import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)
  const darkMode = ref(false)
  const notifications = ref([])

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleMobileSidebar() {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.documentElement.classList.toggle('dark', darkMode.value)
    localStorage.setItem('darkMode', darkMode.value)
  }

  function initDarkMode() {
    const stored = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    darkMode.value = stored ? stored === 'true' : prefersDark
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  function addNotification(notification) {
    notifications.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...notification,
      read: false
    })
  }

  function markNotificationAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function clearNotifications() {
    notifications.value = []
  }

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    darkMode,
    notifications,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    toggleDarkMode,
    initDarkMode,
    addNotification,
    markNotificationAsRead,
    clearNotifications
  }
})
