<script setup lang="ts">

// Okvir sa porukom kad nema šta da se prikaže (nema rezervacija, nema biljaka...)
// ikonicu, naslov i tekst dobija od roditelja
defineProps<{
  icon: string
  title: string
  text: string
}>()
</script>

<template>
  <div class="empty-box">
    <div class="empty-icon"><i class="fa-solid" :class="icon"></i></div>
    <h4 class="page-title">{{ title }}</h4>
    <p class="text-body-secondary mb-3">{{ text }}</p>
    <slot></slot>
  </div>
</template>
