import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockFields } from '@utils/mockData'

export const useFieldsStore = defineStore('fields', () => {
  const fields = ref([])
  const loading = ref(false)

  const availableFields = computed(() =>
    fields.value.filter(f => f.status === 'available')
  )

  const activeFields = computed(() =>
    fields.value.filter(f => f.status !== 'unavailable')
  )

  const maintenanceFields = computed(() =>
    fields.value.filter(f => f.status === 'maintenance')
  )

  const fieldsByType = computed(() => {
    const grouped = {}
    fields.value.forEach(field => {
      if (!grouped[field.type]) {
        grouped[field.type] = []
      }
      grouped[field.type].push(field)
    })
    return grouped
  })

  function fetchFields() {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      fields.value = generateMockFields()
      loading.value = false
    }, 300)
  }

  function createField(field) {
    const newField = {
      id: `FLD-${Date.now()}`,
      ...field,
      status: 'available',
      amenities: field.amenities || [],
      maintenanceSchedule: []
    }
    fields.value.push(newField)
    return newField
  }

  function updateField(id, updates) {
    const index = fields.value.findIndex(f => f.id === id)
    if (index !== -1) {
      fields.value[index] = { ...fields.value[index], ...updates }
      return fields.value[index]
    }
    return null
  }

  function deleteField(id) {
    const index = fields.value.findIndex(f => f.id === id)
    if (index !== -1) {
      fields.value.splice(index, 1)
      return true
    }
    return false
  }

  function setFieldStatus(id, status) {
    return updateField(id, { status })
  }

  function addMaintenanceSchedule(id, schedule) {
    const field = fields.value.find(f => f.id === id)
    if (field) {
      field.maintenanceSchedule.push(schedule)
      return true
    }
    return false
  }

  function getFieldById(id) {
    return fields.value.find(f => f.id === id)
  }

  return {
    fields,
    loading,
    availableFields,
    activeFields,
    maintenanceFields,
    fieldsByType,
    fetchFields,
    createField,
    updateField,
    deleteField,
    setFieldStatus,
    addMaintenanceSchedule,
    getFieldById
  }
})
