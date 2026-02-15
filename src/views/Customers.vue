<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérer les profils clients et l'historique des réservations
        </p>
      </div>
      <BaseButton @click="openCreateModal" :icon="PlusIcon">
        Ajouter un Client
      </BaseButton>
    </div>

    <!-- Search & Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3">
        <BaseCard padding="md">
          <BaseInput
            v-model="searchQuery"
            placeholder="Rechercher par nom, email ou téléphone..."
            :prefix-icon="MagnifyingGlassIcon"
          />
        </BaseCard>
      </div>
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total Clients</p>
          <p class="text-3xl font-bold text-primary mt-1">{{ customersStore.customers.length }}</p>
        </div>
      </BaseCard>
    </div>

    <!-- Customers Table -->
    <BaseCard>
      <BaseTable
        :columns="columns"
        :data="filteredCustomers"
        :loading="customersStore.loading"
        :hoverable="true"
        :pagination="pagination"
        @row-click="viewCustomer"
        @page-change="handlePageChange"
      >
        <template #cell-status="{ value }">
          <BaseBadge :variant="getStatusVariant(value)">
            {{ translateStatus(value) }}
          </BaseBadge>
        </template>

        <template #cell-subscriptionStatus="{ value }">
          <BaseBadge :variant="value === 'subscribed' ? 'info' : 'gray'">
            {{ value === 'subscribed' ? 'Abonné' : 'Régulier' }}
          </BaseBadge>
        </template>

        <template #cell-totalRevenue="{ value }">
          {{ value.toLocaleString() }} DH
        </template>

        <template #cell-joinedDate="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              @click.stop="viewCustomer(row)"
              class="p-1 text-primary hover:bg-primary-50 dark:hover:bg-primary-900 rounded"
              title="Voir les détails"
            >
              <EyeIcon class="w-4 h-4" />
            </button>
            <button
              @click.stop="editCustomer(row)"
              class="p-1 text-primary hover:bg-primary-50 dark:hover:bg-primary-900 rounded"
              title="Modifier"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-12">
            <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun client trouvé</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par ajouter un nouveau client.
            </p>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- Customer Details Modal -->
    <BaseModal
      v-model="showDetailsModal"
      :title="selectedCustomer?.name"
      size="xl"
    >
      <div v-if="selectedCustomer" class="space-y-6">
        <!-- Customer Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ selectedCustomer.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ selectedCustomer.phone }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Membre depuis</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedCustomer.joinedDate) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Statut</p>
            <BaseBadge :variant="selectedCustomer.status === 'active' ? 'success' : 'gray'">
              {{ selectedCustomer.status }}
            </BaseBadge>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4">
          <BaseCard padding="sm">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Réservations</p>
            <p class="text-2xl font-bold text-primary mt-1">{{ selectedCustomer.totalBookings }}</p>
          </BaseCard>
          <BaseCard padding="sm">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Revenus</p>
            <p class="text-2xl font-bold text-success mt-1">{{ selectedCustomer.totalRevenue.toLocaleString() }} DH</p>
          </BaseCard>
          <BaseCard padding="sm">
            <p class="text-sm text-gray-500 dark:text-gray-400">Abonnement</p>
            <BaseBadge :variant="selectedCustomer.subscriptionStatus === 'subscribed' ? 'info' : 'gray'" class="mt-2">
              {{ selectedCustomer.subscriptionStatus === 'subscribed' ? 'Actif' : 'Aucun' }}
            </BaseBadge>
          </BaseCard>
        </div>

        <!-- Booking History -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Historique des réservations</h3>
          <BaseTable
            :columns="bookingHistoryColumns"
            :data="customerBookings"
            :hoverable="true"
          >
            <template #cell-status="{ value }">
              <BaseBadge :variant="getStatusVariant(value)">
                {{ value }}
              </BaseBadge>
            </template>
            <template #cell-price="{ value }">
              {{ value  }} DH
            </template>
          </BaseTable>
        </div>
      </div>
    </BaseModal>

    <!-- Create/Edit Customer Modal -->
    <BaseModal
      v-model="showCustomerModal"
      :title="editMode ? 'Modifier le client' : 'Ajouter un nouveau client'"
      size="md"
    >
      <form @submit.prevent="saveCustomer" class="space-y-4">
        <BaseInput
          v-model="customerForm.name"
          label="Nom complet"
          required
          placeholder="Entrer le nom du client"
        />
        <BaseInput
          v-model="customerForm.email"
          label="Email"
          type="email"
          required
          placeholder="client@exemple.com"
        />
        <BaseInput
          v-model="customerForm.phone"
          label="Téléphone"
          type="tel"
          required
          placeholder="+212 6 XX XX XX XX"
        />

        <div class="flex justify-end gap-3 pt-4">
          <BaseButton type="button" variant="secondary" @click="showCustomerModal = false">
            Annuler
          </BaseButton>
          <BaseButton type="submit" :loading="saving">
            {{ editMode ? 'Modifier' : 'Ajouter' }} le client
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCustomersStore } from '@stores/customers'
import { useBookingsStore } from '@stores/bookings'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { translateStatus, getStatusVariant as getStatusVariantUtil } from '@/utils/statusTranslations'

