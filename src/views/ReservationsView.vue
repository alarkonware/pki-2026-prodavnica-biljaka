<script setup lang="ts">
import EmptyBox from '@/components/EmptyBox.vue'
import ReservationCard from '@/components/ReservationCard.vue'
import type { OrderStatus } from '@/models/order.model'
import { UserService } from '@/services/user.service'
import { getCartTotal, notifyError, notifySuccess } from '@/utils'
import { computed, ref } from 'vue'

const user = ref(UserService.currentUser())
const tab = ref<OrderStatus | 'sve'>('sve')
const tabs: { value: OrderStatus | 'sve', title: string }[] = [
  { value: 'sve', title: 'Sve' },
  { value: 'rezervisano', title: 'Rezervisano' },
  { value: 'pristiglo', title: 'Pristiglo' },
  { value: 'otkazano', title: 'Otkazano' }
]

// obrisane stavke se ne prikazuju, najnovije su prve
const orders = computed(() => {
  if (!user.value) {
    return []
  }

  return user.value.orders
    .filter(o => o.deletedAt == null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})

const shown = computed(() => orders.value.filter(o => tab.value == 'sve' || o.status == tab.value))
const waiting = computed(() => orders.value.filter(o => o.status == 'rezervisano'))
const total = computed(() => getCartTotal(orders.value))

function count(status: OrderStatus) {
  return orders.value.filter(o => o.status == status).length
}

function reload() {
  user.value = UserService.currentUser()
}

// Dostava: sve rezervisane biljke pristizu
function deliver() {
  const arrived = UserService.deliverReservations()
  if (arrived.length == 0) {
    notifyError('Nema rezervacija na čekanju.')
    return
  }

  reload()
  notifySuccess(`Pristigle biljke: ${arrived.join(', ')}. Sada ih možete oceniti.`)
}
</script>

<template>
  <h2 class="page-title mb-1">
    <i class="fa-solid fa-basket-shopping"></i> Rezervacije
  </h2>
  <p class="text-body-secondary mb-3">Izmena je moguća dok je status "rezervisano".</p>

  <!-- Ako korisnik nema nijednu rezervaciju, prikazujem poruku i dugme koje vodi na biljke -->
  <EmptyBox icon="fa-basket-shopping" title="Još nemate rezervacija"
    text="Pogledajte našu ponudu i rezervišite prvu biljku. Sve vaše rezervacije biće na ovom mestu."
    v-if="orders.length == 0">
    <RouterLink to="/plants" class="btn btn-success">
      <i class="fa-solid fa-leaf"></i> Pogledaj biljke
    </RouterLink>
  </EmptyBox>

  <template v-else>
    <div class="res-summary mb-3">
      <span><b>{{ count('rezervisano') }}</b> rezervisano</span>
      <span><b>{{ count('pristiglo') }}</b> pristiglo</span>
      <span><b>{{ count('otkazano') }}</b> otkazano</span>
    </div>

    <div class="res-tabs mb-3">
      <button type="button" class="res-tab" v-for="t in tabs" :key="t.value"
        :class="{ active: tab == t.value }" @click="tab = t.value">{{ t.title }}</button>
    </div>

    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="mb-3" v-for="o in shown" :key="o.id">
          <ReservationCard :order="o" @changed="reload()" />
        </div>
        <p class="text-body-secondary" v-if="shown.length == 0">Nema stavki u ovoj kategoriji.</p>

        <button type="button" class="btn btn-outline-secondary" @click="deliver()">
          <i class="fa-solid fa-truck"></i> Dostava
        </button>
      </div>

      <div class="col-12 col-lg-4 mt-3 mt-lg-0">
        <div class="res-total">
          <h5 class="section-title">Na čekanju</h5>
          <div class="stat-row" v-for="o in waiting" :key="o.id">
            <span>{{ o.plantName }} x {{ o.quantity }}</span>
            <strong>{{ o.pricePerPlant * o.quantity }} RSD</strong>
          </div>
          <p class="text-body-secondary small" v-if="waiting.length == 0">Nema rezervacija na čekanju.</p>
          <div class="d-flex justify-content-between align-items-baseline my-3">
            <span>Ukupna vrednost</span>
            <span class="plant-price" style="font-size: 1.8rem">{{ total }} RSD</span>
          </div>
          <RouterLink to="/plants" class="btn btn-success w-100">
            <i class="fa-solid fa-leaf"></i> Rezerviši još biljaka
          </RouterLink>
        </div>
      </div>
    </div>
  </template>
</template>
