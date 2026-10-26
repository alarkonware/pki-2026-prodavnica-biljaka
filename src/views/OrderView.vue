<script setup lang="ts">
import InfoCard from '@/components/InfoCard.vue'
import type { PlantModel } from '@/models/plant.model'
import { PlantService } from '@/services/plant.service'
import { UserService } from '@/services/user.service'
import { askConfirm, notifyError, onImageError, reservedDialog } from '@/utils'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const plant = ref<PlantModel>()
const quantity = ref(1)
const note = ref('')

PlantService.getPlantById(Number(route.params.id))
  .then(data => plant.value = data)

// Menja količinu za +1 ili -1, ali uvek ostaje između 1 i 20
function changeQuantity(step: number) {
  quantity.value = Math.min(20, Math.max(1, (quantity.value || 1) + step))
}

function reserve() {
  const p = plant.value
  if (!p)
    return

  if (!quantity.value || quantity.value < 1 || !Number.isInteger(quantity.value)) {
    notifyError('Količina mora biti ceo broj, najmanje 1.')
    return
  }

  if (quantity.value > 20) {
    notifyError('Trenutno dozvoljena količina po rezervaciji je 20 komada.')
    return
  }

  askConfirm(`Da li želite da rezervišete ${quantity.value} x ${p.name}?`, () => {
    UserService.reserve({
      plantId: p.id,
      plantName: p.name,
      quantity: quantity.value,
      pricePerPlant: p.price,
      note: note.value,
      status: 'rezervisano',
      rating: null,
      createdAt: new Date().toISOString(),
      deletedAt: null
    })

    // korisnik sam bira: rezervacije ili nastavak biranja biljaka
    reservedDialog(
      () => router.push('/reservations'),
      () => router.push('/plants')
    )
  })
}
</script>

<template>
  <template v-if="plant">
    <h2 class="page-title mx-auto mb-3" style="max-width: 980px">
      <i class="fa-solid fa-basket-shopping"></i> Nova rezervacija
    </h2>

    <div class="row mx-auto" style="max-width: 980px">
      <div class="col-12 col-md-5 mb-3">
        <div class="card h-100 overflow-hidden">
          <div class="detail-img" style="min-height: 230px; border-radius: 0">
            <img :src="plant.imageUrl" :alt="plant.name" @error="onImageError">
          </div>
          <div class="card-body">
            <div class="mb-2">
              <span v-for="t in plant.types" :key="t" class="chip">{{ t }}</span>
            </div>
            <h4>{{ plant.name }}</h4>
            <div class="plant-price">{{ plant.price }} <small class="fs-6 text-body-secondary">RSD po komadu</small></div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-7 mb-3">
        <form class="card h-100" novalidate @submit.prevent="reserve()">
          <div class="card-body">
            <div class="filter-label">Količina</div>
            <div class="qty-stepper mb-3">
              <button type="button" @click="changeQuantity(-1)"><i class="fa-solid fa-minus"></i></button>
              <input type="number" v-model.number="quantity">
              <button type="button" @click="changeQuantity(1)"><i class="fa-solid fa-plus"></i></button>
            </div>

            <div class="filter-label">Napomena (nije obavezno)</div>
            <textarea class="form-control mb-3" rows="3" placeholder="npr. za balkon, poklon..." v-model="note"></textarea>

            <div class="total-line mb-3">
              <span>Ukupno za {{ quantity || 0 }} kom.<br>
                <small class="text-body-secondary">{{ quantity || 0 }} x {{ plant.price }} RSD</small></span>
              <span class="plant-price">{{ plant.price * (quantity || 0) }} RSD</span>
            </div>

            <button type="submit" class="btn btn-success btn-lg me-2">
              <i class="fa-solid fa-check"></i> Potvrdi rezervaciju
            </button>
            <!-- Nazad vraca korisnika na prethodnu stranicu -->
            <button type="button" class="btn btn-outline-secondary btn-lg" @click="router.back()">Nazad</button>

            <p class="small text-body-secondary mt-3 mb-0">
              Rezervaciju možete izmeniti ili otkazati u "Rezervacije" dok ne pristigne.
            </p>
          </div>
        </form>
      </div>
    </div>
  </template>

  <InfoCard title="Učitavanje" icon="fa-seedling" v-else>
    Učitavanje podataka... sačekajte
  </InfoCard>
</template>