<script setup lang="ts">
import Rating from '@/components/Rating.vue'
import type { OrderModel } from '@/models/order.model'
import { PlantService } from '@/services/plant.service'
import { UserService } from '@/services/user.service'
import { askConfirm, formatDate, getOrderPrice, notifyError, onImageError } from '@/utils'
import { ref } from 'vue'

const props = defineProps<{ order: OrderModel }>()
const emit = defineEmits<{ changed: [] }>()

const image = ref('')
PlantService.getPlantById(props.order.plantId).then(p => image.value = p ? p.imageUrl : '')

// izmena rezervacije
const editing = ref(false)
const quantity = ref(props.order.quantity)
const note = ref(props.order.note)

// ocenjivanje
const rating = ref(false)
const newRating = ref(5)
const comment = ref('')

// boja tackice pored statusa
function statusColor() {
  if (props.order.status == 'rezervisano') return '#1f5fbf'
  if (props.order.status == 'pristiglo') return '#b5502e'
  return '#8a7f78'
}

function startEdit() {
  quantity.value = props.order.quantity
  note.value = props.order.note
  editing.value = true
}

function saveEdit() {
  if (!quantity.value || quantity.value < 1 || !Number.isInteger(quantity.value)) {
    notifyError('Količina mora biti ceo broj, najmanje 1.')
    return
  }

  UserService.editReservation(props.order, quantity.value, note.value)
  editing.value = false
  emit('changed')
}

function cancel() {
  askConfirm('Da li želite da otkažete rezervaciju?', () => {
    UserService.cancelReservation(props.order)
    emit('changed')
  })
}

function remove() {
  askConfirm('Da li želite da obrišete stavku iz rezervacija?', () => {
    UserService.deleteReservation(props.order)
    emit('changed')
  })
}

function sendRating() {
  UserService.rateReservation(props.order, newRating.value, comment.value)
  rating.value = false
  emit('changed')
}
</script>

<template>
  <div>
    <div class="res-item" :class="{ faded: order.status == 'otkazano' }">
      <img :src="image" :alt="order.plantName" class="res-thumb" @error="onImageError">

      <div>
        <RouterLink :to="`/details/${order.plantId}`" class="fs-5 fw-semibold text-decoration-none">
          {{ order.plantName }}
        </RouterLink>
        <div class="small text-body-secondary">
          <span class="status-dot" :style="{ background: statusColor() }"></span>{{ order.status }}
        </div>
        <div class="small text-body-secondary">
          {{ order.quantity }} x {{ order.pricePerPlant }} RSD · {{ formatDate(order.createdAt) }}
          <span v-if="order.note"> · Napomena: {{ order.note }}</span>
        </div>
        <div class="small" v-if="order.rating">
          Vaša ocena: <Rating :value="order.rating" :show-number="false" />
        </div>
      </div>

      <div class="text-end">
        <div class="fs-5 fw-bold mb-1" :class="{ 'text-decoration-line-through': order.status == 'otkazano' }">
          {{ getOrderPrice(order) }} RSD
        </div>
        <!-- izmena i otkazivanje samo dok je status rezervisano -->
        <template v-if="order.status == 'rezervisano'">
          <button type="button" class="link-btn me-3" @click="cancel()">Otkaži</button>
          <button type="button" class="btn btn-outline-success btn-sm" @click="startEdit()">
            <i class="fa-solid fa-pen"></i> Izmeni
          </button>
        </template>

        <!-- ocenjivanje samo kada je status pristiglo i jos nije ocenjeno -->
        <template v-if="order.status == 'pristiglo'">
          <button type="button" class="link-btn me-3" @click="remove()">Obriši</button>
          <button type="button" class="btn btn-outline-success btn-sm" v-if="!order.rating"
            @click="rating = !rating">
            <i class="fa-solid fa-star text-warning"></i> Oceni
          </button>
        </template>

        <!-- brisanje je moguce kada status nije rezervisano -->
        <button type="button" class="link-btn" v-if="order.status == 'otkazano'" @click="remove()">Obriši</button>
      </div>
    </div>

    <!-- PANEL ZA IZMENU -->
    <div class="card card-body py-3 mt-2" v-if="editing">
      <div class="row g-2 align-items-end">
        <div class="col-4 col-md-2">
          <label class="form-label small mb-1">Količina</label>
          <input type="number" min="1" step="1" class="form-control" v-model.number="quantity">
        </div>
        <div class="col-8 col-md-6">
          <label class="form-label small mb-1">Napomena</label>
          <input type="text" class="form-control" v-model="note">
        </div>
        <div class="col-12 col-md-4">
          <button type="button" class="btn btn-success me-2" @click="saveEdit()">
            <i class="fa-solid fa-check"></i> Sačuvaj
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="editing = false">Odustani</button>
        </div>
      </div>
    </div>

    <!-- PANEL ZA OCENJIVANJE -->
    <div class="card card-body py-3 mt-2" v-if="rating">
      <div class="row g-2 align-items-end">
        <div class="col-12 col-md-3">
          <label class="form-label small mb-1">Ocena</label>
          <select class="form-select" v-model.number="newRating">
            <option :value="5">5 - odlično</option>
            <option :value="4">4 - vrlo dobro</option>
            <option :value="3">3 - dobro</option>
            <option :value="2">2 - slabo</option>
            <option :value="1">1 - loše</option>
          </select>
        </div>
        <div class="col-12 col-md-5">
          <label class="form-label small mb-1">Komentar (nije obavezan)</label>
          <input type="text" class="form-control" v-model="comment">
        </div>
        <div class="col-12 col-md-4">
          <button type="button" class="btn btn-success me-2" @click="sendRating()">Pošalji</button>
          <button type="button" class="btn btn-outline-secondary" @click="rating = false">Odustani</button>
        </div>
      </div>
    </div>
  </div>
</template>