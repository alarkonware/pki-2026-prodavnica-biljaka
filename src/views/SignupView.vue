<script setup lang="ts">
import ProfileForm from '@/components/ProfileForm.vue'
import { UserService } from '@/services/user.service'
import { notifyError, notifySuccess } from '@/utils'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const profile = ref(UserService.emptyProfile())

function signup() {
  // sva polja profila su obavezna
  const error = UserService.createUser(profile.value)
  if (error) {
    notifyError(error)
    return
  }

  UserService.signIn(profile.value.username, profile.value.password)
  notifySuccess('Uspešno ste se registrovali.')

  const redirect = route.query.redirect
  router.push(typeof redirect == 'string' ? redirect : '/')
}
</script>

<template>
  <div class="auth-box" style="max-width: 1000px">
    <div class="auth-side">
      <h2 class="fw-bold mb-2">Napravite nalog</h2>
      <p class="mb-4">Registracija traje manje od minuta. Sva polja su obavezna.</p>
      <ul class="list-unstyled mb-0">
        <li><i class="fa-solid fa-check"></i> Čuvanje rezervacija na jednom mestu</li>
        <li><i class="fa-solid fa-check"></i> Izmena podataka u profilu</li>
        <li><i class="fa-solid fa-check"></i> Pomoć asistenta u svakom trenutku</li>
      </ul>
    </div>

    <div class="auth-form">
      <h3 class="page-title mb-1">Registracija</h3>
      <p class="text-body-secondary mb-2">Popunite podatke o sebi.</p>
      <ProfileForm :profile="profile" button-text="Registruj se" @submit="signup()" />
      <p class="small text-body-secondary mt-3 mb-0">
        Već imate nalog? <RouterLink to="/login" class="fw-bold">Prijavite se</RouterLink>
      </p>
    </div>
  </div>
</template>
