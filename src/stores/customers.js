import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockCustomers } from '@utils/mockData'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref([])
  const loading = ref(false)

  const activeCustomers = computed(() =>
    customers.value.filter(c => c.status === 'active')
  )

  const subscribedCustomers = computed(() =>
    customers.value.filter(c => c.subscriptionStatus === 'subscribed')
  )

  const topCustomers = computed(() =>
    [...customers.value]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)
  )

  function fetchCustomers() {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      customers.value = generateMockCustomers(50)
      loading.value = false
    }, 400)
  }

  function createCustomer(customer) {
    const newCustomer = {
      id: `CUS-${Date.now()}`,
      ...customer,
      joinedDate: new Date().toISOString().split('T')[0],
      totalBookings: 0,
      totalRevenue: 0,
      status: 'active',
      subscriptionStatus: 'none'
    }
    customers.value.push(newCustomer)
    return newCustomer
  }

  function updateCustomer(id, updates) {
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updates }
      return customers.value[index]
    }
    return null
  }

  function deleteCustomer(id) {
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.value.splice(index, 1)
      return true
    }
    return false
  }

  function getCustomerById(id) {
    return customers.value.find(c => c.id === id)
  }

  function searchCustomers(query) {
    const lowerQuery = query.toLowerCase()
    return customers.value.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(query)
    )
  }

  function updateCustomerStats(customerId, bookingCount, revenue) {
    const customer = customers.value.find(c => c.id === customerId)
    if (customer) {
      customer.totalBookings += bookingCount
      customer.totalRevenue += revenue
    }
  }

  return {
    customers,
    loading,
    activeCustomers,
    subscribedCustomers,
    topCustomers,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    searchCustomers,
    updateCustomerStats
  }
})
