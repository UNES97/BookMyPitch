import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockBookings } from '@utils/mockData'
import { format } from 'date-fns'

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref([])
  const loading = ref(false)

  const upcomingBookings = computed(() =>
    bookings.value
      .filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  )

  const todayBookings = computed(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return bookings.value.filter(b => b.date === today)
  })

  const completedBookings = computed(() =>
    bookings.value.filter(b => b.status === 'completed')
  )

  const pendingBookings = computed(() =>
    bookings.value.filter(b => b.status === 'pending')
  )

  const recentBookings = computed(() =>
    bookings.value
      .filter(b => b.status !== 'cancelled')
      .slice(0, 10)
  )

  function fetchBookings() {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      bookings.value = generateMockBookings(100)
      loading.value = false
    }, 500)
  }

  function createBooking(booking) {
    const newBooking = {
      id: `BK-${Date.now()}`,
      ...booking,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'pending'
    }
    bookings.value.unshift(newBooking)
    return newBooking
  }

  function updateBooking(id, updates) {
    const index = bookings.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bookings.value[index] = { ...bookings.value[index], ...updates }
      return bookings.value[index]
    }
    return null
  }

  function deleteBooking(id) {
    const index = bookings.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bookings.value.splice(index, 1)
      return true
    }
    return false
  }

  function cancelBooking(id) {
    return updateBooking(id, { status: 'cancelled' })
  }

  function getBookingById(id) {
    return bookings.value.find(b => b.id === id)
  }

  function getBookingsByField(fieldId) {
    return bookings.value.filter(b => b.fieldId === fieldId)
  }

  function getBookingsByCustomer(customerId) {
    return bookings.value.filter(b => b.customerId === customerId)
  }

  function getBookingsByDateRange(startDate, endDate) {
    return bookings.value.filter(b => {
      const bookingDate = new Date(b.date)
      return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate)
    })
  }

  return {
    bookings,
    loading,
    upcomingBookings,
    todayBookings,
    completedBookings,
    pendingBookings,
    recentBookings,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    cancelBooking,
    getBookingById,
    getBookingsByField,
    getBookingsByCustomer,
    getBookingsByDateRange
  }
})
