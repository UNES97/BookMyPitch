<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Réservations</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérer toutes les réservations de terrains
        </p>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton @click="exportToCSV" variant="secondary" :icon="ArrowDownTrayIcon">
          Exporter CSV
        </BaseButton>
        <BaseButton @click="openCreateModal" :icon="PlusIcon">
          Nouvelle Réservation
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <BaseCard padding="md">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseInput
          v-model="searchQuery"
          placeholder="Rechercher par nom de client..."
          :prefix-icon="MagnifyingGlassIcon"
        />
        <BaseSelect
          v-model="filterStatus"
          placeholder="Tous les statuts"
          :options="statusOptions"
        />
        <BaseSelect
          v-model="filterField"
          placeholder="Tous les terrains"
          :options="fieldOptions"
        />
        <BaseButton variant="secondary" @click="clearFilters" block>
          Effacer les filtres
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
            {{ translateStatus(value) }}
          </BaseBadge>
        </template>

        <template #cell-paymentStatus="{ value }">
          <BaseBadge :variant="getStatusVariant(value)">
            {{ translateStatus(value) }}
          </BaseBadge>
        </template>

        <template #cell-price="{ value }">
          {{ value.toLocaleString() }} DH
        </template>

        <template #cell-date="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-1">
            <button
              v-if="row.paymentStatus === 'unpaid'"
              @click.stop="markAsPaid(row)"
              class="p-1 text-success hover:bg-green-50 dark:hover:bg-green-900 rounded"
              title="Marquer comme payé"
            >
              <CheckCircleIcon class="w-4 h-4" />
            </button>
            <button
              v-if="row.status === 'pending'"
              @click.stop="confirmBooking(row)"
              class="p-1 text-success hover:bg-green-50 dark:hover:bg-green-900 rounded"
              title="Confirmer"
            >
              <CheckIcon class="w-4 h-4" />
            </button>
            <button
              @click.stop="editBooking(row)"
              class="p-1 text-primary hover:bg-primary-50 dark:hover:bg-primary-900 rounded"
              title="Modifier"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              @click.stop="confirmDelete(row)"
              class="p-1 text-danger hover:bg-red-50 dark:hover:bg-red-900 rounded"
              title="Supprimer"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-12">
            <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune réservation trouvée</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par créer une nouvelle réservation.
            </p>
            <div class="mt-6">
              <BaseButton @click="openCreateModal" :icon="PlusIcon">
                Nouvelle Réservation
              </BaseButton>
            </div>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- Create/Edit Booking Modal -->
    <BaseModal
      v-model="showBookingModal"
      :title="editMode ? 'Modifier la réservation' : 'Créer une nouvelle réservation'"
      size="lg"
    >
      <form @submit.prevent="saveBooking" class="space-y-4">
        <!-- Customer Type Selection -->
        <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Client
          </label>
          <div class="flex gap-4">
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                v-model="customerType"
                value="existing"
                class="mr-2"
              />
              <span class="text-sm">Client existant</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                v-model="customerType"
                value="new"
                class="mr-2"
              />
              <span class="text-sm">Nouveau client</span>
            </label>
          </div>
        </div>

        <!-- Existing Customer Selection -->
        <div v-if="customerType === 'existing'" class="grid grid-cols-1 gap-4">
          <BaseSelect
            v-model="bookingForm.customerId"
            label="Sélectionner un client"
            required
            :options="customerOptions"
            placeholder="Choisir parmi les clients existants"
          />
        </div>

        <!-- New Customer Form -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput
            v-model="newCustomer.name"
            label="Nom du client"
            required
            placeholder="Entrer le nom complet"
          />
          <BaseInput
            v-model="newCustomer.phone"
            label="Numéro de téléphone"
            required
            placeholder="+212 6 XX XX XX XX"
          />
          <BaseInput
            v-model="newCustomer.email"
            label="Email (Optionnel)"
            type="email"
            placeholder="client@exemple.com"
          />
        </div>

        <!-- Booking Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <BaseSelect
            v-model="bookingForm.fieldId"
            label="Terrain"
            required
            :options="fieldOptionsForForm"
            placeholder="Sélectionner un terrain"
          />
          <BaseDatePicker
            v-model="bookingForm.date"
            label="Date"
            required
            placeholder="Sélectionner la date de réservation"
          />
          <BaseTimePicker
            v-model="bookingForm.startTime"
            label="Heure de début"
            required
            placeholder="Sélectionner l'heure de début"
          />
          <BaseInput
            v-model="bookingForm.duration"
            label="Durée (heures)"
            type="number"
            step="1"
            min="1"
            max="2"
            required
          />
          <BaseInput
            v-model="bookingForm.price"
            label="Prix (DH)"
            type="number"
            min="0"
            required
          />
        </div>

        <BaseTextarea
          v-model="bookingForm.notes"
          label="Notes (Optionnel)"
          placeholder="Ajouter des exigences ou notes spéciales..."
          :rows="3"
        />

        <div class="flex justify-end gap-3 pt-4">
          <BaseButton type="button" variant="secondary" @click="showBookingModal = false">
            Annuler
          </BaseButton>
          <BaseButton type="submit" :loading="saving">
            {{ editMode ? 'Modifier' : 'Créer' }} la réservation
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Supprimer la réservation"
      size="sm"
    >
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action ne peut pas être annulée.
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">
          Annuler
        </BaseButton>
        <BaseButton variant="danger" @click="deleteBooking" :loading="deleting">
          Supprimer
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBookingsStore } from '@stores/bookings'
import { useFieldsStore } from '@stores/fields'
import { useCustomersStore } from '@stores/customers'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { translateStatus, getStatusVariant as getStatusVariantUtil } from '@/utils/statusTranslations'

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

