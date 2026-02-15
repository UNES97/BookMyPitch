<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useUIStore } from '@stores/ui'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
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
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString()
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
        }
      }
    }
  },
  ...props.options
}))
</script>
