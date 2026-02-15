<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage bookings in calendar format
        </p>
      </div>
      <BaseButton @click="openCreateModal" :icon="PlusIcon">
        New Booking
      </BaseButton>
    </div>

    <!-- Controls -->
    <BaseCard padding="md">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- View Switcher -->
        <div class="flex items-center gap-2">
          <button
            v-for="view in views"
            :key="view.value"
            @click="currentView = view.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentView === view.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            {{ view.label }}
          </button>
        </div>

        <!-- Date Navigation -->
        <div class="flex items-center gap-3">
          <button
            @click="navigateDate(-1)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <ChevronLeftIcon class="w-5 h-5" />
          </button>
          <button
            @click="goToToday"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Today
          </button>
          <button
            @click="navigateDate(1)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <ChevronRightIcon class="w-5 h-5" />
          </button>
          <span class="text-lg font-semibold text-gray-900 dark:text-white ml-2">
            {{ currentDateLabel }}
          </span>
        </div>
      </div>
    </BaseCard>

    <!-- Calendar Grid -->
    <BaseCard padding="none">
      <div class="overflow-x-auto">
        <!-- Day View -->
        <div v-if="currentView === 'day'" class="min-w-[800px]">
          <!-- Header -->
          <div
            class="grid border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            :style="{ gridTemplateColumns: `80px repeat(${fieldsStore.fields.length}, 1fr)` }"
          >
            <div class="p-3 border-r border-gray-200 dark:border-gray-700"></div>
            <div
              v-for="field in fieldsStore.fields"
              :key="field.id"
              class="p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
            >
              <div class="font-semibold text-gray-900 dark:text-white text-sm">{{ field.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ field.type }}</div>
            </div>
          </div>

          <!-- Time Slots -->
          <div class="relative">
            <div
              v-for="hour in timeSlots"
              :key="hour"
              class="grid border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              :style="{ gridTemplateColumns: `80px repeat(${fieldsStore.fields.length}, 1fr)` }"
            >
              <!-- Time Label -->
              <div class="p-2 text-sm text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {{ formatHour(hour) }}
              </div>

              <!-- Field Columns -->
              <div
                v-for="field in fieldsStore.fields"
                :key="field.id"
                class="relative h-16 border-r border-gray-200 dark:border-gray-700 last:border-r-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                @click="handleSlotClick(field.id, hour)"
              >
                <!-- Bookings -->
                <div
                  v-for="booking in getBookingsForSlot(field.id, hour)"
                  :key="booking.id"
                  :class="[
                    'absolute left-1 right-1 rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all hover:shadow-md',
                    getBookingColor(booking.status),
                    booking.isSubscription ? 'border-l-4 border-yellow-400' : ''
                  ]"
                  :style="getBookingStyle(booking)"
                  @click.stop="viewBooking(booking)"
                >
                  <div class="flex items-center justify-between">
                    <div class="font-semibold truncate flex-1">{{ booking.customerName }}</div>
                    <span v-if="booking.isSubscription" class="text-yellow-300 ml-1" title="Subscription">⭐</span>
                  </div>
                  <div class="text-xs opacity-90">{{ booking.startTime }} - {{ calculateEndTime(booking) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div v-if="currentView === 'week'" class="min-w-[1000px]">
          <!-- Header -->
          <div class="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div class="p-3 border-r border-gray-200 dark:border-gray-700"></div>
            <div
              v-for="day in weekDays"
              :key="day.date"
              class="p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
            >
              <div class="font-semibold text-gray-900 dark:text-white text-sm">{{ day.dayName }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ day.dateStr }}</div>
            </div>
          </div>

          <!-- Time Slots -->
          <div class="relative">
            <div
              v-for="hour in timeSlots"
              :key="hour"
              class="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <!-- Time Label -->
              <div class="p-2 text-sm text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {{ formatHour(hour) }}
              </div>

              <!-- Day Columns -->
              <div
                v-for="day in weekDays"
                :key="day.date"
                class="relative h-16 border-r border-gray-200 dark:border-gray-700 last:border-r-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                @click="handleWeekSlotClick(day.date, hour)"
              >
                <!-- Bookings -->
                <div
                  v-for="booking in getWeekBookingsForSlot(day.date, hour)"
                  :key="booking.id"
                  :class="[
                    'absolute left-1 right-1 rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all hover:shadow-md',
                    getBookingColor(booking.status),
                    booking.isSubscription ? 'border-l-4 border-yellow-400' : ''
                  ]"
                  :style="getBookingStyle(booking)"
                  @click.stop="viewBooking(booking)"
                >
                  <div class="flex items-center justify-between">
                    <div class="font-semibold truncate flex-1">{{ booking.fieldName }}</div>
                    <span v-if="booking.isSubscription" class="text-yellow-300 ml-1" title="Subscription">⭐</span>
                  </div>
                  <div class="text-xs opacity-90 truncate">{{ booking.customerName }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Booking Details Modal -->
    <BaseModal
      v-model="showDetailsModal"
      title="Booking Details"
      size="md"
    >
      <div v-if="selectedBooking" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Customer</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.customerName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Field</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.fieldName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedBooking.date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Time</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedBooking.startTime }} - {{ calculateEndTime(selectedBooking) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Duration</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.duration }} hours</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Price</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.price  }} DH</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <BaseBadge :variant="getStatusVariant(selectedBooking.status)">
              {{ selectedBooking.status }}
            </BaseBadge>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Payment</p>
            <BaseBadge :variant="selectedBooking.paymentStatus === 'paid' ? 'success' : 'warning'">
              {{ selectedBooking.paymentStatus }}
            </BaseBadge>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Booking Type</p>
            <BaseBadge :variant="selectedBooking.isSubscription ? 'info' : 'gray'">
              {{ selectedBooking.isSubscription ? '⭐ Subscription' : 'Regular' }}
            </BaseBadge>
          </div>
        </div>
        <div v-if="selectedBooking.notes" class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">Notes</p>
          <p class="text-gray-900 dark:text-white">{{ selectedBooking.notes }}</p>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="showDetailsModal = false">
          Close
        </BaseButton>
        <BaseButton @click="editSelectedBooking">
          Edit Booking
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Create Booking Modal -->
    <BaseModal
      v-model="showCreateModal"
      title="Create New Booking"
      size="lg"
    >
      <form @submit.prevent="saveBooking" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="bookingForm.customerId"
            label="Customer"
            required
            :options="customerOptions"
            placeholder="Select customer"
          />
          <BaseSelect
            v-model="bookingForm.fieldId"
            label="Field"
            required
            :options="fieldOptions"
            placeholder="Select field"
          />
          <BaseDatePicker
            v-model="bookingForm.date"
            label="Date"
            required
            placeholder="Select booking date"
          />
          <BaseTimePicker
            v-model="bookingForm.startTime"
            label="Start Time"
            required
            placeholder="Select start time"
          />
          <BaseInput
            v-model="bookingForm.duration"
            label="Duration (hours)"
            type="number"
            step="0.5"
            min="0.5"
            required
          />
          <BaseInput
            v-model="bookingForm.price"
            label="Price (DH)"
            type="number"
            min="0"
            required
          />
        </div>

        <BaseTextarea
          v-model="bookingForm.notes"
          label="Notes (Optional)"
          placeholder="Add any special requirements or notes..."
          :rows="3"
        />

        <div class="flex justify-end gap-3 pt-4">
          <BaseButton type="button" variant="secondary" @click="showCreateModal = false">
            Cancel
          </BaseButton>
          <BaseButton type="submit" :loading="saving">
            Create Booking
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookingsStore } from '@stores/bookings'
import { useFieldsStore } from '@stores/fields'
import { useCustomersStore } from '@stores/customers'
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { format, addDays, startOfWeek, addWeeks, subWeeks, subDays } from 'date-fns'