// Customer Type
const customerType = ref('existing')

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

const newCustomer = ref({
  name: '',
  phone: '',
  email: ''
})

const selectedBooking = ref(null)

// Table Columns
const columns = [
  { key: 'id', label: 'ID', sortable: true, width: '100px' },
  { key: 'customerName', label: 'Client', sortable: true },
  { key: 'fieldName', label: 'Terrain', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'startTime', label: 'Heure', sortable: true },
  { key: 'duration', label: 'Durée', sortable: true },
  { key: 'price', label: 'Prix', sortable: true },
  { key: 'status', label: 'Statut', sortable: true },
  { key: 'paymentStatus', label: 'Paiement', sortable: true }
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
  { value: '', label: 'Tous les statuts' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'pending', label: 'En attente' },
  { value: 'completed', label: 'Terminé' },
  { value: 'cancelled', label: 'Annulé' }
])

const fieldOptions = computed(() => [
  { value: '', label: 'Tous les terrains' },
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
  customerType.value = 'existing'
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

  let customer
  let customerId = bookingForm.value.customerId

  // If creating a new customer, add them first
  if (customerType.value === 'new') {
    customer = customersStore.createCustomer({
      name: newCustomer.value.name,
      phone: newCustomer.value.phone,
      email: newCustomer.value.email || '',
      notes: ''
    })
    customerId = customer.id
  } else {
    // Use existing customer
    customer = customersStore.customers.find(c => c.id === customerId)
  }

  const field = fieldsStore.fields.find(f => f.id === bookingForm.value.fieldId)

  const bookingData = {
    ...bookingForm.value,
    customerId,
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
  customerType.value = 'existing'
  bookingForm.value = {
    id: null,
    customerId: '',
    fieldId: '',
    date: '',
    startTime: '',
    duration: 1,
    price: 350,
    notes: ''
  }
  newCustomer.value = {
    name: '',
    phone: '',
    email: ''
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
  return getStatusVariantUtil(status)
}

// Mark booking as paid
const markAsPaid = (booking) => {
  bookingsStore.updateBooking(booking.id, { ...booking, paymentStatus: 'paid' })
}

// Confirm pending booking
const confirmBooking = (booking) => {
  bookingsStore.updateBooking(booking.id, { ...booking, status: 'confirmed' })
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

// Auto-calculate price based on field and duration
const calculatePrice = () => {
  if (bookingForm.value.fieldId && bookingForm.value.duration) {
    const field = fieldsStore.fields.find(f => f.id === bookingForm.value.fieldId)
    if (field) {
      bookingForm.value.price = field.hourlyRate * bookingForm.value.duration
    }
  }
}

// Export to CSV
const exportToCSV = () => {
  // CSV headers
  const headers = ['ID', 'Client', 'Terrain', 'Date', 'Heure', 'Durée', 'Prix', 'Statut', 'Paiement']

  // Convert bookings to CSV rows
  const rows = filteredBookings.value.map(booking => [
    booking.id,
    booking.customerName,
    booking.fieldName,
    booking.date,
    booking.startTime,
    `${booking.duration}h`,
    `${booking.price} DH`,
    booking.status,
    booking.paymentStatus
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `reservations_${format(new Date(), 'yyyy-MM-dd')}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Watch for changes in field or duration to auto-calculate price
watch(() => bookingForm.value.fieldId, calculatePrice)
watch(() => bookingForm.value.duration, calculatePrice)
</script>
