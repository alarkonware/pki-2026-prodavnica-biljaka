<script setup lang="ts">

// Kartica sa naslovom (Opis, Sadnja, Nega na stranici detalja biljke)
// ikonica nije obavezna, a sadržaj dolazi od roditelja
defineProps<{
  title: string
  icon?: string
}>()
</script>

<template>
  <div class="info-card">
    <h6 class="info-card-title">
      <i v-if="icon" class="fa-solid me-1" :class="icon"></i>{{ title }}
    </h6>
    <slot></slot>
  </div>
</template>

<style scoped>
.info-card {
  height: 100%;
  padding: 1rem 1.2rem;
  background: #fff;
  border-left: 5px solid var(--app-green);
  border-radius: 0.3rem 0.9rem 0.9rem 0.3rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
}

.info-card-title {
  margin-bottom: 0.6rem;
  font-weight: 700;
  color: var(--app-green-dark);
}
</style>
