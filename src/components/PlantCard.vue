<script setup lang="ts">
import type { PlantModel } from '@/models/plant.model'
import { formatDay, onImageError } from '@/utils'
import { useRouter } from 'vue-router'

defineProps<{ plant: PlantModel }>()
const router = useRouter()
</script>

<template>
  <!-- cela kartica otvara detalje biljke -->
  <div class="plant-row" style="cursor: pointer" @click="router.push(`/details/${plant.id}`)">
    <div class="plant-row-img">
      <img :src="plant.imageUrl" :alt="plant.name" @error="onImageError">
      <span class="plant-row-rate">
        <i class="fa-solid fa-star text-warning"></i>
        {{ plant.averageRating > 0 ? plant.averageRating.toFixed(1) : '-' }} ({{ plant.reviewCount }})
      </span>
    </div>

    <div class="plant-row-body">
      <h5 class="mb-1">{{ plant.name }}</h5>
      <p class="small fst-italic text-body-secondary mb-1">{{ plant.latinName }}</p>
      <div>
        <span v-for="t in plant.types" :key="t" class="chip">{{ t }}</span>
      </div>
      <p class="small text-body-secondary mb-2">{{ plant.description }}</p>
      <div class="small text-body-secondary mb-2">
        <div><i class="fa-solid fa-users"></i> {{ plant.targetGroup }}</div>
        <div><i class="fa-regular fa-calendar"></i> Proizvedeno {{ formatDay(plant.producedAt) }}</div>
      </div>

      <div class="plant-row-bottom">
        <span class="plant-price">{{ plant.price }} <small class="fs-6 text-body-secondary">RSD</small></span>
        <div>
          <!-- .stop sprecava da klik na dugme otvori i karticu -->
          <RouterLink :to="`/details/${plant.id}`" class="btn btn-outline-success btn-sm me-1" @click.stop>
            Detalji
          </RouterLink>
          <RouterLink :to="`/order/${plant.id}`" class="btn btn-success btn-sm" @click.stop>
            <i class="fa-solid fa-basket-shopping"></i> Rezerviši
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>