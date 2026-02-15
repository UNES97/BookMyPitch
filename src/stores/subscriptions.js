import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockSubscriptions } from '@utils/mockData'

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const subscriptions = ref([])
  const loading = ref(false)

  const activeSubscriptions = computed(() =>
    subscriptions.value.filter(s => s.status === 'active')
  )

  const pausedSubscriptions = computed(() =>
    subscriptions.value.filter(s => s.status === 'paused')
  )

  const totalMonthlyRevenue = computed(() =>
    activeSubscriptions.value.reduce((sum, s) => sum + s.monthlyRate, 0)
  )

  function fetchSubscriptions() {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      subscriptions.value = generateMockSubscriptions(15)
      loading.value = false
    }, 350)
  }

  function createSubscription(subscription) {
    const newSubscription = {
      id: `SUB-${Date.now()}`,
      ...subscription,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    subscriptions.value.push(newSubscription)
    return newSubscription
  }

  function updateSubscription(id, updates) {
    const index = subscriptions.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subscriptions.value[index] = { ...subscriptions.value[index], ...updates }
      return subscriptions.value[index]
    }
    return null
  }

  function deleteSubscription(id) {
    const index = subscriptions.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subscriptions.value.splice(index, 1)
      return true
    }
    return false
  }

  function pauseSubscription(id) {
    return updateSubscription(id, { status: 'paused' })
  }

  function resumeSubscription(id) {
    return updateSubscription(id, { status: 'active' })
  }

  function cancelSubscription(id) {
    return updateSubscription(id, { status: 'cancelled' })
  }

  function getSubscriptionById(id) {
    return subscriptions.value.find(s => s.id === id)
  }

  function getSubscriptionsByCustomer(customerId) {
    return subscriptions.value.filter(s => s.customerId === customerId)
  }

  function getSubscriptionsByField(fieldId) {
    return subscriptions.value.filter(s => s.fieldId === fieldId)
  }

  return {
    subscriptions,
    loading,
    activeSubscriptions,
    pausedSubscriptions,
    totalMonthlyRevenue,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getSubscriptionById,
    getSubscriptionsByCustomer,
    getSubscriptionsByField
  }
})
