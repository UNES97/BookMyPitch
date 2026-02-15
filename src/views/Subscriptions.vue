<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Abonnements</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérer les réservations récurrentes et les abonnements
        </p>
      </div>
      <BaseButton @click="openCreateModal" :icon="PlusIcon">
        Nouvel Abonnement
      </BaseButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        label="Abonnements actifs"
        :value="subscriptionsStore.activeSubscriptions.length"
        trend="up"
        :icon="ArrowPathIcon"
      />
      <StatsCard
        label="Revenus mensuels"
        :value="`${subscriptionsStore.totalMonthlyRevenue.toLocaleString()} DH`"
        change="Des abonnements"
        trend="neutral"
        :icon="CurrencyDollarIcon"
      />
      <StatsCard
        label="En pause"
        :value="subscriptionsStore.pausedSubscriptions.length"
        trend="neutral"
        :icon="PauseIcon"
      />
    </div>

    <!-- Subscriptions Table -->
    <BaseCard>
      <BaseTable
        :columns="columns"
        :data="subscriptionsStore.subscriptions"
        :loading="subscriptionsStore.loading"
        :hoverable="true"
      >
        <template #cell-schedule="{ row }">
          <span class="text-sm">
            {{ row.frequency }} - {{ row.dayOfWeek }} at {{ row.startTime }}
          </span>
        </template>

        <template #cell-monthlyRate="{ value }">
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ value.toLocaleString() }} DH
          </span>
        </template>

        <template #cell-nextBooking="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #cell-status="{ value }">
          <BaseBadge :variant="getStatusVariant(value)">
            {{ value }}
          </BaseBadge>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              v-if="row.status === 'active'"
              @click.stop="pauseSubscription(row)"
              class="p-1 text-warning hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded"
              title="Mettre en pause"
            >
              <PauseIcon class="w-4 h-4" />
            </button>
            <button
              v-if="row.status === 'paused'"
              @click.stop="resumeSubscription(row)"
              class="p-1 text-success hover:bg-green-50 dark:hover:bg-green-900 rounded"
              title="Reprendre"
            >
              <PlayIcon class="w-4 h-4" />
            </button>
            <button
              @click.stop="cancelSubscription(row)"
              class="p-1 text-danger hover:bg-red-50 dark:hover:bg-red-900 rounded"
              title="Annuler"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-12">
            <ArrowPathIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No subscriptions</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new subscription.
            </p>
            <div class="mt-6">
              <BaseButton @click="openCreateModal" :icon="PlusIcon">
                New Subscription
              </BaseButton>
            </div>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- Create Subscription Modal -->
    <BaseModal
      v-model="showModal"
      title="Create New Subscription"
      size="lg"
    >
      <form @submit.prevent="saveSubscription" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="form.customerId"
            label="Customer"
            required
            :options="customerOptions"
            placeholder="Select customer"
          />
          <BaseSelect
            v-model="form.fieldId"
            label="Field"
            required
            :options="fieldOptions"
            placeholder="Select field"
          />
          <BaseSelect
            v-model="form.frequency"
            label="Frequency"
            required
            :options="frequencyOptions"
          />
          <BaseSelect
            v-model="form.dayOfWeek"
            label="Day of Week"
            required
            :options="dayOptions"
          />
          <BaseTimePicker
            v-model="form.startTime"
            label="Start Time"
            required
            placeholder="Select time"
          />
          <BaseInput
            v-model="form.duration"
            label="Duration (hours)"
            type="number"
            step="0.5"
            min="0.5"
            required
          />
          <BaseDatePicker
            v-model="form.startDate"
            label="Start Date"
            required
            placeholder="Subscription starts"
          />
          <BaseDatePicker
            v-model="form.endDate"
            label="End Date"
            required
            placeholder="Subscription ends"
          />
        </div>

        <BaseInput
          v-model="form.monthlyRate"
          label="Monthly Rate (DH)"
          type="number"
          min="0"
          required
          hint="Total monthly cost for this subscription"
        />

        <div class="flex justify-end gap-3 pt-4">
          <BaseButton type="button" variant="secondary" @click="showModal = false">
            Cancel
          </BaseButton>
          <BaseButton type="submit" :loading="saving">
            Create Subscription
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSubscriptionsStore } from '@stores/subscriptions'
import { useCustomersStore } from '@stores/customers'
import { useFieldsStore } from '@stores/fields'
import {
  PlusIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'

import StatsCard from '@components/dashboard/StatsCard.vue'
import BaseCard from '@components/ui/BaseCard.vue'
import BaseButton from '@components/ui/BaseButton.vue'
import BaseInput from '@components/ui/BaseInput.vue'
import BaseSelect from '@components/ui/BaseSelect.vue'
import BaseTable from '@components/ui/BaseTable.vue'
import BaseBadge from '@components/ui/BaseBadge.vue'
import BaseModal from '@components/ui/BaseModal.vue'
import BaseDatePicker from '@components/ui/BaseDatePicker.vue'
import BaseTimePicker from '@components/ui/BaseTimePicker.vue'

const subscriptionsStore = useSubscriptionsStore()
const customersStore = useCustomersStore()
const fieldsStore = useFieldsStore()

// Modal State
const showModal = ref(false)
const saving = ref(false)

// Form Data
const form = ref({
  customerId: '',
  fieldId: '',
  frequency: 'weekly',
  dayOfWeek: 'Monday',
  startTime: '18:00',
  duration: 2,
  startDate: '',
  endDate: '',
  monthlyRate: 800
})

// Table Columns
const columns = [
  { key: 'id', label: 'ID', sortable: true, width: '100px' },
  { key: 'customerName', label: 'Client', sortable: true },
  { key: 'fieldName', label: 'Terrain', sortable: true },
  { key: 'schedule', label: 'Horaire' },
  { key: 'monthlyRate', label: 'Tarif mensuel', sortable: true },
  { key: 'nextBooking', label: 'Prochaine réservation', sortable: true },
  { key: 'status', label: 'Statut', sortable: true }
]

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
    label: `${f.name} (${f.type})`
  }))
)

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' }
]

const dayOptions = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
]

// Methods
const openCreateModal = () => {
  resetForm()
  showModal.value = true
}

const saveSubscription = () => {
  saving.value = true

  // Get customer and field names
  const customer = customersStore.customers.find(c => c.id === form.value.customerId)
  const field = fieldsStore.fields.find(f => f.id === form.value.fieldId)

  const subscriptionData = {
    ...form.value,
    customerName: customer?.name || '',
    fieldName: field?.name || ''
  }

  setTimeout(() => {
    subscriptionsStore.createSubscription(subscriptionData)
    saving.value = false
    showModal.value = false
    resetForm()
  }, 500)
}

const pauseSubscription = (subscription) => {
  subscriptionsStore.pauseSubscription(subscription.id)
}

const resumeSubscription = (subscription) => {
  subscriptionsStore.resumeSubscription(subscription.id)
}

const cancelSubscription = (subscription) => {
  if (confirm('Are you sure you want to cancel this subscription?')) {
    subscriptionsStore.cancelSubscription(subscription.id)
  }
}

const resetForm = () => {
  form.value = {
    customerId: '',
    fieldId: '',
    frequency: 'weekly',
    dayOfWeek: 'Monday',
    startTime: '18:00',
    duration: 2,
    startDate: '',
    endDate: '',
    monthlyRate: 800
  }
}

const getStatusVariant = (status) => {
  const variants = {
    active: 'success',
    paused: 'warning',
    cancelled: 'danger'
  }
  return variants[status] || 'gray'
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
