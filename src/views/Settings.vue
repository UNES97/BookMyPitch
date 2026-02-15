<template>
  <div>
    <BaseCard title="Settings" subtitle="Configure your venue and application settings">
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Venue Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput
              v-model="settingsStore.venueInfo.name"
              label="Venue Name"
              placeholder="Enter venue name"
            />
            <BaseInput
              v-model="settingsStore.venueInfo.phone"
              label="Phone"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <BaseButton @click="saveSettings">Save Settings</BaseButton>
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
  alert('Settings saved successfully!')
}
</script>
