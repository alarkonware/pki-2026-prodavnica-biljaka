<script setup lang="ts">
import type { UserModel } from '@/models/user.model'

// Prop je podatak koji komponenta dobija od roditelja;
// footer od App.vue prima prijavljenog korisnika (ili null ako niko nije prijavljen)
defineProps<{ user: UserModel | null }>()
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-5 mb-4">
          <h5 class="text-white">
            <i class="fa-solid fa-seedling"></i> Baštenska Oaza
          </h5>
          <p class="small mb-0">
            Digitalna prodavnica biljaka. Pretražite ponudu, pročitajte iskustva drugih kupaca i
            rezervišite biljke za svoj dom ili baštu.
          </p>
        </div>

        <div class="col-6 col-md-3 mb-4">
          <h6>Navigacija</h6>
          <ul class="list-unstyled small mb-0">
            <li class="mb-1"><RouterLink to="/">Početna</RouterLink></li>
            <li class="mb-1"><RouterLink to="/plants">Biljke</RouterLink></li>
            <li class="mb-1"><RouterLink to="/help">Najčešća pitanja</RouterLink></li>
            <li class="mb-1"><RouterLink to="/about">O nama</RouterLink></li>
            <!-- prikaži ovaj red samo ako je korisnik prijavljen -->
            <li class="mb-1" v-if="user"><RouterLink to="/reservations">Rezervacije</RouterLink></li>
          </ul>
        </div>

        <div class="col-6 col-md-4 mb-4">
          <h6>Kontakt</h6>
          <ul class="list-unstyled small mb-0">
            <li class="mb-1"><i class="fa-solid fa-envelope"></i> info@bastenska-oaza.rs</li>
            <li class="mb-1"><i class="fa-solid fa-phone"></i> 011 123 4567</li>
            <li class="mb-1"><i class="fa-solid fa-location-dot"></i> Bulevar umetnosti 1, Beograd</li>
            <li class="mb-1"><i class="fa-regular fa-clock"></i> Pon - Sub: 09 - 20h</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom py-3 text-center small">
      © 2026 Baštenska Oaza. Sva prava zadržana.
    </div>
  </footer>
</template>