import BaseCard from '@components/ui/BaseCard.vue'
import BaseButton from '@components/ui/BaseButton.vue'
import BaseBadge from '@components/ui/BaseBadge.vue'
import BaseModal from '@components/ui/BaseModal.vue'
import BaseSelect from '@components/ui/BaseSelect.vue'
import BaseInput from '@components/ui/BaseInput.vue'
import BaseTextarea from '@components/ui/BaseTextarea.vue'
import BaseDatePicker from '@components/ui/BaseDatePicker.vue'
import BaseTimePicker from '@components/ui/BaseTimePicker.vue'

const bookingsStore = useBookingsStore()
const fieldsStore = useFieldsStore()
const customersStore = useCustomersStore()

// View State
const currentView = ref('day')
const currentDate = ref(new Date())
const showDetailsModal = ref(false)
const showCreateModal = ref(false)
const selectedBooking = ref(null)
const saving = ref(false)

// Form Data
const bookingForm = ref({
  customerId: '',
  fieldId: '',
  date: '',
  startTime: '',
  duration: 2,
  price: 100,
  notes: ''
})

// Views
const views = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' }
]

// Time Slots (8 AM to 10 PM)
const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8)

// Current Date Label
const currentDateLabel = computed(() => {
  if (currentView.value === 'day') {
    return format(currentDate.value, 'MMMM dd, yyyy')
  } else {
    const weekStart = startOfWeek(currentDate.value, { weekStartsOn: 1 })
    const weekEnd = addDays(weekStart, 6)
    return `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
  }
})

// Week Days
const weekDays = computed(() => {
  const weekStart = startOfWeek(currentDate.value, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i)
    return {
      date: format(day, 'yyyy-MM-dd'),
      dayName: format(day, 'EEE'),
      dateStr: format(day, 'MMM dd')
    }
  })
})

// Options
const customerOptions = computed(() =>
  customersStore.customers.map(c => ({
    value: c.id,
    label: `${c.name} (${c.phone})`
  }))
)

const fieldOptions = computed(() =>
  fieldsStore.fields.map(f => ({
    value: f.id,
    label: `${f.name} (${f.type}) - ${f.hourlyRate} DH/hr`
  }))
)

// Navigation
const navigateDate = (direction) => {
  if (currentView.value === 'day') {
    currentDate.value = direction > 0
      ? addDays(currentDate.value, 1)
      : subDays(currentDate.value, 1)
  } else {
    currentDate.value = direction > 0
      ? addWeeks(currentDate.value, 1)
      : subWeeks(currentDate.value, 1)
  }
}

const goToToday = () => {
  currentDate.value = new Date()
}

// Get Bookings for Day View (only show in starting hour)
const getBookingsForSlot = (fieldId, hour) => {
  const dateStr = format(currentDate.value, 'yyyy-MM-dd')
  return bookingsStore.bookings.filter(booking => {
    if (booking.fieldId !== fieldId || booking.date !== dateStr) return false
    const bookingHour = parseInt(booking.startTime.split(':')[0])
    // Only render booking in its starting hour slot
    return hour === bookingHour
  })
}

// Get Bookings for Week View (only show in starting hour)
const getWeekBookingsForSlot = (date, hour) => {
  return bookingsStore.bookings.filter(booking => {
    if (booking.date !== date) return false
    const bookingHour = parseInt(booking.startTime.split(':')[0])
    // Only render booking in its starting hour slot
    return hour === bookingHour
  })
}

// Booking Styles
const getBookingStyle = (booking) => {
  const height = booking.duration * 64 // 64px per hour

  return {
    top: '0px',
    height: `${height - 2}px`,
    zIndex: 10
  }
}

const getBookingColor = (status) => {
  const colors = {
    confirmed: 'bg-blue-500 text-white',
    pending: 'bg-yellow-500 text-white',
    completed: 'bg-green-500 text-white',
    cancelled: 'bg-red-500 text-white'
  }
  return colors[status] || 'bg-gray-500 text-white'
}

const getStatusVariant = (status) => {
  const variants = {
    confirmed: 'success',
    pending: 'warning',
    completed: 'info',
    cancelled: 'danger'
  }
  return variants[status] || 'gray'
}

// Helpers
const formatHour = (hour) => {
  return hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const calculateEndTime = (booking) => {
  const [hours, minutes] = booking.startTime.split(':').map(Number)
  const endHour = hours + Math.floor(booking.duration)
  const endMinutes = minutes + (booking.duration % 1) * 60
  return `${String(endHour).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}

// Actions
const handleSlotClick = (fieldId, hour) => {
  bookingForm.value.fieldId = fieldId
  bookingForm.value.date = format(currentDate.value, 'yyyy-MM-dd')
  bookingForm.value.startTime = `${String(hour).padStart(2, '0')}:00`
  showCreateModal.value = true
}

const handleWeekSlotClick = (date, hour) => {
  bookingForm.value.date = date
  bookingForm.value.startTime = `${String(hour).padStart(2, '0')}:00`
  showCreateModal.value = true
}

const openCreateModal = () => {
  resetForm()
  showCreateModal.value = true
}

const viewBooking = (booking) => {
  selectedBooking.value = booking
  showDetailsModal.value = true
}

const editSelectedBooking = () => {
  showDetailsModal.value = false
  // In a real app, would navigate to edit page
  alert('Edit functionality would open edit form')
}

const saveBooking = () => {
  saving.value = true

  const customer = customersStore.customers.find(c => c.id === bookingForm.value.customerId)
  const field = fieldsStore.fields.find(f => f.id === bookingForm.value.fieldId)

  const bookingData = {
    ...bookingForm.value,
    customerName: customer?.name || '',
    customerPhone: customer?.phone || '',
    fieldName: field?.name || ''
  }

  setTimeout(() => {
    bookingsStore.createBooking(bookingData)
    saving.value = false
    showCreateModal.value = false
    resetForm()
  }, 500)
}

const resetForm = () => {
  bookingForm.value = {
    customerId: '',
    fieldId: '',
    date: format(currentDate.value, 'yyyy-MM-dd'),
    startTime: '18:00',
    duration: 2,
    price: 100,
    notes: ''
  }
}
</script>
