<script setup lang="ts">
import NWSZones from 'virtual:nws-zones'
const zones = JSON.stringify(NWSZones, null, 2)
</script>

<template>
  <main>{{ zones }}</main>
</template>
