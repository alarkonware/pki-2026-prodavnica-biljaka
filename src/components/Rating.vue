<script setup lang="ts">

// Komponenta koja prikazuje ocenu biljke zvezdicama i prosečnom ocenom

withDefaults(defineProps<{
  value: number
  showNumber?: boolean
}>(), {
  showNumber: true
})
</script>

<template>
  <span class="text-warning" :title="`Ocena: ${value.toFixed(1)} od 5`">
    <i v-for="i in 5" :key="i" class="fa-star" :class="i <= Math.round(value) ? 'fa-solid' : 'fa-regular'"></i>
    <span v-if="showNumber" class="text-body-secondary ms-1">
      {{ value > 0 ? value.toFixed(1) : 'nema ocena' }}
    </span>
  </span>
</template>
