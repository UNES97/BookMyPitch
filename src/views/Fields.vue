<template>
  <div>
    <BaseCard title="Gestion des terrains" subtitle="Gérer vos terrains de football">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="field in fieldsStore.fields"
          :key="field.id"
          class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ field.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ field.type }} - {{ field.size }}</p>
          <p class="text-lg font-bold text-primary mt-2">{{ field.hourlyRate  }} DH/heure</p>
          <BaseBadge :variant="getStatusVariant(field.status)" class="mt-2">
            {{ translateStatus(field.status) }}
          </BaseBadge>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { useFieldsStore } from '@stores/fields'
import { translateStatus, getStatusVariant } from '@/utils/statusTranslations'
import BaseCard from '@components/ui/BaseCard.vue'
import BaseBadge from '@components/ui/BaseBadge.vue'

const fieldsStore = useFieldsStore()
</script>
