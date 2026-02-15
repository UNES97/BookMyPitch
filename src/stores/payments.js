import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockRevenue, generatePaymentMethods } from '@utils/mockData'
import { useBookingsStore } from './bookings'
import { format } from 'date-fns'

export const usePaymentsStore = defineStore('payments', () => {
  const revenue = ref({ dailyRevenue: [], monthlyRevenue: [] })
  const paymentMethods = ref([])
  const loading = ref(false)

  const todayRevenue = computed(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayData = revenue.value.dailyRevenue.find(d => d.date === today)
    return todayData ? todayData.amount : 0
  })

  const weekRevenue = computed(() => {
    const last7Days = revenue.value.dailyRevenue.slice(-7)
    return last7Days.reduce((sum, day) => sum + day.amount, 0)
  })

  const monthRevenue = computed(() => {
    const last30Days = revenue.value.dailyRevenue
    return last30Days.reduce((sum, day) => sum + day.amount, 0)
  })

  const pendingAmount = computed(() => {
    const bookingsStore = useBookingsStore()
    return bookingsStore.bookings
      .filter(b => b.paymentStatus === 'pending')
      .reduce((sum, b) => sum + b.price, 0)
  })

  const pendingCount = computed(() => {
    const bookingsStore = useBookingsStore()
    return bookingsStore.bookings.filter(b => b.paymentStatus === 'pending').length
  })

  function fetchRevenue() {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      revenue.value = generateMockRevenue()
      paymentMethods.value = generatePaymentMethods()
      loading.value = false
    }, 300)
  }

  function getRevenueByDateRange(startDate, endDate) {
    return revenue.value.dailyRevenue.filter(d => {
      const date = new Date(d.date)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })
  }

  function getTotalRevenueByDateRange(startDate, endDate) {
    const rangeRevenue = getRevenueByDateRange(startDate, endDate)
    return rangeRevenue.reduce((sum, day) => sum + day.amount, 0)
  }

  return {
    revenue,
    paymentMethods,
    loading,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    pendingAmount,
    pendingCount,
    fetchRevenue,
    getRevenueByDateRange,
    getTotalRevenueByDateRange
  }
})
