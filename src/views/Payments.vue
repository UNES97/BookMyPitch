<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Paiements & Revenus</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Suivez vos revenus, paiements et performances financières
      </p>
    </div>

    <!-- Revenue Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Revenus du jour"
        :value="`${paymentsStore.todayRevenue.toLocaleString()} DH`"
        change="+8% par rapport à hier"
        trend="up"
        :icon="CurrencyDollarIcon"
      />
      <StatsCard
        label="Cette semaine"
        :value="`${paymentsStore.weekRevenue.toLocaleString()} DH`"
        change="+15% par rapport à la semaine dernière"
        trend="up"
        :icon="ArrowTrendingUpIcon"
      />
      <StatsCard
        label="Ce mois"
        :value="`${paymentsStore.monthRevenue.toLocaleString()} DH`"
        change="+23% par rapport au mois dernier"
        trend="up"
        :icon="ChartBarIcon"
      />
      <StatsCard
        label="Paiements en attente"
        :value="`${paymentsStore.pendingAmount.toLocaleString()} DH`"
        :change="`${paymentsStore.pendingCount} réservations`"
        trend="neutral"
        :icon="ExclamationTriangleIcon"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Daily Revenue Chart -->
      <BaseCard title="Revenus quotidiens" subtitle="30 derniers jours">
        <div class="h-80">
          <BarChart :data="dailyRevenueChartData" />
        </div>
      </BaseCard>

      <!-- Payment Methods Distribution -->
      <BaseCard title="Méthodes de paiement" subtitle="Distribution">
        <div class="h-64 flex items-center justify-center">
          <div class="w-full max-w-xs">
            <DoughnutChart :data="paymentMethodsChartData" />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Monthly Revenue Trend -->
    <BaseCard title="Tendance des revenus mensuels" subtitle="12 derniers mois">
      <div class="h-96">
        <LineChart :data="monthlyRevenueChartData" />
      </div>
    </BaseCard>

    <!-- Recent Payments Table -->
    <BaseCard title="Paiements récents" subtitle="Dernières transactions">
      <BaseTable
        :columns="paymentsColumns"
        :data="recentPayments"
        :hoverable="true"
      >
        <template #cell-amount="{ value }">
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ value.toLocaleString() }} DH
          </span>
        </template>

        <template #cell-method="{ value }">
          <BaseBadge variant="info">
            {{ formatPaymentMethod(value) }}
          </BaseBadge>
        </template>

        <template #cell-status="{ value }">
          <BaseBadge :variant="getStatusVariant(value)">
            {{ translateStatus(value) }}
          </BaseBadge>
        </template>

        <template #cell-date="{ value }">
          {{ formatDate(value) }}
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePaymentsStore } from '@stores/payments'
import { useBookingsStore } from '@stores/bookings'
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { getRecentPayments } from '@utils/mockData'
import { translateStatus, getStatusVariant } from '@/utils/statusTranslations'

import StatsCard from '@components/dashboard/StatsCard.vue'
import BaseCard from '@components/ui/BaseCard.vue'
import BaseTable from '@components/ui/BaseTable.vue'
import BaseBadge from '@components/ui/BaseBadge.vue'
import LineChart from '@components/charts/LineChart.vue'
import BarChart from '@components/charts/BarChart.vue'
import DoughnutChart from '@components/charts/DoughnutChart.vue'

const paymentsStore = usePaymentsStore()
const bookingsStore = useBookingsStore()

// Recent Payments
const recentPayments = computed(() =>
  getRecentPayments(bookingsStore.bookings, 15)
)

// Table Columns
const paymentsColumns = [
  { key: 'bookingId', label: 'Booking ID', sortable: true },
  { key: 'customerName', label: 'Customer', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'method', label: 'Method', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
]

// Daily Revenue Chart Data
const dailyRevenueChartData = computed(() => {
  const dailyData = paymentsStore.revenue.dailyRevenue
  return {
    labels: dailyData.map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Revenue',
        data: dailyData.map(d => d.amount),
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
        borderRadius: 6
      }
    ]
  }
})

// Monthly Revenue Chart Data
const monthlyRevenueChartData = computed(() => {
  const monthlyData = paymentsStore.revenue.monthlyRevenue
  return {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Total Revenue',
        data: monthlyData.map(d => d.amount),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Subscription Revenue',
        data: monthlyData.map(d => d.subscriptionRevenue),
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Payment Methods Chart Data
const paymentMethodsChartData = computed(() => {
  const methods = paymentsStore.paymentMethods
  return {
    labels: methods.map(m => m.method),
    datasets: [
      {
        data: methods.map(m => m.amount),
        backgroundColor: [
          '#2563EB',
          '#16A34A',
          '#F59E0B',
          '#8B5CF6'
        ]
      }
    ]
  }
})

// Helper Functions
const formatPaymentMethod = (method) => {
  const methods = {
    cash: 'Cash',
    card: 'Card',
    bank_transfer: 'Bank Transfer',
    wallet: 'Wallet'
  }
  return methods[method] || method
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
