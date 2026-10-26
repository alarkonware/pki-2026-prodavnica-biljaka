<script setup lang="ts">
import ProfileForm from '@/components/ProfileForm.vue'
import type { ProfileModel } from '@/models/user.model'
import { UserService } from '@/services/user.service'
import { notifyError, notifySuccess } from '@/utils'
import type { OrderStatus } from '@/models/order.model'
import { computed, ref } from 'vue'

// radimo sa kopijom profila, pa se podaci menjaju tek kada se klikne "Sacuvaj"
const profile = ref<ProfileModel>(UserService.emptyProfile())
const user = UserService.currentUser()

if (user) {
  profile.value = {
    username: user.username,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    favoriteTypes: [...user.favoriteTypes]
  }
}

const initials = computed(() =>
  ((user?.firstName.charAt(0) ?? '') + (user?.lastName.charAt(0) ?? '')).toUpperCase())

// broj rezervacija po statusu (obrisane se ne racunaju)
function count(status: OrderStatus) {
  return user?.orders.filter(o => o.status == status && o.deletedAt == null).length ?? 0
}

function saveProfile() {
  const error = UserService.updateProfile(profile.value)
  if (error) {
    notifyError(error)
    return
  }

  notifySuccess('Podaci profila su sačuvani.')
}
</script>

<template>
  <div class="mb-4">
    <div class="profile-top">
      <div class="profile-avatar">{{ initials }}</div>
      <div>
        <div class="fs-2 fw-bold lh-sm">{{ user?.firstName }} {{ user?.lastName }}</div>
        <div class="opacity-75">@{{ user?.username }} · {{ user?.email }}</div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-12 col-lg-8 mb-3">
      <div class="card">
        <div class="card-body">
          <ProfileForm :profile="profile" button-text="Sačuvaj izmene" lock-username sections
            @submit="saveProfile()" />
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-4 mb-3">
      <div class="card">
        <div class="card-body">
          <h6 class="section-title"><i class="fa-solid fa-id-card"></i> Pregled naloga</h6>
          <div class="stat-row"><span>Korisničko ime</span><strong>{{ profile.username }}</strong></div>
          <div class="stat-row"><span>Rezervisano</span><strong>{{ count('rezervisano') }}</strong></div>
          <div class="stat-row"><span>Pristiglo</span><strong>{{ count('pristiglo') }}</strong></div>
          <div class="stat-row"><span>Otkazano</span><strong>{{ count('otkazano') }}</strong></div>
          <RouterLink to="/reservations" class="btn btn-outline-success w-100 mt-3">
            <i class="fa-solid fa-basket-shopping"></i> Rezervacije
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
