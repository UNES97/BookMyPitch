<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Bienvenue ! Voici ce qui se passe dans votre complexe aujourd'hui.
      </p>
    </div>

    <!-- Quick Actions -->
    <BaseCard>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          @click="$router.push('/bookings')"
          class="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <div class="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <PlusCircleIcon class="w-6 h-6 text-primary" />
          </div>
          <div class="text-left">
            <div class="font-semibold text-gray-900 dark:text-white">Nouvelle Réservation</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Créer rapidement</div>
          </div>
        </button>

        <button
          @click="$router.push('/calendar')"
          class="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-success hover:bg-success/5 transition-all group"
        >
          <div class="p-3 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors">
            <CalendarDaysIcon class="w-6 h-6 text-success" />
          </div>
          <div class="text-left">
            <div class="font-semibold text-gray-900 dark:text-white">Voir Aujourd'hui</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Calendrier du jour</div>
          </div>
        </button>

        <button
          @click="$router.push('/customers')"
          class="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-warning hover:bg-warning/5 transition-all group"
        >
          <div class="p-3 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors">
            <UserPlusIcon class="w-6 h-6 text-warning" />
          </div>
          <div class="text-left">
            <div class="font-semibold text-gray-900 dark:text-white">Ajouter Client</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Nouveau client</div>
          </div>
        </button>

        <button
          @click="$router.push('/live-board')"
          class="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group"
        >
          <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors">
            <TvIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div class="text-left">
            <div class="font-semibold text-gray-900 dark:text-white">Tableau d'Affichage</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Vue en direct</div>
          </div>
        </button>
      </div>
    </BaseCard>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Réservations du jour"
        :value="bookingsStore.todayBookings.length"
        change="+12% par rapport à hier"
        trend="up"
        :icon="CalendarIcon"
      />
      <StatsCard
        label="Revenus du jour"
        :value="`${paymentsStore.todayRevenue.toLocaleString()} DH`"
        change="+8% par rapport à hier"
        trend="up"
        :icon="CurrencyDollarIcon"
      />
      <StatsCard
        label="Terrains actifs"
        :value="fieldsStore.availableFields.length"
        :icon="MapIcon"
      />
      <StatsCard
        label="Paiements en attente"
        :value="paymentsStore.pendingCount"
        :change="`${paymentsStore.pendingAmount.toLocaleString()} DH en attente`"
        trend="down"
        :icon="ExclamationTriangleIcon"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <BaseCard title="Tendance des revenus" subtitle="30 derniers jours">
        <div class="h-80">
          <LineChart :data="revenueChartData" />
        </div>
      </BaseCard>

      <!-- Bookings by Field -->
      <BaseCard title="Réservations par terrain" subtitle="Distribution">
        <div class="h-64 flex items-center justify-center">
          <div class="w-full max-w-xs">
            <DoughnutChart :data="bookingsChartData" />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Enhanced Analytics Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Peak Hours Chart -->
      <BaseCard title="Heures de pointe" subtitle="Réservations par heure" class="lg:col-span-2">
        <div class="h-80">
          <BarChart :data="peakHoursChartData" />
        </div>
      </BaseCard>

      <!-- Top Customers -->
      <BaseCard title="Top 5 Clients" subtitle="Par revenus">
        <div class="space-y-3">
          <div
            v-for="(customer, index) in topCustomers"
            :key="customer.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                {{ index + 1 }}
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white text-sm">{{ customer.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ customer.totalBookings }} réservations</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-success">{{ customer.totalRevenue.toLocaleString() }} DH</div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Bookings -->
      <BaseCard title="Réservations récentes" subtitle="5 dernières réservations">
        <BaseTable
          :columns="bookingsColumns"
          :data="recentBookings"
          :hoverable="true"
        >
          <template #cell-status="{ value }">
            <BaseBadge :variant="getStatusVariant(value)">
              {{ translateStatus(value) }}
            </BaseBadge>
          </template>
        </BaseTable>
      </BaseCard>

      <!-- Upcoming Matches -->
      <BaseCard title="Matchs à venir" subtitle="5 prochaines réservations">
        <BaseTable
          :columns="upcomingColumns"
          :data="upcomingMatches"
          :hoverable="true"
        >
          <template #cell-date="{ value }">
            {{ formatDate(value) }}
          </template>
        </BaseTable>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookingsStore } from '@stores/bookings'
