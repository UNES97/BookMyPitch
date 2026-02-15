<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useUIStore } from '@stores/ui'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const uiStore = useUIStore()

const chartData = computed(() => props.data)

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: props.options.legend !== false,
      position: 'bottom',
      labels: {
        color: uiStore.darkMode ? '#E5E7EB' : '#374151',
        font: {
          family: 'Plus Jakarta Sans',
          size: 12
        },
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      backgroundColor: uiStore.darkMode ? '#1F2937' : '#FFFFFF',
      titleColor: uiStore.darkMode ? '#F9FAFB' : '#111827',
      bodyColor: uiStore.darkMode ? '#E5E7EB' : '#374151',
      borderColor: uiStore.darkMode ? '#374151' : '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: function(context) {
          let label = context.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed !== null) {
            label += context.parsed.toLocaleString() + ' bookings'
          }
          return label
        }
      }
    }
  },
  ...props.options
}))
</script>
