<template>
  <div class="w-full">
    <!-- Table Container -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Header -->
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th
              v-if="selectable"
              scope="col"
              class="w-12 px-4 py-3 text-left"
            >
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAll"
                class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :style="column.width ? `width: ${column.width}` : ''"
              :class="[
                'px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800' : ''
              ]"
              @click="column.sortable && sortBy(column.key)"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>
                <template v-if="column.sortable">
                  <ChevronUpIcon
                    v-if="sortColumn === column.key && sortDirection === 'asc'"
                    class="w-4 h-4"
                  />
                  <ChevronDownIcon
                    v-else-if="sortColumn === column.key && sortDirection === 'desc'"
                    class="w-4 h-4"
                  />
                  <ChevronUpDownIcon v-else class="w-4 h-4 text-gray-400" />
                </template>
              </div>
            </th>
            <th
              v-if="$slots.actions"
              scope="col"
              class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <template v-if="!loading && paginatedData.length > 0">
            <tr
              v-for="(row, index) in paginatedData"
              :key="index"
              :class="[
                hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors' : '',
                striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-900' : '',
                'cursor-pointer'
              ]"
              @click="$emit('row-click', row)"
            >
              <td v-if="selectable" class="px-4 py-3">
                <input
                  type="checkbox"
                  :checked="selectedRows.includes(row)"
                  @change="toggleRow(row)"
                  @click.stop
                  class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                />
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ row[column.key] }}
                </slot>
              </td>
              <td v-if="$slots.actions" class="px-4 py-3 text-right text-sm">
                <slot name="actions" :row="row" />
              </td>
            </tr>
          </template>

          <!-- Loading State -->
          <tr v-if="loading">
            <td :colspan="columnCount" class="px-4 py-12 text-center">
              <div class="flex items-center justify-center">
                <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="!loading && paginatedData.length === 0">
            <td :colspan="columnCount" class="px-4 py-12 text-center">
              <slot name="empty">
                <div class="text-gray-500 dark:text-gray-400">
                  <p class="text-sm">No data available</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && !loading && paginatedData.length > 0" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ pagination.total }} results
      </div>
      <div class="flex items-center gap-2">
        <BaseButton
          size="sm"
          variant="secondary"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </BaseButton>
        <span class="text-sm text-gray-700 dark:text-gray-300">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <BaseButton
          size="sm"
          variant="secondary"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  loading: Boolean,
  selectable: Boolean,
  hoverable: {
    type: Boolean,
    default: true
  },
  striped: Boolean,
  pagination: Object
})

const emit = defineEmits(['row-click', 'selection-change', 'sort', 'page-change'])

const selectedRows = ref([])
const sortColumn = ref(null)
const sortDirection = ref('asc')
const currentPage = ref(1)

const columnCount = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  if (props.$slots?.actions) count++
  return count
})

const allSelected = computed(() => {
  return props.data.length > 0 && selectedRows.value.length === props.data.length
})

const paginatedData = computed(() => {
  if (!props.pagination) return props.data

  const start = (currentPage.value - 1) * props.pagination.perPage
  const end = start + props.pagination.perPage
  return props.data.slice(start, end)
})

const totalPages = computed(() => {
  if (!props.pagination) return 1
  return Math.ceil(props.pagination.total / props.pagination.perPage)
})

const startIndex = computed(() => {
  if (!props.pagination) return 0
  return (currentPage.value - 1) * props.pagination.perPage
})

const endIndex = computed(() => {
  if (!props.pagination) return props.data.length
  const end = currentPage.value * props.pagination.perPage
  return Math.min(end, props.pagination.total)
})

const toggleAll = () => {
  if (allSelected.value) {
    selectedRows.value = []
  } else {
    selectedRows.value = [...props.data]
  }
  emit('selection-change', selectedRows.value)
}

const toggleRow = (row) => {
  const index = selectedRows.value.indexOf(row)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(row)
  }
  emit('selection-change', selectedRows.value)
}

const sortBy = (key) => {
  if (sortColumn.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = key
    sortDirection.value = 'asc'
  }
  emit('sort', { column: key, direction: sortDirection.value })
}

const goToPage = (page) => {
  currentPage.value = page
  emit('page-change', page)
}
</script>
