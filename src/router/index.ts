import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlantsView from '@/views/PlantsView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import ReservationsView from '@/views/ReservationsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ProfileView from '@/views/ProfileView.vue'
import OrderView from '@/views/OrderView.vue'
import DetailsView from '@/views/DetailsView.vue'
import HelpView from '@/views/HelpView.vue'
import { UserService } from '@/services/user.service'

const router = createRouter({
  // Koristim čiste adrese bez # (npr. /plants)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: {
        title: 'Početna'
      }
    },
    {
      path: '/plants',
      component: PlantsView,
      meta: {
        title: 'Biljke'
      }
    },
    {
      path: '/about',
      component: AboutView,
      meta: {
        title: 'O nama'
      }
    },
    {
      path: '/details/:id',
      component: DetailsView,
      meta: {
        title: 'Detalji'
      }
    },
    {
      path: '/login',
      component: LoginView,
      meta: {
        title: 'Prijava'
      }
    },
    {
      path: '/signup',
      component: SignupView,
      meta: {
        title: 'Registracija'
      }
    },
    {
      path: '/reservations',
      component: ReservationsView,
      meta: {
        title: 'Rezervacije',
        requiresLogin: true
      }
    },
    {
      path: '/profile',
      component: ProfileView,
      meta: {
        title: 'Moj profil',
        requiresLogin: true
      }
    },
    {
      path: '/order/:id',
      component: OrderView,
      meta: {
        title: 'Nova rezervacija',
        requiresLogin: true
      }
    },
      {
      path: '/help',
      component: HelpView,
      meta: {
        title: 'Najčešća pitanja'
      }
    },
    {
      // sve ostale adrese
      path: '/:pathMatch(.*)*',
      component: NotFoundView,
      meta: {
        title: 'Stranica nije pronađena'
      }
    }
  ],
  // svaka nova stranica se otvara od vrha
  scrollBehavior() {
    return { top: 0 }
  }
})

// Cuvar stranica: pre svakog prelaska proverava da li stranica trazi prijavu (meta.requiresLogin).
// Ako trazi, a korisnik nije prijavljen, salje ga na /login i pamti stranicu koju je hteo
// (?redirect=...), da ga posle prijave vrati tamo. Ostale stranice se otvaraju normalno.
router.beforeEach((to) => {
  if (to.meta.requiresLogin && !UserService.currentUser()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

// Posle svakog prelaska na novu stranicu upisuje njen naslov (meta.title iz ruta)
// u tab browsera, npr. "Rezervacije | Baštenska Oaza"
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} | Baštenska Oaza`
  }
})

export default router
