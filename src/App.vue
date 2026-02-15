<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUIStore } from '@stores/ui'

const uiStore = useUIStore()

onMounted(() => {
  uiStore.initDarkMode()
})
</script>
