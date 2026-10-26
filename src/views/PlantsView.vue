<script setup lang="ts">
import EmptyBox from '@/components/EmptyBox.vue'
import InfoCard from '@/components/InfoCard.vue'
import PlantCard from '@/components/PlantCard.vue'
import SearchForm from '@/components/SearchForm.vue'
import type { PlantModel, SearchFilters } from '@/models/plant.model'
import { PlantService } from '@/services/plant.service'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const plants = ref<PlantModel[]>([])
const filtered = ref<PlantModel[]>([])
const types = ref<string[]>([])
const groups = ref<string[]>([])
const filters = ref<SearchFilters>(PlantService.emptyFilters())

// čuva šta je korisnik izabrao u polju "Sortiraj"
const sortBy = ref('default')

PlantService.getPlants()
  .then(data => {
    plants.value = data
    types.value = PlantService.getTypes(data)
    groups.value = PlantService.getTargetGroups(data)

    // ako se dolazi sa pocetne strane (?type=...), odmah se filtrira po tipu
    filters.value.type = String(route.query.type ?? '')
    filtered.value = PlantService.search(data, filters.value)
  })

// oznake aktivnih filtera iznad rezultata, klik na oznaku uklanja taj filter
const activeTags = computed(() => {
  const f = filters.value
  const tags: { text: string, clear: () => void }[] = []

  if (f.name) tags.push({ text: `naziv: ${f.name}`, clear: () => f.name = '' })
  if (f.description) tags.push({ text: `opis: ${f.description}`, clear: () => f.description = '' })
  if (f.reviewText) tags.push({ text: `recenzije: ${f.reviewText}`, clear: () => f.reviewText = '' })
  if (f.type) tags.push({ text: f.type, clear: () => f.type = '' })
  if (f.targetGroup) tags.push({ text: f.targetGroup, clear: () => f.targetGroup = '' })
  if (f.minRating > 0) tags.push({ text: `ocena ${f.minRating}+`, clear: () => f.minRating = 0 })

  return tags
})

// sortirani rezultati pretrage; sortira se kopija, da se originalni redosled ne izgubi
const sorted = computed(() => {
  const list = [...filtered.value]

  if (sortBy.value == 'priceAsc') list.sort((a, b) => a.price - b.price)
  if (sortBy.value == 'priceDesc') list.sort((a, b) => b.price - a.price)
  if (sortBy.value == 'rating') list.sort((a, b) => b.averageRating - a.averageRating)
  if (sortBy.value == 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'sr-Latn'))

  return list
})

function search() {
  filtered.value = PlantService.search(plants.value, filters.value)
}

function removeTag(clear: () => void) {
  clear()
  search()
}

function resetFilters() {
  filters.value = PlantService.emptyFilters()
  filtered.value = plants.value
}
</script>

<template>
  <div class="shop-layout">
    <SearchForm :filters="filters" :types="types" :groups="groups" @search="search()" @reset="resetFilters()" />

    <section>
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h2 class="page-title mb-0">
          Biljke <span class="fs-6 fw-normal text-body-secondary">· pronađeno {{ filtered.length }}</span>
        </h2>
        <div class="d-flex align-items-center flex-wrap gap-2">
          <div v-if="activeTags.length > 0">
            <small class="text-body-secondary">Aktivno:</small>
            <button type="button" class="active-tag" v-for="t in activeTags" :key="t.text" @click="removeTag(t.clear)">
              {{ t.text }} <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <label class="small text-body-secondary mb-0">
            <i class="fa-solid fa-arrow-down-wide-short"></i> Sortiraj:
          </label>
          <select class="form-select form-select-sm w-auto" v-model="sortBy">
            <option value="default">Podrazumevano</option>
            <option value="priceAsc">Cena: od najniže</option>
            <option value="priceDesc">Cena: od najviše</option>
            <option value="rating">Ocena: od najviše</option>
            <option value="name">Naziv: A–Z</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-12 mb-3" v-for="p in sorted" :key="p.id">
          <PlantCard :plant="p" />
        </div>
      </div>

      <EmptyBox icon="fa-magnifying-glass" title="Nema biljaka za izabrane filtere"
        text="Pokušajte sa drugačijim nazivom, širim rasponom cene ili uklonite neki od filtera."
        v-if="plants.length > 0 && filtered.length == 0">
        <button type="button" class="btn btn-success" @click="resetFilters()">
          <i class="fa-solid fa-xmark"></i> Poništi filtere
        </button>
      </EmptyBox>

      <InfoCard title="Učitavanje" icon="fa-seedling" v-if="plants.length == 0">
        Učitavanje biljaka... sačekajte
      </InfoCard>
    </section>
  </div>
</template>