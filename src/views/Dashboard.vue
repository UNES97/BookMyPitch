<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Welcome back! Here's what's happening with your venue today.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Today's Bookings"
        :value="bookingsStore.todayBookings.length"
        change="+12% from yesterday"
        trend="up"
        :icon="CalendarIcon"
      />
      <StatsCard
        label="Today's Revenue"
        :value="`${paymentsStore.todayRevenue.toLocaleString()} DH`"
        change="+8% from yesterday"
        trend="up"
        :icon="CurrencyDollarIcon"
      />
      <StatsCard
        label="Active Fields"
        :value="fieldsStore.availableFields.length"
        :icon="MapIcon"
      />
      <StatsCard
        label="Pending Payments"
        :value="paymentsStore.pendingCount"
        :change="`${paymentsStore.pendingAmount.toLocaleString()} DH outstanding`"
        trend="down"
        :icon="ExclamationTriangleIcon"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <BaseCard title="Revenue Trend" subtitle="Last 30 days">
        <div class="h-80">
          <LineChart :data="revenueChartData" />
        </div>
      </BaseCard>

      <!-- Bookings by Field -->
      <BaseCard title="Bookings by Field" subtitle="Distribution">
        <div class="h-64 flex items-center justify-center">
          <div class="w-full max-w-xs">
            <DoughnutChart :data="bookingsChartData" />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Bookings -->
      <BaseCard title="Recent Bookings" subtitle="Latest 5 bookings">
        <BaseTable
          :columns="bookingsColumns"
          :data="recentBookings"
          :hoverable="true"
        >
          <template #cell-status="{ value }">
            <BaseBadge :variant="getStatusVariant(value)">
              {{ value }}
            </BaseBadge>
          </template>
        </BaseTable>
      </BaseCard>

      <!-- Upcoming Matches -->
      <BaseCard title="Upcoming Matches" subtitle="Next 5 bookings">
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
import {
  CalendarIcon,
  CurrencyDollarIcon,
  MapIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'

import StatsCard from '@components/dashboard/StatsCard.vue'
import BaseCard from '@components/ui/BaseCard.vue'
import BaseTable from '@components/ui/BaseTable.vue'
import BaseBadge from '@components/ui/BaseBadge.vue'
import LineChart from '@components/charts/LineChart.vue'
import DoughnutChart from '@components/charts/DoughnutChart.vue'

const bookingsStore = useBookingsStore()
const fieldsStore = useFieldsStore()
const paymentsStore = usePaymentsStore()

// Recent & Upcoming Bookings
const recentBookings = computed(() => bookingsStore.recentBookings.slice(0, 5))
const upcomingMatches = computed(() => bookingsStore.upcomingBookings.slice(0, 5))

// Table Columns
const bookingsColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'customerName', label: 'Customer', sortable: true },
  { key: 'fieldName', label: 'Field', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
]

const upcomingColumns = [
  { key: 'customerName', label: 'Customer', sortable: true },
  { key: 'fieldName', label: 'Field', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'startTime', label: 'Time', sortable: true }
]

// Revenue Chart Data
const revenueChartData = computed(() => {
  const last30Days = paymentsStore.revenue.dailyRevenue
  return {
    labels: last30Days.map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [
      {
        label: 'Revenue',
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

// Helper Functions
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
