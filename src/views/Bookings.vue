<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage all field bookings and reservations
        </p>
      </div>
      <BaseButton @click="openCreateModal" :icon="PlusIcon">
        New Booking
      </BaseButton>
    </div>

    <!-- Filters -->
    <BaseCard padding="md">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search by customer name..."
          :prefix-icon="MagnifyingGlassIcon"
        />
        <BaseSelect
          v-model="filterStatus"
          placeholder="All Statuses"
          :options="statusOptions"
        />
        <BaseSelect
          v-model="filterField"
          placeholder="All Fields"
          :options="fieldOptions"
        />
        <BaseButton variant="secondary" @click="clearFilters" block>
          Clear Filters
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Bookings Table -->
    <BaseCard>
      <BaseTable
        :columns="columns"
        :data="filteredBookings"
        :loading="bookingsStore.loading"
        :hoverable="true"
        :pagination="pagination"
        @row-click="viewBooking"
        @page-change="handlePageChange"
      >
        <template #cell-status="{ value }">
          <BaseBadge :variant="getStatusVariant(value)">
            {{ value }}
          </BaseBadge>
        </template>

        <template #cell-paymentStatus="{ value }">
          <BaseBadge :variant="value === 'paid' ? 'success' : 'warning'">
            {{ value }}
          </BaseBadge>
        </template>

        <template #cell-price="{ value }">
          {{ value.toLocaleString() }} DH
        </template>

        <template #cell-date="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              @click.stop="editBooking(row)"
              class="p-1 text-primary hover:bg-primary-50 dark:hover:bg-primary-900 rounded"
              title="Edit"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              @click.stop="confirmDelete(row)"
              class="p-1 text-danger hover:bg-red-50 dark:hover:bg-red-900 rounded"
              title="Delete"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-12">
            <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No bookings found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new booking.
            </p>
            <div class="mt-6">
              <BaseButton @click="openCreateModal" :icon="PlusIcon">
                New Booking
              </BaseButton>
            </div>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- Create/Edit Booking Modal -->
    <BaseModal
      v-model="showBookingModal"
      :title="editMode ? 'Edit Booking' : 'Create New Booking'"
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
            :options="fieldOptionsForForm"
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
          <BaseButton type="button" variant="secondary" @click="showBookingModal = false">
            Cancel
          </BaseButton>
          <BaseButton type="submit" :loading="saving">
            {{ editMode ? 'Update' : 'Create' }} Booking
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Delete Booking"
      size="sm"
    >
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Are you sure you want to delete this booking? This action cannot be undone.
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">
          Cancel
        </BaseButton>
        <BaseButton variant="danger" @click="deleteBooking" :loading="deleting">
          Delete
        </BaseButton>
      </template>
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
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'

import BaseCard from '@components/ui/BaseCard.vue'
import BaseButton from '@components/ui/BaseButton.vue'
import BaseInput from '@components/ui/BaseInput.vue'
import BaseSelect from '@components/ui/BaseSelect.vue'
import BaseTextarea from '@components/ui/BaseTextarea.vue'
import BaseTable from '@components/ui/BaseTable.vue'
import BaseBadge from '@components/ui/BaseBadge.vue'
import BaseModal from '@components/ui/BaseModal.vue'
import BaseDatePicker from '@components/ui/BaseDatePicker.vue'
import BaseTimePicker from '@components/ui/BaseTimePicker.vue'

const bookingsStore = useBookingsStore()
const fieldsStore = useFieldsStore()
const customersStore = useCustomersStore()

// Filters
const searchQuery = ref('')
const filterStatus = ref('')
const filterField = ref('')

// Modal States
const showBookingModal = ref(false)
const showDeleteModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)

// Form Data
const bookingForm = ref({
  id: null,
  customerId: '',
  fieldId: '',
  date: '',
  startTime: '',
  duration: 2,
  price: 100,
  notes: ''
})

const selectedBooking = ref(null)

// Table Columns
const columns = [
  { key: 'id', label: 'ID', sortable: true, width: '100px' },
  { key: 'customerName', label: 'Customer', sortable: true },
  { key: 'fieldName', label: 'Field', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'startTime', label: 'Time', sortable: true },
  { key: 'duration', label: 'Duration', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'paymentStatus', label: 'Payment', sortable: true }
]

// Pagination
const currentPage = ref(1)
const perPage = 10

const pagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage,
  total: filteredBookings.value.length
}))

// Filter Options
const statusOptions = computed(() => [
  { value: '', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
])

const fieldOptions = computed(() => [
  { value: '', label: 'All Fields' },
  ...fieldsStore.fields.map(f => ({ value: f.id, label: f.name }))
])

const fieldOptionsForForm = computed(() =>
  fieldsStore.fields.map(f => ({
    value: f.id,
    label: `${f.name} (${f.type}) - ${f.hourlyRate} DH/hr`
  }))
)

const customerOptions = computed(() =>
  customersStore.customers.map(c => ({
    value: c.id,
    label: `${c.name} (${c.phone})`
  }))
)

// Filtered Bookings
const filteredBookings = computed(() => {
  let results = [...bookingsStore.bookings]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(b =>
      b.customerName.toLowerCase().includes(query) ||
      b.id.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filterStatus.value) {
    results = results.filter(b => b.status === filterStatus.value)
  }

  // Field filter
  if (filterField.value) {
    results = results.filter(b => b.fieldId === filterField.value)
  }

  return results
})

// Methods
const openCreateModal = () => {
  editMode.value = false
  resetForm()
  showBookingModal.value = true
}

const editBooking = (booking) => {
  editMode.value = true
  bookingForm.value = {
    id: booking.id,
    customerId: booking.customerId,
    fieldId: booking.fieldId,
    date: booking.date,
    startTime: booking.startTime,
    duration: booking.duration,
    price: booking.price,
    notes: booking.notes || ''
  }
  showBookingModal.value = true
}

const viewBooking = (booking) => {
  editBooking(booking)
}

const saveBooking = async () => {
  saving.value = true

  // Get customer and field names
  const customer = customersStore.customers.find(c => c.id === bookingForm.value.customerId)
  const field = fieldsStore.fields.find(f => f.id === bookingForm.value.fieldId)

  const bookingData = {
    ...bookingForm.value,
    customerName: customer?.name || '',
    customerPhone: customer?.phone || '',
    fieldName: field?.name || ''
  }

  setTimeout(() => {
    if (editMode.value) {
      bookingsStore.updateBooking(bookingForm.value.id, bookingData)
    } else {
      bookingsStore.createBooking(bookingData)
    }

    saving.value = false
    showBookingModal.value = false
    resetForm()
  }, 500)
}

const confirmDelete = (booking) => {
  selectedBooking.value = booking
  showDeleteModal.value = true
}

const deleteBooking = () => {
  deleting.value = true
  setTimeout(() => {
    bookingsStore.deleteBooking(selectedBooking.value.id)
    deleting.value = false
    showDeleteModal.value = false
    selectedBooking.value = null
  }, 300)
}

const resetForm = () => {
  bookingForm.value = {
    id: null,
    customerId: '',
    fieldId: '',
    date: '',
    startTime: '',
    duration: 2,
    price: 100,
    notes: ''
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterField.value = ''
}

const handlePageChange = (page) => {
  currentPage.value = page
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

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
