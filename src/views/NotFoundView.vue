<template>
  <!-- Stranica 404: prikazuje se kad adresa ne postoji -->
  <div class="text-center py-5">
    <div class="green-box mb-3">
      <div class="not-found-num">404</div>
    </div>
    <h2 class="page-title">Ova stranica ne postoji</h2>
    <p class="text-body-secondary mx-auto" style="max-width: 480px">
      Izgleda da ste skrenuli sa staze. Biljka ili stranica koju tražite nije pronađena.
    </p>
    <RouterLink to="/" class="btn btn-success btn-lg me-2">
      <i class="fa-solid fa-house"></i> Na početnu
    </RouterLink>
    <RouterLink to="/plants" class="btn btn-outline-success btn-lg">
      <i class="fa-solid fa-leaf"></i> Pogledaj biljke
    </RouterLink>
  </div>
</template>
