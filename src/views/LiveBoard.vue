<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
    <!-- Fullscreen Toggle Button -->
    <button
      @click="toggleFullscreen"
      class="fixed top-3 right-3 z-50 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-2 border border-gray-300 dark:border-gray-700"
    >
      <component :is="isFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="w-4 h-4" />
      <span class="text-xs">{{ isFullscreen ? 'Quitter' : 'Plein Écran' }}</span>
    </button>

    <div class="p-6">
      <!-- Header -->
      <div class="text-center text-gray-900 dark:text-gray-200 mb-6">
        <div class="text-4xl font-bold tracking-wide mb-2">{{ currentTime }}</div>
        <div class="text-lg text-gray-600 dark:text-gray-400 capitalize">{{ currentDate }}</div>
      </div>

      <!-- Field Status Grid -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4 px-2">État des Terrains</h2>
        <div class="grid grid-cols-3 gap-4 max-w-7xl mx-auto">
          <div
            v-for="field in fieldsStore.fields"
            :key="field.id"
            :class="[
              'p-6 rounded-xl transition-all duration-300 border',
              getFieldStatus(field.id).available
                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            ]"
          >
            <div class="text-center">
              <div class="flex items-center justify-between mb-4">
                <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ field.name }}</div>
                <div :class="[
                  'w-3 h-3 rounded-full',
                  getFieldStatus(field.id).available ? 'bg-green-500' : 'bg-red-500'
                ]"></div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ field.type }}</div>
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div :class="[
                  'text-sm font-semibold mb-2',
                  getFieldStatus(field.id).available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                ]">
                  {{ getFieldStatus(field.id).available ? 'Disponible' : 'Occupé' }}
                </div>
                <div v-if="!getFieldStatus(field.id).available" class="mt-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ getFieldStatus(field.id).customerName }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-500 mt-1">{{ getFieldStatus(field.id).timeSlot }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Matches -->
      <div class="mb-8 max-w-7xl mx-auto" v-if="currentMatches.length > 0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4 px-2 flex items-center gap-2">
          <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          En Cours
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="match in currentMatches"
            :key="match.id"
            class="bg-gray-50 dark:bg-gray-800 border border-red-200 dark:border-red-900/50 p-5 rounded-xl"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-medium mb-2">EN DIRECT</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{{ match.fieldName }}</div>
                <div class="text-base text-gray-700 dark:text-gray-300 mb-2">{{ match.customerName }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-500">
                  {{ match.startTime }} - {{ match.endTime }}
                </div>
              </div>
              <div class="ml-4">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Matches -->
      <div class="mb-8 max-w-7xl mx-auto" v-if="upcomingMatches.length > 0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4 px-2">À Venir</h2>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-400">Heure</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-400">Terrain</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-400">Client</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-400">Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(match, index) in upcomingMatches"
                :key="match.id"
                :class="[
                  'border-b border-gray-200 dark:border-gray-700/50',
                  index % 2 === 0 ? 'bg-gray-100/50 dark:bg-gray-900/20' : ''
                ]"
              >
                <td class="px-6 py-4 text-lg font-bold text-gray-900 dark:text-gray-200">{{ match.startTime }}</td>
                <td class="px-6 py-4 text-base font-semibold text-gray-800 dark:text-gray-300">{{ match.fieldName }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ match.customerName }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ match.duration }}h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFieldsStore } from '@stores/fields'
import { useBookingsStore } from '@stores/bookings'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/vue/24/outline'

const fieldsStore = useFieldsStore()
const bookingsStore = useBookingsStore()

const currentTime = ref('')
const currentDate = ref('')
const isFullscreen = ref(false)
let intervalId = null

// Update time every second
const updateTime = () => {
  const now = new Date()
  currentTime.value = format(now, 'HH:mm:ss')
  currentDate.value = format(now, 'EEEE d MMMM yyyy', { locale: fr })
}

// Fullscreen toggle
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// Listen for fullscreen changes
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// Get current matches (happening now)
const currentMatches = computed(() => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinutes = now.getMinutes()
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`

  return bookingsStore.bookings
    .filter(booking => {
      // Check if booking is today
      const bookingDate = new Date(booking.date)
      const isToday = bookingDate.toDateString() === now.toDateString()

      if (!isToday) return false

      // Check if current time is within booking time slot
      const [startHour, startMin] = booking.startTime.split(':').map(Number)
      const endHour = startHour + booking.duration

      return currentHour >= startHour && currentHour < endHour
    })
    .map(booking => ({
      ...booking,
      endTime: calculateEndTime(booking.startTime, booking.duration)
    }))
    .slice(0, 4)
})

// Get upcoming matches (next 5)
const upcomingMatches = computed(() => {
  const now = new Date()

  return bookingsStore.bookings
    .filter(booking => {
      const bookingDate = new Date(booking.date)
      const isToday = bookingDate.toDateString() === now.toDateString()

      if (!isToday) return false

      const [startHour] = booking.startTime.split(':').map(Number)
      return startHour > now.getHours()
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 5)
})

// Calculate end time
const calculateEndTime = (startTime, duration) => {
  const [hour, minute] = startTime.split(':').map(Number)
  const endHour = hour + duration
  return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// Get field status
const getFieldStatus = (fieldId) => {
  const now = new Date()
  const currentBooking = currentMatches.value.find(m => m.fieldId === fieldId)

  if (currentBooking) {
    return {
      available: false,
      customerName: currentBooking.customerName,
      timeSlot: `${currentBooking.startTime} - ${currentBooking.endTime}`
    }
  }

  return { available: true }
}

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>
