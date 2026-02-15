import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const venueInfo = ref({
    name: 'BookMyPitch Arena',
    address: 'Dubai Sports City, UAE',
    phone: '+971 4 XXX XXXX',
    email: 'info@bookmypitch.com',
    description: 'Premium football field rental facility'
  })

  const workingHours = ref({
    monday: { open: '08:00', close: '22:00', closed: false },
    tuesday: { open: '08:00', close: '22:00', closed: false },
    wednesday: { open: '08:00', close: '22:00', closed: false },
    thursday: { open: '08:00', close: '22:00', closed: false },
    friday: { open: '08:00', close: '23:00', closed: false },
    saturday: { open: '08:00', close: '23:00', closed: false },
    sunday: { open: '08:00', close: '22:00', closed: false }
  })

  const pricing = ref({
    defaultHourlyRate: 100,
    cancellationPolicy: '24 hours before booking',
    depositRequired: true,
    depositPercentage: 50,
    overtimeCharge: 150
  })

  const notifications = ref({
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmed: true,
    bookingCancelled: true,
    paymentReceived: true,
    reminderBeforeBooking: true,
    reminderHours: 24
  })

  const appearance = ref({
    colorScheme: 'light',
    language: 'en'
  })

  const loading = ref(false)

  function loadSettings() {
    loading.value = true
    // Load from localStorage
    const stored = localStorage.getItem('venueSettings')
    if (stored) {
      const settings = JSON.parse(stored)
      venueInfo.value = settings.venueInfo || venueInfo.value
      workingHours.value = settings.workingHours || workingHours.value
      pricing.value = settings.pricing || pricing.value
      notifications.value = settings.notifications || notifications.value
      appearance.value = settings.appearance || appearance.value
    }
    loading.value = false
  }

  function saveSettings() {
    const settings = {
      venueInfo: venueInfo.value,
      workingHours: workingHours.value,
      pricing: pricing.value,
      notifications: notifications.value,
      appearance: appearance.value
    }
    localStorage.setItem('venueSettings', JSON.stringify(settings))
    return true
  }

  function updateVenueInfo(updates) {
    venueInfo.value = { ...venueInfo.value, ...updates }
    saveSettings()
  }

  function updateWorkingHours(day, hours) {
    workingHours.value[day] = { ...workingHours.value[day], ...hours }
    saveSettings()
  }

  function updatePricing(updates) {
    pricing.value = { ...pricing.value, ...updates }
    saveSettings()
  }

  function updateNotifications(updates) {
    notifications.value = { ...notifications.value, ...updates }
    saveSettings()
  }

  function updateAppearance(updates) {
    appearance.value = { ...appearance.value, ...updates }
    saveSettings()
  }

  function resetSettings() {
    localStorage.removeItem('venueSettings')
    loadSettings()
  }

  return {
    venueInfo,
    workingHours,
    pricing,
    notifications,
    appearance,
    loading,
    loadSettings,
    saveSettings,
    updateVenueInfo,
    updateWorkingHours,
    updatePricing,
    updateNotifications,
    updateAppearance,
    resetSettings
  }
})