import BaseCard from '@components/ui/BaseCard.vue'
import BaseButton from '@components/ui/BaseButton.vue'
import BaseInput from '@components/ui/BaseInput.vue'
import BaseTable from '@components/ui/BaseTable.vue'
import BaseBadge from '@components/ui/BaseBadge.vue'
import BaseModal from '@components/ui/BaseModal.vue'

const customersStore = useCustomersStore()
const bookingsStore = useBookingsStore()

// Search
const searchQuery = ref('')

// Modal States
const showDetailsModal = ref(false)
const showCustomerModal = ref(false)
const editMode = ref(false)
const saving = ref(false)

// Selected Customer
const selectedCustomer = ref(null)

// Form Data
const customerForm = ref({
  id: null,
  name: '',
  email: '',
  phone: ''
})

// Pagination
const currentPage = ref(1)
const perPage = 10

const pagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage,
  total: filteredCustomers.value.length
}))

// Table Columns
const columns = [
  { key: 'name', label: 'Nom', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Téléphone', sortable: true },
  { key: 'totalBookings', label: 'Réservations', sortable: true },
  { key: 'totalRevenue', label: 'Revenus', sortable: true },
  { key: 'subscriptionStatus', label: 'Type', sortable: true },
  { key: 'status', label: 'Statut', sortable: true }
]

const bookingHistoryColumns = [
  { key: 'id', label: 'ID Réservation' },
  { key: 'fieldName', label: 'Terrain' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Statut' },
  { key: 'price', label: 'Montant' }
]

// Filtered Customers
const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customersStore.customers

  const query = searchQuery.value.toLowerCase()
  return customersStore.customers.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.email.toLowerCase().includes(query) ||
    c.phone.includes(query)
  )
})

// Customer Bookings
const customerBookings = computed(() => {
  if (!selectedCustomer.value) return []
  return bookingsStore.getBookingsByCustomer(selectedCustomer.value.id).slice(0, 10)
})

// Methods
const viewCustomer = (customer) => {
  selectedCustomer.value = customer
  showDetailsModal.value = true
}

const openCreateModal = () => {
  editMode.value = false
  resetForm()
  showCustomerModal.value = true
}

const editCustomer = (customer) => {
  editMode.value = true
  customerForm.value = {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone
  }
  showCustomerModal.value = true
}

const saveCustomer = () => {
  saving.value = true
  setTimeout(() => {
    if (editMode.value) {
      customersStore.updateCustomer(customerForm.value.id, customerForm.value)
    } else {
      customersStore.createCustomer(customerForm.value)
    }
    saving.value = false
    showCustomerModal.value = false
    resetForm()
  }, 500)
}

const resetForm = () => {
  customerForm.value = {
    id: null,
    name: '',
    email: '',
    phone: ''
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const getStatusVariant = (status) => {
  return getStatusVariantUtil(status)
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
