<script setup lang="ts">

// Najcesca pitanja
const questions = [
  {
    q: 'Kako se plaća rezervisana biljka?',
    a: 'Plaćanje se vrši gotovinom prilikom preuzimanja. Rezervacijom se ništa ne naplaćuje unapred.'
  },
  {
    q: 'Kako da izmenim svoje lične podatke?',
    a: 'Kada ste prijavljeni, u gornjem meniju kliknite na ikonicu sa svojim imenom. Otvoriće se Profil, gde možete da izmenite podatke i sačuvate ih. Korisničko ime se ne može menjati.'
  },
  {
    q: 'Odakle dolaze vaše biljke?',
    a: 'Biljke uzgajamo u sopstvenom rasadniku i kod proverenih domaćih proizvođača. Datum proizvodnje je naveden na stranici svake biljke.'
  },
  {
    q: 'Šta ako biljka stigne oštećena ili uvene?',
    a: 'Javite nam se u roku od sedam dana sa fotografijom biljke, pa ćemo je zameniti ili vratiti novac.'
  },
  {
    q: 'Kako da biljku poklonim nekome?',
    a: 'Prilikom rezervacije u polje za napomenu upišite da je poklon i kakvo pakovanje želite (npr. kartica sa čestitkom ili poklon kutija). Mi ćemo je spakovati po vašoj želji.'
  },
  {
    q: 'Zašto neke biljke nemaju ocene?',
    a: 'Ocenu i recenziju mogu da ostave samo kupci kojima je biljka stigla. Nove biljke zato nemaju ocene dok ih neko ne oceni.'
  },
  {
    q: 'Kako da ostavim ocenu i recenziju?',
    a: 'Na stranici Rezervacije, kod porudžbine koja je stigla, izaberite ocenu, komentar i pošaljite ih.'
  },
  {
    q: 'Koliko biljaka mogu da rezervišem odjednom?',
    a: 'Jednom rezervacijom možete da rezervišete najviše 20 komada iste biljke.'
  },
  {
    q: 'Da li mogu da promenim količinu posle rezervacije?',
    a: 'Da, dok je rezervacija aktivna možete da promenite količinu i napomenu na stranici Rezervacije.'
  }
]
</script>

<template>
  <div class="faq-wrap">
    <div class="text-center mb-4">
      <h2 class="page-title mb-1">Najčešća pitanja</h2>
      <p class="text-body-secondary mb-0">Odgovori na ono što nas kupci najčešće pitaju.</p>
    </div>

    <div class="accordion" id="faq">
      <div class="accordion-item faq-item" v-for="(item, i) in questions" :key="i">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#faq-' + i"
          >
            <i class="fa-solid fa-circle-question me-2"></i>{{ item.q }}
          </button>
        </h2>
        <div :id="'faq-' + i" class="accordion-collapse collapse" data-bs-parent="#faq">
          <div class="accordion-body">{{ item.a }}</div>
        </div>
      </div>
    </div>
  </div>
</template>