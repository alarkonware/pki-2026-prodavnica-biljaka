<script setup lang="ts">
import PlantCard from '@/components/PlantCard.vue'
import type { PlantModel } from '@/models/plant.model'
import { PlantService } from '@/services/plant.service'
import { UserService } from '@/services/user.service'
import { computed, ref } from 'vue'

const user = UserService.currentUser()
const plants = ref<PlantModel[]>([])

const categories = [
  { type: 'baštensko', title: 'Baštensko', icon: 'fa-tree' },
  { type: 'sobno', title: 'Sobno', icon: 'fa-house' },
  { type: 'povrće', title: 'Povrće', icon: 'fa-carrot' },
  { type: 'začinsko', title: 'Začinsko', icon: 'fa-mortar-pestle' },
  { type: 'cvetajuće', title: 'Cvetajuće', icon: 'fa-seedling' }
]
// na pocetku je izabrana prva kategorija (BaštenskO)
const selected = ref(categories[0]!)

// Učitavam sve biljke i čuvam ih u plants, da bi se prikazale na stranici
PlantService.getPlants().then(data => plants.value = data)

// tri do cetiri najbolje ocenjene biljke izabrane kategorije
const topPicks = computed(() => {
  return PlantService.getTopByType(plants.value, selected.value.type, 4)
})
</script>

<template>
  <!-- PORUKA DOBRODOSLICE - SEKCIJA -->
  <section class="hero mb-5">
    <i class="fa-solid fa-leaf hero-leaf hero-leaf-1"></i>
    <i class="fa-solid fa-leaf hero-leaf hero-leaf-2"></i>

    <div class="hero-content">
      <div class="hero-text">
        <h1 class="display-5 fw-bold mb-3">
          Zdravo<template v-if="user">, {{ user.firstName }}</template>!
        </h1>
        <p class="lead mb-3">
          U našoj ponudi imamo različite vrste biljaka, od kućnih ljubimaca na prozoru do cvetnih
          bašti. Šta vam treba danas?
        </p>
        <p class="mb-3">Kliknite na kategoriju i pogledajte naše top izbore.</p>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <button type="button" class="category-btn" v-for="c in categories" :key="c.type"
          :class="{ active: selected.type == c.type }" @click="selected = c">
          <i class="fa-solid" :class="c.icon"></i>
          {{ c.title }}
        </button>
      </div>
    </div>
  </section>

  <!-- TOP IZBORI -->
  <section class="mb-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Top izbori: {{ selected.title }}</h4>
      <RouterLink :to="{ path: '/plants', query: { type: selected.type } }" class="btn btn-outline-success btn-sm">
        Pogledaj sve <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </div>

    <div class="row">
      <div class="col-12 col-md-6 col-lg-6 mb-3" v-for="p in topPicks" :key="p.id">
        <PlantCard :plant="p" />
      </div>
    </div>
  </section>

  <!-- KAKO FUNKCIONISE REZERVACIJA -->
  <section class="mb-4">
    <div class="text-center mb-4">
      <h3 class="page-title mb-1">Kako funkcioniše rezervacija</h3>
      <p class="text-body-secondary mb-0">Od izbora biljke do preuzimanja u tri jednostavna koraka.</p>
    </div>

    <div class="row">
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100 text-center">
          <div class="card-body">
            <div class="step-number mx-auto mb-3">1</div>
            <h5>Pronađite biljku</h5>
            <p class="text-body-secondary small mb-0">Pretražite ponudu po nazivu, tipu, ceni, ciljnoj grupi ili oceni kupaca.</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100 text-center">
          <div class="card-body">
            <div class="step-number mx-auto mb-3">2</div>
            <h5>Rezervišite</h5>
            <p class="text-body-secondary small mb-0">Izaberite količinu, dodajte napomenu i biljka ulazi u vašu korpu rezervacija.</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100 text-center">
          <div class="card-body">
            <div class="step-number mx-auto mb-3">3</div>
            <h5>Preuzmite i ocenite</h5>
            <p class="text-body-secondary small mb-0">Kada porudžbina pristigne, ostavite ocenu i recenziju za druge kupce.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- IZ NASE PRODAVNICE -->
  <section class="mt-5">
    <div class="text-center mb-4">
      <h3 class="page-title mb-1">Iz naše prodavnice</h3>
      <p class="text-body-secondary mb-0">
        Pogledajte kako izgleda naš prostor. Adresu i radno vreme potražite u sekciji
        <RouterLink to="/about">O nama</RouterLink>.
      </p>
    </div>
    <div class="gallery">
      <div class="image-slot" v-for="n in 5" :key="n">
        <img :src="`/src/assets/images/prodavnica${n}.jpg`" alt="Prodavnica">
      </div>
    </div>
  </section>
</template>
