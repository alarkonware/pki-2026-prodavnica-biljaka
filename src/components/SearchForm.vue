<script setup lang="ts">
import type { SearchFilters } from '@/models/plant.model'

defineProps<{
  filters: SearchFilters
  types: string[]
  groups: string[]
}>()

const emit = defineEmits<{
  search: []
  reset: []
}>()
</script>

<template>
  <form class="filter-side" @submit.prevent="emit('search')" @keydown.enter.prevent="emit('search')">
    <div class="filter-title"><i class="fa-solid fa-sliders"></i> Filteri pretrage</div>

    <!-- TEKSTUALNI KRITERIJUMI -->
    <div class="filter-block">
      <div class="filter-label">Naziv</div>
      <div class="search-pill">
        <i class="fa-solid fa-tag"></i>
        <input type="text" placeholder="npr. hortenzija" v-model="filters.name">
      </div>
    </div>
    <div class="filter-block">
      <div class="filter-label">Opis (sadnja i nega)</div>
      <div class="search-pill">
        <i class="fa-solid fa-align-left"></i>
        <input type="text" placeholder="npr. zalivanje" v-model="filters.description">
      </div>
    </div>
    <div class="filter-block">
      <div class="filter-label">Recenzije</div>
      <div class="search-pill">
        <i class="fa-solid fa-comment"></i>
        <input type="text" placeholder="npr. miris" v-model="filters.reviewText">
      </div>
    </div>

    <!-- TIP I CILJNA GRUPA -->
    <div class="filter-block">
      <div class="filter-label">Tip</div>
      <button type="button" class="pill-btn" :class="{ active: filters.type == '' }"
        @click="filters.type = ''">Svi</button>
      <button type="button" class="pill-btn" v-for="t in types" :key="t"
        :class="{ active: filters.type == t }" @click="filters.type = t">{{ t }}</button>
    </div>
    <div class="filter-block">
      <div class="filter-label">Ciljna grupa</div>
      <button type="button" class="pill-btn" :class="{ active: filters.targetGroup == '' }"
        @click="filters.targetGroup = ''">Sve</button>
      <button type="button" class="pill-btn" v-for="g in groups" :key="g"
        :class="{ active: filters.targetGroup == g }" @click="filters.targetGroup = g">{{ g }}</button>
    </div>

    <!-- OCENA -->
    <div class="filter-block">
      <div class="filter-label">Minimalna ocena</div>
      <button type="button" class="star-pick" v-for="n in 5" :key="n"
        :class="{ on: n <= filters.minRating }"
        @click="filters.minRating = filters.minRating == n ? 0 : n">★</button>
      <small class="text-body-secondary ms-2">{{ filters.minRating > 0 ? filters.minRating + ' i više' : 'sve ocene' }}</small>
    </div>

    <!-- CENA -->
    <div class="filter-block">
      <div class="filter-label">Cena (RSD)</div>
      <div class="d-flex align-items-center gap-2">
        <input type="number" min="0" class="form-control" placeholder="od" v-model.number="filters.priceFrom">
        <span>-</span>
        <input type="number" min="0" class="form-control" placeholder="do" v-model.number="filters.priceTo">
      </div>
    </div>

    <!-- DATUM PROIZVODNJE: bira se iz kalendara -->
    <div class="filter-block">
      <div class="filter-label">Datum proizvodnje</div>
      <div class="d-flex align-items-center gap-2 mb-2">
        <span class="small text-body-secondary" style="width: 28px">Od</span>
        <input type="date" class="form-control" v-model="filters.producedFrom">
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="small text-body-secondary" style="width: 28px">Do</span>
        <input type="date" class="form-control" v-model="filters.producedTo">
      </div>
    </div>

    <div class="d-flex gap-2 p-3 filter-actions">
      <button type="submit" class="btn btn-success flex-grow-1">
        <i class="fa-solid fa-magnifying-glass"></i> Pretraži
      </button>
      <button type="button" class="btn btn-outline-secondary" @click="emit('reset')">
        <i class="fa-solid fa-rotate-left"></i> Poništi
      </button>
    </div>
  </form>
</template>