import { useFieldsStore } from '@stores/fields'
import { usePaymentsStore } from '@stores/payments'
import { useCustomersStore } from '@stores/customers'
import {
  CalendarIcon,
  CurrencyDollarIcon,
  MapIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  TvIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { translateStatus, getStatusVariant as getStatusVariantUtil } from '@/utils/statusTranslations'

import StatsCard from '@components/dashboard/StatsCard.vue'
import BaseCard from '@components/ui/BaseCard.vue'
import BaseTable from '@components/ui/BaseTable.vue'
import BaseBadge from '@components/ui/BaseBadge.vue'
import LineChart from '@components/charts/LineChart.vue'
import DoughnutChart from '@components/charts/DoughnutChart.vue'
import BarChart from '@components/charts/BarChart.vue'

const bookingsStore = useBookingsStore()
const fieldsStore = useFieldsStore()
const paymentsStore = usePaymentsStore()
const customersStore = useCustomersStore()

// Recent & Upcoming Bookings
const recentBookings = computed(() => bookingsStore.recentBookings.slice(0, 5))
const upcomingMatches = computed(() => bookingsStore.upcomingBookings.slice(0, 5))

// Table Columns
const bookingsColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'customerName', label: 'Client', sortable: true },
  { key: 'fieldName', label: 'Terrain', sortable: true },
  { key: 'status', label: 'Statut', sortable: true }
]

const upcomingColumns = [
  { key: 'customerName', label: 'Client', sortable: true },
  { key: 'fieldName', label: 'Terrain', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'startTime', label: 'Heure', sortable: true }
]

// Revenue Chart Data
const revenueChartData = computed(() => {
  const last30Days = paymentsStore.revenue.dailyRevenue
  return {
    labels: last30Days.map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [
      {
        label: 'Revenus',
        data: last30Days.map(d => d.amount),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Bookings by Field Chart Data
const bookingsChartData = computed(() => {
  const fieldCounts = {}
  bookingsStore.bookings.forEach(booking => {
    if (booking.status !== 'cancelled') {
      fieldCounts[booking.fieldName] = (fieldCounts[booking.fieldName] || 0) + 1
    }
  })

  return {
    labels: Object.keys(fieldCounts),
    datasets: [
      {
        data: Object.values(fieldCounts),
        backgroundColor: [
          '#2563EB',
          '#16A34A',
          '#F59E0B',
          '#DC2626',
          '#8B5CF6'
        ]
      }
    ]
  }
})

// Peak Hours Chart Data
const peakHoursChartData = computed(() => {
  const hourCounts = {}

  // Initialize hours 8-22
  for (let i = 8; i <= 22; i++) {
    hourCounts[`${i}:00`] = 0
  }

  // Count bookings by hour
  bookingsStore.bookings.forEach(booking => {
    if (booking.status !== 'cancelled') {
      const hour = booking.startTime.split(':')[0]
      const hourKey = `${hour}:00`
      if (hourCounts[hourKey] !== undefined) {
        hourCounts[hourKey]++
      }
    }
  })

  return {
    labels: Object.keys(hourCounts),
    datasets: [
      {
        label: 'Réservations',
        data: Object.values(hourCounts),
        backgroundColor: '#2563EB',
        borderColor: '#1E40AF',
        borderWidth: 1
      }
    ]
  }
})

// Top Customers
const topCustomers = computed(() => {
  return customersStore.customers
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
})

// Helper Functions
const getStatusVariant = (status) => {
  return getStatusVariantUtil(status)
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
