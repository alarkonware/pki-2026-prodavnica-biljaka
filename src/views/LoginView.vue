<script setup lang="ts">
import { UserService } from '@/services/user.service'
import { notifyError } from '@/utils'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const username = ref('')
const password = ref('')

function login() {
  if (UserService.signIn(username.value, password.value)) {
    // vracamo korisnika na stranicu koju je zeleo da otvori
    const redirect = route.query.redirect
    router.push(typeof redirect == 'string' ? redirect : '/')
  } else {
    notifyError('Pogrešno korisničko ime ili lozinka!')
  }
}
</script>

<template>
  <div class="auth-box">
    <div class="auth-side">
      <h2 class="fw-bold mb-2">Dobro došli nazad</h2>
      <p class="mb-4">Prijavite se i nastavite sa rezervacijama svojih omiljenih biljaka.</p>
      <ul class="list-unstyled mb-0">
        <li><i class="fa-solid fa-check"></i> Rezervišite biljke u nekoliko klikova</li>
        <li><i class="fa-solid fa-check"></i> Pratite status svake rezervacije</li>
        <li><i class="fa-solid fa-star"></i> Ocenite biljke koje ste dobili</li>
      </ul>
    </div>

    <div class="auth-form">
      <h3 class="page-title mb-1">Prijava</h3>
      <p class="text-body-secondary mb-4">Unesite korisničko ime i lozinku.</p>
      <form @submit.prevent="login()">
        <div class="mb-3">
          <label class="form-label">Korisničko ime</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
            <input type="text" class="form-control" placeholder="npr. marko" v-model="username">
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Lozinka</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
            <input type="password" class="form-control" placeholder="lozinka" v-model="password">
          </div>
        </div>
        <button type="submit" class="btn btn-success btn-lg w-100">
          <i class="fa-solid fa-right-to-bracket"></i> Prijavi se
        </button>
      </form>
      
      <p class="small text-body-secondary mt-3 mb-0">
        Nemate nalog? <RouterLink to="/signup" class="fw-bold">Registrujte se</RouterLink>
      </p>
    </div>
  </div>
</template>
