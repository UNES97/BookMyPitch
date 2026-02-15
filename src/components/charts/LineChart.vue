<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useUIStore } from '@stores/ui'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(context.parsed.y)
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: uiStore.darkMode ? '#9CA3AF' : '#6B7280',
        font: {
          family: 'Plus Jakarta Sans',
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: uiStore.darkMode ? '#374151' : '#F3F4F6'
      },
      ticks: {
        color: uiStore.darkMode ? '#9CA3AF' : '#6B7280',
        font: {
          family: 'Plus Jakarta Sans',
          size: 11
        },
        callback: function(value) {
          return '$' + value.toLocaleString()
        }
      }
    }
  },
  ...props.options
}))
</script>
