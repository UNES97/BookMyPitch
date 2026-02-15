<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <!-- Desktop Sidebar -->
    <Sidebar />

    <!-- Mobile Sidebar -->
    <MobileSidebar />

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col min-h-screen transition-all duration-300"
      :class="{
        'lg:ml-64': !uiStore.sidebarCollapsed,
        'lg:ml-20': uiStore.sidebarCollapsed
      }"
    >
      <!-- Top Bar -->
      <Topbar />

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@stores/ui'
import { useBookingsStore } from '@stores/bookings'
import { useFieldsStore } from '@stores/fields'
import { useCustomersStore } from '@stores/customers'
import { useSubscriptionsStore } from '@stores/subscriptions'
import { usePaymentsStore } from '@stores/payments'
import { useSettingsStore } from '@stores/settings'
import Sidebar from './Sidebar.vue'
import MobileSidebar from './MobileSidebar.vue'
import Topbar from './Topbar.vue'

const router = useRouter()
const uiStore = useUIStore()
const bookingsStore = useBookingsStore()
const fieldsStore = useFieldsStore()
const customersStore = useCustomersStore()
const subscriptionsStore = useSubscriptionsStore()
const paymentsStore = usePaymentsStore()
const settingsStore = useSettingsStore()

onMounted(() => {
  // Initialize dark mode
  uiStore.initDarkMode()

  // Load all data
  bookingsStore.fetchBookings()
  fieldsStore.fetchFields()
  customersStore.fetchCustomers()
  subscriptionsStore.fetchSubscriptions()
  paymentsStore.fetchRevenue()
  settingsStore.loadSettings()

  // Add some sample notifications
  uiStore.addNotification({
    type: 'success',
    message: 'New booking confirmed for Field A',
    timestamp: new Date().toISOString()
  })
})

// Close mobile sidebar on route change
router.afterEach(() => {
  uiStore.closeMobileSidebar()
})
</script>
