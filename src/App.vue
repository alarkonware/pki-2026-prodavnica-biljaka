<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
import ChatAgent from './components/ChatAgent.vue'
import { UserService } from './services/user.service'
import { askConfirm } from './utils'

const route = useRoute()
const router = useRouter()

// Čitam korisnika iz localStorage-a; route.fullPath služi da se ponovo pročita kad se promeni stranica
// route.fullPath je adresa na kojoj se trenutno nalazimo
const user = computed(() => {
  route.fullPath
  return UserService.currentUser()
})

function signOut() {
  askConfirm('Da li ste sigurni da želite da se odjavite?', () => {
    UserService.signOut()
    router.push('/login')
  })
}
</script>

<template>
  <nav class="navbar navbar-expand-lg app-navbar sticky-top">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <span class="brand-icon"><i class="fa-solid fa-seedling"></i></span>Baštenska Oaza
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
        aria-controls="mainNav" aria-expanded="false" aria-label="Meni">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <!-- STRANICE -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" exact-active-class="active" to="/">
              <i class="fa-solid fa-house"></i> Početna
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/plants">
              <i class="fa-solid fa-leaf"></i> Biljke
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/help">
              <i class="fa-solid fa-circle-question"></i> Najčešća pitanja
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/about">
              <i class="fa-solid fa-circle-info"></i> O nama
            </RouterLink>
          </li>
        </ul>

        <!-- NALOG -->
        <ul class="navbar-nav align-items-lg-center mb-2 mb-lg-0">
          <!-- KORISNIK JE ULOGOVAN -->
          <template v-if="user">
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/reservations">
                <i class="fa-solid fa-basket-shopping"></i> Rezervacije
              </RouterLink>
            </li>
            <!-- ime korisnika otvara profil, odjava je odvojeno dugme -->
            <li class="nav-item ms-lg-2 my-1 my-lg-0">
              <RouterLink class="nav-user" to="/profile">
                <i class="fa-solid fa-circle-user"></i> {{ user.firstName }}
              </RouterLink>
            </li>
            <li class="nav-item ms-lg-2">
              <button type="button" class="btn btn-outline-danger btn-sm" @click="signOut()">
                <i class="fa-solid fa-right-from-bracket"></i> Odjava
              </button>
            </li>
          </template>

          <!-- KORISNIK NIJE ULOGOVAN -->
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/login">
                <i class="fa-solid fa-right-to-bracket"></i> Prijava
              </RouterLink>
            </li>
            <li class="nav-item ms-lg-2">
              <RouterLink class="btn btn-success" to="/signup">
                <i class="fa-solid fa-user-plus"></i> Registracija
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Ovde se prikazuje trenutna stranica; key ga ponovo učitava kad se promeni adresa -->
  <main class="container flex-grow-1 py-4">
    <RouterView :key="$route.fullPath" />
  </main>

<!-- Footeru šaljem korisnika da bi link Rezervacije video samo prijavljen korisnik -->
  <AppFooter :user="user" />
  <ChatAgent />
</template>
