<template>
  <div>
    <BaseCard title="Paramètres" subtitle="Configurer votre complexe et les paramètres de l'application">
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Informations du complexe</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput
              v-model="settingsStore.venueInfo.name"
              label="Nom du complexe"
              placeholder="Entrer le nom du complexe"
            />
            <BaseInput
              v-model="settingsStore.venueInfo.phone"
              label="Téléphone"
              placeholder="Entrer le numéro de téléphone"
            />
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <BaseButton @click="saveSettings">Enregistrer les paramètres</BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@stores/settings'
import BaseCard from '@components/ui/BaseCard.vue'
import BaseInput from '@components/ui/BaseInput.vue'
import BaseButton from '@components/ui/BaseButton.vue'

const settingsStore = useSettingsStore()

const saveSettings = () => {
  settingsStore.saveSettings()
  alert('Paramètres enregistrés avec succès !')
}
</script>
