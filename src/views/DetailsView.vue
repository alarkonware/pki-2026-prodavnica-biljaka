<script setup lang="ts">
import EmptyBox from '@/components/EmptyBox.vue'
import InfoCard from '@/components/InfoCard.vue'
import Rating from '@/components/Rating.vue'
import type { DetailsModel } from '@/models/details.model'
import { PlantService } from '@/services/plant.service'
import { formatDay, onImageError } from '@/utils'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// route je trenutna adresa, plant je biljka koju prikazujem, notFound je true ako biljka ne postoji
const route = useRoute()
const plant = ref<DetailsModel>()
const notFound = ref(false)

// Učitavam biljku čiji je id u adresi; ako je nema, prikazuje se poruka da nije pronađena
PlantService.getDetails(Number(route.params.id))
  .then(data => {
    if (data) {
      plant.value = data
    } else {
      notFound.value = true
    }
  })
</script>

<template>
  <template v-if="plant">
    <RouterLink to="/plants" class="btn btn-outline-secondary btn-sm mb-3">
      <i class="fa-solid fa-arrow-left"></i> Nazad na biljke
    </RouterLink>

    <!-- OSNOVNO -->
    <div class="row mb-4">
      <div class="col-12 col-md-5 mb-3">
        <div class="detail-img">
          <img :src="plant.imageUrl" :alt="plant.name" @error="onImageError">
        </div>
      </div>

      <div class="col-12 col-md-7">
        <div class="mb-2">
          <span v-for="t in plant.types" :key="t" class="chip">{{ t }}</span>
        </div>
        <h1 class="page-title">{{ plant.name }}</h1>
        <div class="mb-2">
          <Rating :value="plant.averageRating" />
          <span class="text-body-secondary"> ({{ plant.reviewCount }} recenzija)</span>
        </div>
        <p class="lead text-body-secondary">{{ plant.description }}</p>

        <div class="plant-price mb-3" style="font-size: 2.1rem">
          {{ plant.price }} <small class="fs-6 text-body-secondary">RSD po komadu</small>
        </div>

        <div class="row mb-3">
          <div class="col-6">
            <div class="fact-box">
              <i class="fa-solid fa-users"></i>
              <div><small class="d-block text-body-secondary">Ciljna grupa</small><strong>{{ plant.targetGroup }}</strong></div>
            </div>
          </div>
          <div class="col-6">
            <div class="fact-box">
              <i class="fa-regular fa-calendar"></i>
              <div><small class="d-block text-body-secondary">Datum proizvodnje</small><strong>{{ formatDay(plant.producedAt) }}</strong></div>
            </div>
          </div>
        </div>

        <RouterLink :to="`/order/${plant.id}`" class="btn btn-success btn-lg">
          <i class="fa-solid fa-basket-shopping"></i> Rezerviši
        </RouterLink>
      </div>
    </div>

    <!-- OPIS, SADNJA, NEGA -->
    <div class="row mb-4">
      <div class="col-12 col-md-4 mb-3">
        <InfoCard title="Opis" icon="fa-circle-info"><p class="mb-0">{{ plant.description }}</p></InfoCard>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <InfoCard title="Sadnja" icon="fa-seedling"><p class="mb-0">{{ plant.planting }}</p></InfoCard>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <InfoCard title="Nega" icon="fa-droplet"><p class="mb-0">{{ plant.care }}</p></InfoCard>
      </div>
    </div>

    <!-- RECENZIJE -->
    <h3 class="page-title mb-3">Recenzije kupaca</h3>
    <p v-if="plant.reviews.length == 0" class="text-body-secondary">Još nema recenzija.</p>
    <div class="d-flex gap-3 mb-3" v-for="(r, i) in plant.reviews" :key="i">
      <div class="review-avatar">{{ r.author.charAt(0).toUpperCase() }}</div>
      <div class="review-bubble">
        <strong>{{ r.author }}</strong>
        <Rating :value="r.rating" :show-number="false" class="ms-2" />
        <div>{{ r.text }}</div>
      </div>
    </div>
  </template>

  <EmptyBox icon="fa-leaf" title="Biljka nije pronađena" text="Biljka koju tražite ne postoji ili je uklonjena iz ponude."
    v-if="notFound">
    <RouterLink to="/plants" class="btn btn-success">Pogledaj biljke</RouterLink>
  </EmptyBox>

  <InfoCard title="Učitavanje" icon="fa-seedling" v-if="!plant && !notFound">
    Učitavanje podataka... sačekajte
  </InfoCard>
</template>
