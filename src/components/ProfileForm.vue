<script setup lang="ts">
import type { ProfileModel } from '@/models/user.model'
import { PlantService } from '@/services/plant.service'
import { ref } from 'vue'

const props = defineProps<{
  profile: ProfileModel
  buttonText: string
  lockUsername?: boolean
  sections?: boolean
}>()

const emit = defineEmits<{ submit: [] }>()

// tipovi biljaka se uzimaju iz ponude
const types = ref<string[]>([])
PlantService.getPlants().then(plants => types.value = PlantService.getTypes(plants))

// omiljeni tip se dodaje ili uklanja klikom na dugme
function toggleType(type: string) {
  const list = props.profile.favoriteTypes
  const index = list.indexOf(type)
  if (index >= 0) {
    list.splice(index, 1)
  } else {
    list.push(type)
  }
}
</script>

<template>
  <form @submit.prevent="emit('submit')">
    <h6 class="section-title" v-if="sections"><i class="fa-solid fa-user"></i> Lični podaci</h6>
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <label class="form-label">Ime</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
          <input type="text" class="form-control" placeholder="Ime" v-model="profile.firstName">
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label class="form-label">Prezime</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
          <input type="text" class="form-control" placeholder="Prezime" v-model="profile.lastName">
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label class="form-label">Korisničko ime</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fa-solid fa-id-badge"></i></span>
          <input type="text" class="form-control" placeholder="korisnicko.ime" v-model="profile.username"
            :disabled="lockUsername">
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label class="form-label">Lozinka</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
          <input type="password" class="form-control" placeholder="lozinka" v-model="profile.password">
        </div>
      </div>
    </div>

    <h6 class="section-title mt-2" v-if="sections"><i class="fa-solid fa-address-book"></i> Kontakt</h6>
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <label class="form-label">E-mail</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
          <input type="email" class="form-control" placeholder="ime@mail.com" v-model="profile.email">
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label class="form-label">Telefon</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
          <input type="text" class="form-control" placeholder="06x xxx xxxx" v-model="profile.phone">
        </div>
      </div>
      <div class="col-12 mb-3">
        <label class="form-label">Adresa</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
          <input type="text" class="form-control" placeholder="Ulica i broj, grad" v-model="profile.address">
        </div>
      </div>
    </div>

    <h6 class="section-title mt-2" v-if="sections"><i class="fa-solid fa-leaf"></i> Omiljene vrste biljaka</h6>
    <div class="mb-4">
      <label class="form-label" v-if="!sections">Omiljene vrste biljaka</label>
      <div>
        <button type="button" class="pill-btn" v-for="t in types" :key="t"
          :class="{ active: profile.favoriteTypes.includes(t) }" @click="toggleType(t)">{{ t }}</button>
      </div>
    </div>

    <button type="submit" class="btn btn-success btn-lg" :class="{ 'w-100': !sections }">
      <i class="fa-solid fa-floppy-disk" v-if="sections"></i> {{ buttonText }}
    </button>
  </form>
</template>
